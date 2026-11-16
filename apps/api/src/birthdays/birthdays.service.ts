import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { LoyaltyTransactionType, RewardSourceType, RewardType, RewardStatus } from '@bingooo/shared';
import { generateSecureRewardCode } from '../common/crypto-random';
import { toZonedTime } from 'date-fns-tz';
import { addDays } from 'date-fns';

const IST = 'Asia/Kolkata';

@Injectable()
export class BirthdaysService {
  private readonly logger = new Logger(BirthdaysService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly loyaltyService: LoyaltyService
  ) {}

  /**
   * Get or set customer birthday preferences
   */
  async getProfile(customerId: string) {
    let profile = await this.prisma.customerProfile.findUnique({
      where: { customerId }
    });

    if (!profile) {
      profile = await this.prisma.customerProfile.create({
        data: { customerId }
      });
    }

    return profile;
  }

  async updateBirthdayPreferences(
    customerId: string,
    birthMonth: number,
    birthDay: number,
    birthYear?: number,
    preferredClothingCategory?: string
  ) {
    if (birthMonth < 1 || birthMonth > 12) {
      throw new BadRequestException('Birth month must be between 1 and 12.');
    }
    if (birthDay < 1 || birthDay > 31) {
      throw new BadRequestException('Birth day must be between 1 and 31.');
    }

    const existing = await this.prisma.customerProfile.findUnique({
      where: { customerId }
    });

    // Fraud check: prevent changing birth date repeatedly if already set
    if (existing?.birthMonth && existing.birthDay && (existing.birthMonth !== birthMonth || existing.birthDay !== birthDay)) {
      if (existing.birthdayUpdatedAt) {
        throw new BadRequestException(
          'Birthday has already been updated once. For further changes, please contact store support.'
        );
      }
    }

    return this.prisma.customerProfile.upsert({
      where: { customerId },
      update: {
        birthMonth,
        birthDay,
        birthYear,
        preferredClothingCategory,
        birthdayOptInAt: new Date(),
        birthdayUpdatedAt: existing?.birthMonth ? new Date() : undefined
      },
      create: {
        customerId,
        birthMonth,
        birthDay,
        birthYear,
        preferredClothingCategory,
        birthdayOptInAt: new Date()
      }
    });
  }

  /**
   * Check eligibility for current calendar year birthday reward
   */
  async checkEligibility(customerId: string) {
    const profile = await this.getProfile(customerId);
    const now = toZonedTime(new Date(), IST);
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-12

    if (!profile.birthMonth || !profile.birthDay) {
      return {
        isEligible: false,
        requiresSetup: true,
        message: 'Please set your birth month and day to unlock birthday rewards.'
      };
    }

    // Check if already claimed this calendar year
    const existingClaim = await this.prisma.birthdayRewardClaim.findUnique({
      where: {
        customer_birthday_year_unique: {
          customerId,
          rewardYear: currentYear
        }
      },
      include: { reward: true }
    });

    if (existingClaim) {
      return {
        isEligible: false,
        alreadyClaimed: true,
        rewardYear: currentYear,
        claim: existingClaim,
        message: `You have already claimed your BINGOOO birthday reward for ${currentYear}!`
      };
    }

    // Eligible if current month is customer's birth month
    const isBirthMonth = profile.birthMonth === currentMonth;

    return {
      isEligible: isBirthMonth,
      alreadyClaimed: false,
      requiresSetup: false,
      birthMonth: profile.birthMonth,
      birthDay: profile.birthDay,
      rewardYear: currentYear,
      message: isBirthMonth
        ? 'Happy Birthday Month! Your exclusive BINGOOO birthday reward is ready to claim.'
        : `Your birthday reward will unlock during your birth month (${profile.birthMonth}).`
    };
  }

  /**
   * Claim annual birthday benefit (50 BINGOOO Coins + 10% Birthday Discount Voucher)
   */
  async claimBirthdayReward(customerId: string) {
    const elig = await this.checkEligibility(customerId);
    if (!elig.isEligible) {
      throw new BadRequestException(elig.message || 'Not eligible for birthday reward at this time.');
    }

    const currentYear = elig.rewardYear!;

    // 1. Issue 10% Birthday Discount Voucher
    const code = generateSecureRewardCode();
    const expiresAt = addDays(new Date(), 30);

    const reward = await this.prisma.reward.create({
      data: {
        code,
        customerId,
        sourceType: RewardSourceType.BIRTHDAY,
        type: RewardType.DISCOUNT_10,
        status: RewardStatus.ISSUED,
        discountPct: 10,
        expiresAt
      }
    });

    // 2. Record Claim
    const claim = await this.prisma.birthdayRewardClaim.create({
      data: {
        customerId,
        rewardYear: currentYear,
        rewardId: reward.id,
        status: 'CLAIMED'
      }
    });

    // 3. Award 50 Birthday Bonus Coins
    await this.loyaltyService.awardCoins(
      customerId,
      50,
      LoyaltyTransactionType.BONUS,
      'BIRTHDAY',
      claim.id,
      `birthday_coins_${customerId}_${currentYear}`,
      `BINGOOO Birthday Celebration Bonus ${currentYear}`
    );

    return {
      success: true,
      message: 'Happy Birthday! 50 Coins and 10% Birthday Pass added to your Rewards Club Wallet.',
      reward,
      claim
    };
  }

  async getHistory(customerId: string) {
    return this.prisma.birthdayRewardClaim.findMany({
      where: { customerId },
      include: { reward: true },
      orderBy: { issuedAt: 'desc' }
    });
  }
}
