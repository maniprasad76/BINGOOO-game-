import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { ReferralStatus, LoyaltyTransactionType, RewardSourceType, RewardType, RewardStatus } from '@bingooo/shared';
import { generateSecureRewardCode } from '../common/crypto-random';
import { addDays } from 'date-fns';
import * as crypto from 'crypto';

@Injectable()
export class ReferralsService {
  private readonly logger = new Logger(ReferralsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly loyaltyService: LoyaltyService
  ) {}

  /**
   * Generates or fetches customer's unique referral code like BGO8K42
   */
  async getOrCreateMyCode(customerId: string) {
    let refCode = await this.prisma.referralCode.findUnique({
      where: { customerId }
    });

    if (!refCode) {
      const codeChars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
      const bytes = crypto.randomBytes(4);
      let randomPart = '';
      for (let i = 0; i < 4; i++) {
        randomPart += codeChars[bytes[i] % codeChars.length];
      }
      const code = `BGO${randomPart}`;

      refCode = await this.prisma.referralCode.create({
        data: {
          customerId,
          code,
          active: true
        }
      });
    }

    return {
      code: refCode.code,
      referralLink: `https://bingooo.co.in/refer/${refCode.code}`
    };
  }

  /**
   * Get referral history & earned stats
   */
  async getReferralSummary(customerId: string) {
    const codeObj = await this.getOrCreateMyCode(customerId);

    const referrals = await this.prisma.referral.findMany({
      where: { referrerCustomerId: customerId },
      include: {
        referred: { select: { phoneNumber: true, createdAt: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const qualifiedCount = referrals.filter((r) => r.status === ReferralStatus.QUALIFIED || r.status === ReferralStatus.REWARDED).length;
    const pendingCount = referrals.filter((r) => r.status === ReferralStatus.PENDING || r.status === ReferralStatus.VERIFIED).length;
    const totalEarnedCoins = qualifiedCount * 50; // 50 coins per referral

    return {
      code: codeObj.code,
      referralLink: codeObj.referralLink,
      qualifiedCount,
      pendingCount,
      totalEarnedCoins,
      history: referrals.map((r) => ({
        id: r.id,
        maskedPhone: r.referred?.phoneNumber ? r.referred.phoneNumber.replace(/(\+\d{2})(\d{2})\d{4}(\d{4})/, '$1 $2*** **$3') : 'Visitor',
        status: r.status,
        createdAt: r.createdAt,
        qualifiedAt: r.qualifiedAt
      }))
    };
  }

  /**
   * When a friend signs up through a referral code
   */
  async attributeReferral(referredCustomerId: string, code: string) {
    const cleanCode = code.trim().toUpperCase();

    const referralCode = await this.prisma.referralCode.findUnique({
      where: { code: cleanCode }
    });

    if (!referralCode || !referralCode.active) {
      throw new BadRequestException('Invalid or inactive referral code.');
    }

    // Rule: Cannot refer self
    if (referralCode.customerId === referredCustomerId) {
      throw new BadRequestException('You cannot use your own referral code.');
    }

    // Rule: One referred customer can have only one credited referrer
    const existing = await this.prisma.referral.findUnique({
      where: { referredCustomerId }
    });

    if (existing) {
      return { success: true, message: 'Referral already attributed.' };
    }

    // Create referral record
    const referral = await this.prisma.referral.create({
      data: {
        referrerCustomerId: referralCode.customerId,
        referredCustomerId,
        referralCodeId: referralCode.id,
        status: ReferralStatus.VERIFIED
      }
    });

    // Issue welcome 5% discount coupon to referred friend
    const welcomeCode = generateSecureRewardCode();
    await this.prisma.reward.create({
      data: {
        code: welcomeCode,
        customerId: referredCustomerId,
        sourceType: RewardSourceType.REFERRAL_WELCOME,
        type: RewardType.DISCOUNT_5,
        status: RewardStatus.ISSUED,
        discountPct: 5,
        expiresAt: addDays(new Date(), 30)
      }
    });

    return {
      success: true,
      welcomeVoucherCode: welcomeCode,
      referralId: referral.id
    };
  }

  /**
   * Called when a friend completes their first qualifying purchase in store
   */
  async qualifyReferral(referredCustomerId: string, purchaseId: string) {
    const referral = await this.prisma.referral.findUnique({
      where: { referredCustomerId }
    });

    if (!referral || referral.status === ReferralStatus.QUALIFIED || referral.status === ReferralStatus.REWARDED) {
      return null;
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Mark referral as qualified
      const updated = await tx.referral.update({
        where: { id: referral.id },
        data: {
          firstPurchaseId: purchaseId,
          status: ReferralStatus.REWARDED,
          qualifiedAt: new Date(),
          rewardedAt: new Date()
        }
      });

      // 2. Award 50 BINGOOO Coins to referrer
      await this.loyaltyService.awardCoins(
        referral.referrerCustomerId,
        50,
        LoyaltyTransactionType.EARN,
        'REFERRAL',
        referral.id,
        `referral_payout_${referral.id}`,
        'Referral reward for friend first purchase'
      );

      return updated;
    });
  }
}
