import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  Logger
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { normalizeIndianPhoneNumber, maskPhoneNumber } from '../common/date-utils';
import { ISmsProvider, MockSmsProvider, ProductionSmsProvider } from './sms.provider';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private smsProvider: ISmsProvider;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {
    const isMock = this.configService.get<string>('MOCK_OTP_ENABLED') === 'true';
    const nodeEnv = this.configService.get<string>('NODE_ENV');

    if (nodeEnv === 'production' && isMock) {
      throw new Error('SECURITY VIOLATION: MOCK_OTP_ENABLED cannot be true in production environment!');
    }

    if (isMock) {
      this.smsProvider = new MockSmsProvider();
    } else {
      this.smsProvider = new ProductionSmsProvider(
        this.configService.get<string>('SMS_PROVIDER', 'msg91'),
        this.configService.get<string>('SMS_API_KEY', ''),
        this.configService.get<string>('SMS_SENDER_ID', ''),
        this.configService.get<string>('SMS_TEMPLATE_ID', '')
      );
    }
  }

  async requestOtp(rawPhone: string, marketingConsent = false, ipAddress?: string, userAgent?: string) {
    const canonicalPhone = normalizeIndianPhoneNumber(rawPhone);
    const cooldownSec = this.configService.get<number>('OTP_RESEND_COOLDOWN_SECONDS', 60);

    // Rate-limit check: cooldown per phone number
    const recentChallenge = await this.prisma.otpChallenge.findFirst({
      where: { phoneNumber: canonicalPhone },
      orderBy: { createdAt: 'desc' }
    });

    if (recentChallenge) {
      const elapsedSeconds = (Date.now() - recentChallenge.createdAt.getTime()) / 1000;
      if (elapsedSeconds < cooldownSec) {
        const remaining = Math.ceil(cooldownSec - elapsedSeconds);
        throw new BadRequestException(`Please wait ${remaining} seconds before requesting a new OTP.`);
      }
    }

    // Upsert customer
    const customer = await this.prisma.customer.upsert({
      where: { phoneNumber: canonicalPhone },
      update: { marketingConsent: !!marketingConsent },
      create: {
        phoneNumber: canonicalPhone,
        marketingConsent: !!marketingConsent
      }
    });

    // Generate OTP
    const isMock = this.configService.get<string>('MOCK_OTP_ENABLED') === 'true';
    const mockCode = this.configService.get<string>('MOCK_OTP_CODE', '123456');
    const otp = isMock ? mockCode : Math.floor(100000 + Math.random() * 900000).toString();

    const codeHash = crypto.createHash('sha256').update(otp).digest('hex');
    const expiryMinutes = this.configService.get<number>('OTP_EXPIRATION_MINUTES', 5);
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Create challenge
    const challenge = await this.prisma.otpChallenge.create({
      data: {
        customerId: customer.id,
        phoneNumber: canonicalPhone,
        codeHash,
        expiresAt,
        maxAttempts: 5,
        ipAddress,
        userAgent
      }
    });

    await this.smsProvider.sendOtp(canonicalPhone, otp);

    return {
      success: true,
      challengeId: challenge.id,
      maskedPhone: maskPhoneNumber(canonicalPhone),
      expiresInSeconds: expiryMinutes * 60,
      resendCooldownSeconds: cooldownSec,
      // Provide mock hint only when mock is enabled in non-production
      ...(isMock ? { devMockOtp: otp } : {})
    };
  }

  async verifyOtp(challengeId: string, otpCode: string, ipAddress?: string, userAgent?: string) {
    if (!challengeId || !otpCode) {
      throw new BadRequestException('Challenge ID and OTP code are required.');
    }

    const challenge = await this.prisma.otpChallenge.findUnique({
      where: { id: challengeId },
      include: { customer: true }
    });

    if (!challenge) {
      throw new BadRequestException('Invalid or expired verification session.');
    }

    if (challenge.isConsumed) {
      throw new BadRequestException('This OTP has already been used.');
    }

    if (new Date() > challenge.expiresAt) {
      throw new BadRequestException('OTP has expired. Please request a new code.');
    }

    if (challenge.attempts >= challenge.maxAttempts) {
      throw new ForbiddenException('Too many incorrect attempts. This OTP session is locked.');
    }

    const providedHash = crypto.createHash('sha256').update(otpCode.trim()).digest('hex');
    if (providedHash !== challenge.codeHash) {
      await this.prisma.otpChallenge.update({
        where: { id: challenge.id },
        data: { attempts: { increment: 1 } }
      });
      const remaining = challenge.maxAttempts - (challenge.attempts + 1);
      throw new BadRequestException(`Incorrect OTP. ${remaining} attempts remaining.`);
    }

    // Mark challenge consumed & customer verified
    await this.prisma.otpChallenge.update({
      where: { id: challenge.id },
      data: { isConsumed: true }
    });

    await this.prisma.customer.update({
      where: { id: challenge.customerId },
      data: { isVerified: true }
    });

    // Create signed CustomerSession token
    const tokenSecret = this.configService.get<string>('JWT_CUSTOMER_SECRET', 'secret');
    const sessionHours = this.configService.get<number>('CUSTOMER_SESSION_EXPIRES_HOURS', 24);
    const sessionExpiresAt = new Date(Date.now() + sessionHours * 3600 * 1000);

    const token = this.jwtService.sign(
      { sub: challenge.customerId, phone: challenge.phoneNumber, role: 'CUSTOMER' },
      { secret: tokenSecret, expiresIn: `${sessionHours}h` }
    );

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    await this.prisma.customerSession.create({
      data: {
        customerId: challenge.customerId,
        tokenHash,
        expiresAt: sessionExpiresAt,
        ipAddress,
        userAgent
      }
    });

    return {
      token,
      customer: {
        id: challenge.customerId,
        maskedPhone: maskPhoneNumber(challenge.phoneNumber),
        isVerified: true
      }
    };
  }

  /**
   * Direct customer login / register via email
   */
  async loginWithEmail(email: string, displayName?: string, ipAddress?: string, userAgent?: string) {
    if (!email || !email.includes('@')) {
      throw new BadRequestException('Please provide a valid email address.');
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find or create customer by email
    let customer = await this.prisma.customer.findUnique({
      where: { email: cleanEmail }
    });

    let isNewCustomer = false;

    if (!customer) {
      isNewCustomer = true;
      const dummyPhone = `+9100${Math.floor(10000000 + Math.random() * 90000000)}`;
      customer = await this.prisma.customer.create({
        data: {
          email: cleanEmail,
          displayName: displayName || cleanEmail.split('@')[0],
          phoneNumber: dummyPhone,
          isVerified: true
        }
      });
    }

    // Create signed CustomerSession token
    const tokenSecret = this.configService.get<string>('JWT_CUSTOMER_SECRET', 'secret');
    const sessionHours = this.configService.get<number>('CUSTOMER_SESSION_EXPIRES_HOURS', 720); // 30 days
    const sessionExpiresAt = new Date(Date.now() + sessionHours * 3600 * 1000);

    const token = this.jwtService.sign(
      { sub: customer.id, email: customer.email, role: 'CUSTOMER' },
      { secret: tokenSecret, expiresIn: `${sessionHours}h` }
    );

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    await this.prisma.customerSession.create({
      data: {
        customerId: customer.id,
        tokenHash,
        expiresAt: sessionExpiresAt,
        ipAddress,
        userAgent
      }
    });

    return {
      success: true,
      token,
      isNewCustomer,
      customer: {
        id: customer.id,
        email: customer.email,
        displayName: customer.displayName,
        isVerified: true
      }
    };
  }

  async getOrCreateVisitor(visitorId: string) {
    let customer = await this.prisma.customer.findUnique({
      where: { visitorId }
    });

    if (!customer) {
      // Generate unique dummy phone for visitor if unverified phone
      const dummyPhone = `+9100${Math.floor(10000000 + Math.random() * 90000000)}`;
      customer = await this.prisma.customer.create({
        data: {
          visitorId,
          phoneNumber: dummyPhone,
          isVerified: true,
          marketingConsent: false
        }
      });
    }

    return customer;
  }

  async validateCustomerToken(token: string) {
    try {
      const tokenSecret = this.configService.get<string>('JWT_CUSTOMER_SECRET', 'secret');
      const payload = this.jwtService.verify(token, { secret: tokenSecret });

      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      const session = await this.prisma.customerSession.findUnique({
        where: { tokenHash },
        include: { customer: true }
      });

      if (!session || new Date() > session.expiresAt) {
        throw new UnauthorizedException('Session expired or invalidated.');
      }

      return session.customer;
    } catch {
      throw new UnauthorizedException('Invalid customer authorization token.');
    }
  }

  async logout(token: string) {
    if (!token) return { success: true };
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    await this.prisma.customerSession.deleteMany({
      where: { tokenHash }
    });
    return { success: true };
  }

  // Admin login
  async adminLogin(usernameOrEmail: string, passwordPlain: string, ipAddress?: string) {
    const admin = await this.prisma.adminUser.findFirst({
      where: {
        OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
      }
    });

    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Invalid administrative credentials.');
    }

    const isValid = await argon2.verify(admin.passwordHash, passwordPlain);
    if (!isValid) {
      throw new UnauthorizedException('Invalid administrative credentials.');
    }

    const adminSecret = this.configService.get<string>('JWT_ADMIN_SECRET', 'admin_secret');
    const token = this.jwtService.sign(
      { sub: admin.id, username: admin.username, role: admin.role },
      { secret: adminSecret, expiresIn: '12h' }
    );

    await this.prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'ADMIN_LOGIN',
        entityType: 'AdminUser',
        entityId: admin.id,
        ipAddress
      }
    });

    return {
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    };
  }
}
