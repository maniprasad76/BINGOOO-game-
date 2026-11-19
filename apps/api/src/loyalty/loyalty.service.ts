import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  Logger
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { generateSecureRewardCode } from '../common/crypto-random';
import { RewardStatus, RewardType, RewardSourceType, LoyaltyTransactionType } from '@bingooo/shared';
import { addDays } from 'date-fns';

@Injectable()
export class LoyaltyService {
  private readonly logger = new Logger(LoyaltyService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get or create loyalty account for customer
   */
  async getOrCreateAccount(customerId: string) {
    let account = await this.prisma.loyaltyAccount.findUnique({
      where: { customerId }
    });

    if (!account) {
      account = await this.prisma.loyaltyAccount.create({
        data: {
          customerId,
          status: 'ACTIVE'
        }
      });

      // Award one-time Welcome Bonus (20 coins)
      await this.awardCoins(
        customerId,
        20,
        LoyaltyTransactionType.BONUS,
        'WELCOME',
        account.id,
        `welcome_${customerId}`,
        'Welcome to BINGOOO Rewards Club!'
      );
    }

    return account;
  }

  /**
   * Get wallet summary: available balance, lifetime stats, recent ledger entries
   */
  async getWallet(customerId: string) {
    const account = await this.getOrCreateAccount(customerId);

    const entries = await this.prisma.loyaltyLedgerEntry.findMany({
      where: { customerId },
      orderBy: { occurredAt: 'desc' },
      take: 50
    });

    // Reconcile balance from ledger
    const availableBalance = entries.reduce((sum, e) => sum + e.amount, 0);
    const lifetimeEarned = entries
      .filter((e) => e.amount > 0)
      .reduce((sum, e) => sum + e.amount, 0);
    const lifetimeRedeemed = Math.abs(
      entries
        .filter((e) => e.amount < 0)
        .reduce((sum, e) => sum + e.amount, 0)
    );

    return {
      accountId: account.id,
      availableBalance: Math.max(0, availableBalance),
      lifetimeEarned,
      lifetimeRedeemed,
      status: account.status,
      recentTransactions: entries
    };
  }

  /**
   * Transactional Coin awarding with strict idempotency
   */
  async awardCoins(
    customerId: string,
    amount: number,
    type: LoyaltyTransactionType,
    sourceType: string,
    sourceId?: string,
    idempotencyKey?: string,
    description?: string
  ) {
    if (amount <= 0) return null;

    const account = await this.prisma.loyaltyAccount.findUnique({
      where: { customerId }
    });

    if (!account || account.status !== 'ACTIVE') {
      throw new BadRequestException('Loyalty account is not active.');
    }

    // Idempotency check
    if (idempotencyKey) {
      const existing = await this.prisma.loyaltyLedgerEntry.findUnique({
        where: { idempotencyKey }
      });
      if (existing) return existing;
    }

    return this.prisma.loyaltyLedgerEntry.create({
      data: {
        loyaltyAccountId: account.id,
        customerId,
        amount,
        type,
        sourceType,
        sourceId,
        idempotencyKey,
        metadata: JSON.stringify({ description })
      }
    });
  }

  /**
   * Available coin redemption tiers
   */
  getRedemptionOptions() {
    return [
      { id: 'tier_100', coinsRequired: 100, discountAmountPaise: 2500, label: '₹25 Store Voucher' },
      { id: 'tier_200', coinsRequired: 200, discountAmountPaise: 5000, label: '₹50 Store Voucher' },
      { id: 'tier_500', coinsRequired: 500, discountAmountPaise: 15000, label: '₹150 Store Voucher' },
      { id: 'tier_1000', coinsRequired: 1000, discountAmountPaise: 35000, label: '₹350 Store Voucher' }
    ];
  }

  /**
   * Atomically redeem coins into a verified store reward coupon
   */
  async redeemCoins(customerId: string, tierId: string, idempotencyKey?: string) {
    const options = this.getRedemptionOptions();
    const tier = options.find((o) => o.id === tierId);
    if (!tier) {
      throw new BadRequestException('Invalid redemption tier chosen.');
    }

    const key = idempotencyKey || `redeem_${customerId}_${tierId}_${Date.now()}`;

    // Prevent double clicking / retrying same request
    const existing = await this.prisma.loyaltyRedemption.findUnique({
      where: { idempotencyKey: key },
      include: { reward: true }
    });
    if (existing && existing.reward) {
      return { success: true, reward: existing.reward };
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Calculate balance inside transaction
      const entries = await tx.loyaltyLedgerEntry.findMany({
        where: { customerId }
      });
      const balance = entries.reduce((sum, e) => sum + e.amount, 0);

      if (balance < tier.coinsRequired) {
        throw new BadRequestException(
          `Insufficient BINGOOO Coins. You have ${balance} Coins, but ${tier.coinsRequired} are required.`
        );
      }

      // 2. Debit Coins from ledger
      const account = await tx.loyaltyAccount.findUnique({ where: { customerId } });
      await tx.loyaltyLedgerEntry.create({
        data: {
          loyaltyAccountId: account!.id,
          customerId,
          amount: -tier.coinsRequired, // Signed negative amount
          type: LoyaltyTransactionType.REDEEM,
          sourceType: RewardSourceType.COINS_REDEMPTION,
          idempotencyKey: key,
          metadata: JSON.stringify({ tierId, discountValuePaise: tier.discountAmountPaise })
        }
      });

      // 3. Issue unique coupon code
      const code = generateSecureRewardCode();
      const expiresAt = addDays(new Date(), 30);

      const reward = await tx.reward.create({
        data: {
          code,
          customerId,
          sourceType: RewardSourceType.COINS_REDEMPTION,
          type: RewardType.COINS_VOUCHER,
          status: RewardStatus.ISSUED,
          discountValuePaise: tier.discountAmountPaise,
          expiresAt
        }
      });

      // 4. Record redemption
      await tx.loyaltyRedemption.create({
        data: {
          customerId,
          coinsSpent: tier.coinsRequired,
          rewardId: reward.id,
          idempotencyKey: key
        }
      });

      return {
        success: true,
        reward,
        remainingBalance: balance - tier.coinsRequired
      };
    });
  }

