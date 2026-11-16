import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { LoyaltyTransactionType, StoreCheckInStatus } from '@bingooo/shared';
import { formatInTimeZone } from 'date-fns-tz';
import * as crypto from 'crypto';

const IST = 'Asia/Kolkata';

@Injectable()
export class StoreQrService {
  private readonly logger = new Logger(StoreQrService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly loyaltyService: LoyaltyService
  ) {}

  /**
   * Generates dynamic signed QR challenge rotating periodically on staff screen
   */
  async generateDynamicChallenge(storeId: string, adminId: string) {
    const nonce = crypto.randomBytes(16).toString('hex');
    const nonceHash = crypto.createHash('sha256').update(nonce).digest('hex');
    // Valid for 5 minutes
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const challenge = await this.prisma.qrChallenge.create({
      data: {
        storeId,
        nonceHash,
        expiresAt,
        createdByAdminId: adminId,
        status: 'ACTIVE'
      }
    });

    return {
      challengeId: challenge.id,
      storeId,
      token: nonce,
      expiresAt: challenge.expiresAt
    };
  }

  /**
   * Customer scans store QR and requests visit check-in
   */
  async requestCheckIn(customerId: string, storeId: string, qrNonce?: string) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId }
    });

    if (!store || !store.active) {
      throw new BadRequestException('Store not found or currently inactive.');
    }

    const todayPeriodKey = formatInTimeZone(new Date(), IST, 'yyyy-MM-dd');

    // Rule: Exactly one visit bonus per customer per store per day
    const existing = await this.prisma.storeCheckIn.findUnique({
      where: {
        customer_store_day_unique: {
          customerId,
          storeId,
          checkInPeriodKey: todayPeriodKey
        }
      }
    });

    if (existing) {
      return {
        success: false,
        status: existing.status,
        message: 'You have already checked in at this store today!'
      };
    }

    // Create pending check-in for staff verification
    const checkIn = await this.prisma.storeCheckIn.create({
      data: {
        storeId,
        customerId,
        checkInPeriodKey: todayPeriodKey,
        status: StoreCheckInStatus.PENDING,
        coinsAwarded: 5 // Default 5 coins
      }
    });

    return {
      success: true,
      checkInId: checkIn.id,
      status: checkIn.status,
      message: 'Check-in request submitted! Please ask staff to approve your visit.'
    };
  }

  /**
   * Store staff approves physical presence & awards 5 Coins
   */
  async approveCheckIn(checkInId: string, staffId: string) {
    const checkIn = await this.prisma.storeCheckIn.findUnique({
      where: { id: checkInId }
    });

    if (!checkIn) {
      throw new NotFoundException('Check-in not found.');
    }

    if (checkIn.status === StoreCheckInStatus.VERIFIED) {
      return { success: true, message: 'Already approved.' };
    }

    const updated = await this.prisma.storeCheckIn.update({
      where: { id: checkInId },
      data: {
        status: StoreCheckInStatus.VERIFIED,
        verifiedByAdminId: staffId,
        verifiedAt: new Date()
      }
    });

    // Award 5 Coins
    await this.loyaltyService.awardCoins(
      checkIn.customerId,
      checkIn.coinsAwarded || 5,
      LoyaltyTransactionType.EARN,
      'STORE_VISIT',
      checkIn.id,
      `checkin_coins_${checkIn.id}`,
      'Physical store visit bonus'
    );

    return {
      success: true,
      checkIn: updated
    };
  }

  async getStores() {
    return this.prisma.store.findMany({ where: { active: true } });
  }

  async getCustomerCheckInHistory(customerId: string) {
    return this.prisma.storeCheckIn.findMany({
      where: { customerId },
      include: { store: true },
      orderBy: { createdAt: 'desc' }
    });
  }
}