  /**
   * Check if customer has already claimed Google Maps review reward
   */
  async checkGoogleReviewStatus(customerId: string) {
    const entry = await this.prisma.loyaltyLedgerEntry.findFirst({
      where: {
        customerId,
        sourceType: 'GOOGLE_REVIEW'
      }
    });

    return {
      claimed: !!entry,
      claimedAt: entry?.occurredAt?.toISOString() || null,
      coinsEarned: entry?.amount || 0,
      rewardAmount: 75,
      googleReviewUrl: 'https://maps.app.goo.gl/4V5n1LzD3XQ7Z7qTA' // Or https://search.google.com/local/writereview
    };
  }

  /**
   * Claim Google Maps 5-Star Review reward coins
   */
  async claimGoogleReviewReward(customerId: string, reviewerName?: string) {
    const existing = await this.prisma.loyaltyLedgerEntry.findFirst({
      where: {
        customerId,
        sourceType: 'GOOGLE_REVIEW'
      }
    });

    if (existing) {
      throw new BadRequestException('You have already claimed your Google Maps review bonus coins.');
    }

    const coinsReward = 75;
    const account = await this.getOrCreateAccount(customerId);

    await this.awardCoins(
      customerId,
      coinsReward,
      LoyaltyTransactionType.BONUS,
      'GOOGLE_REVIEW',
      account.id,
      `google_review_${customerId}`,
      reviewerName ? `Google Maps 5-Star Review (${reviewerName})` : 'Google Maps Review Bonus'
    );

    const wallet = await this.getWallet(customerId);

    return {
      success: true,
      coinsAwarded: coinsReward,
      newBalance: wallet.availableBalance,
      message: `🎉 Success! ${coinsReward} BINGOOO Coins added to your wallet for reviewing us on Google Maps.`
    };
  }
}
