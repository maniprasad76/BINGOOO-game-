import {
  Injectable,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { getCurrentPeriodKey, getMonthBoundaries } from '../common/date-utils';
import {
  CryptoRandomGenerator,
  IRandomGenerator,
  generateSecureRewardCode
} from '../common/crypto-random';
import { PrizeType, RewardStatus, SpinStatus } from '@bingooo/shared';
import { addDays } from 'date-fns';

export interface SpinExecutionResult {
  spinId: string;
  prizeType: PrizeType;
  prizeName: string;
  description: string;
  rewardCode?: string;
  expiresAt?: string;
  segmentIndex: number;
  isWin: boolean;
  isTryAgain?: boolean;
  periodKey: string;
}

@Injectable()
export class WheelService {
  private readonly logger = new Logger(WheelService.name);
  private randomGen: IRandomGenerator;

  constructor(private readonly prisma: PrismaService) {
    this.randomGen = new CryptoRandomGenerator();
  }

  // Injectable for deterministic tests
  setRandomGenerator(gen: IRandomGenerator) {
    this.randomGen = gen;
  }

  /**
   * Retrieves active wheel visual segments configuration for frontend rendering
   */
  async getWheelConfig() {
    const prizes = await this.prisma.prize.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' }
    });

    // 8-segment balanced wheel arrangement: 20% OFF, BETTER LUCK, 10% OFF, TRY AGAIN, FREE GIFT, 5% OFF, BETTER LUCK, 10% OFF
    const p20 = prizes.find((p) => p.type === PrizeType.DISCOUNT_20);
    const p10 = prizes.find((p) => p.type === PrizeType.DISCOUNT_10);
    const p5 = prizes.find((p) => p.type === PrizeType.DISCOUNT_5);
    const pGift = prizes.find((p) => p.type === PrizeType.FREE_GIFT);
    const pBetter = prizes.find((p) => p.type === PrizeType.BETTER_LUCK || p.type === PrizeType.NO_PRIZE);
    const pAgain = prizes.find((p) => p.type === PrizeType.TRY_AGAIN);

    const segments = [
      { id: 'seg-1', prizeType: PrizeType.DISCOUNT_20, label: '20% OFF', color: '#C91F32', textColor: '#FFFFFF', prizeId: p20?.id },
      { id: 'seg-2', prizeType: PrizeType.BETTER_LUCK, label: 'BETTER LUCK', color: '#1B1B1B', textColor: '#FFFFFF', prizeId: pBetter?.id },
      { id: 'seg-3', prizeType: PrizeType.DISCOUNT_10, label: '10% OFF', color: '#D4AF37', textColor: '#111111', prizeId: p10?.id },
      { id: 'seg-4', prizeType: PrizeType.TRY_AGAIN, label: 'TRY AGAIN', color: '#F5B700', textColor: '#111111', prizeId: pAgain?.id },
      { id: 'seg-5', prizeType: PrizeType.FREE_GIFT, label: 'FREE GIFT', color: '#C91F32', textColor: '#FFFFFF', prizeId: pGift?.id },
      { id: 'seg-6', prizeType: PrizeType.DISCOUNT_5, label: '5% OFF', color: '#1B1B1B', textColor: '#D4AF37', prizeId: p5?.id },
      { id: 'seg-7', prizeType: PrizeType.BETTER_LUCK, label: 'BETTER LUCK', color: '#D4AF37', textColor: '#111111', prizeId: pBetter?.id },
      { id: 'seg-8', prizeType: PrizeType.DISCOUNT_10, label: '10% OFF', color: '#C91F32', textColor: '#FFFFFF', prizeId: p10?.id }
    ];

    return { segments, prizes };
  }

  /**
   * Checks monthly spin eligibility for the verified customer
   */
  async checkEligibility(customerId: string) {
    const boundaries = getMonthBoundaries();
    const periodKey = boundaries.periodKey;

    const existingSpin = await this.prisma.spin.findUnique({
      where: {
        customer_period_unique: {
          customerId,
          periodKey
        }
      },
      include: {
        prize: true,
        reward: true
      }
    });

    if (existingSpin) {
      return {
        isEligible: false,
        periodKey,
        nextEligibleAt: boundaries.nextMonthIso,
        reason: 'You have already spun the wheel for this calendar month.',
        currentResult: {
          spinId: existingSpin.id,
          prizeType: existingSpin.prize.type,
          prizeName: existingSpin.prize.name,
          rewardCode: existingSpin.reward?.code,
          completedAt: existingSpin.completedAt.toISOString()
        }
      };
    }

    return {
      isEligible: true,
      periodKey,
      nextEligibleAt: boundaries.nextMonthIso
    };
  }

  /**
   * Atomic, transaction-safe, CSPRNG-powered Spin Engine
   */
  async executeSpin(customerId: string, clientIp?: string, idempotencyKey?: string): Promise<SpinExecutionResult> {
    const boundaries = getMonthBoundaries();
    const periodKey = boundaries.periodKey;

    // Fast check for idempotency / existing spin
    const existing = await this.prisma.spin.findUnique({
      where: {
        customer_period_unique: {
          customerId,
          periodKey
        }
      },
      include: {
        prize: true,
        reward: true
      }
    });

    if (existing) {
      // Idempotency: Return the committed outcome
      const wheelConfig = await this.getWheelConfig();
      const segIndex = wheelConfig.segments.findIndex((s) => s.prizeType === existing.prize.type);

      return {
        spinId: existing.id,
        prizeType: existing.prize.type as PrizeType,
        prizeName: existing.prize.name,
        description: existing.prize.description,
        rewardCode: existing.reward?.code,
        expiresAt: existing.reward?.expiresAt?.toISOString(),
        segmentIndex: segIndex >= 0 ? segIndex : 1,
        isWin: existing.prize.type !== PrizeType.NO_PRIZE,
        periodKey
      };
    }

    // Get active campaign
    let campaign = await this.prisma.campaign.findUnique({
      where: { periodKey }
    });

    if (!campaign) {
      campaign = await this.prisma.campaign.create({
        data: {
          name: `BINGOOO Campaign ${periodKey}`,
          periodKey,
          startsAt: boundaries.currentMonthStart,
          endsAt: boundaries.nextMonthStart,
          isActive: true
        }
      });
    }

    // Load active prizes
    const prizes = await this.prisma.prize.findMany({
      where: { isActive: true },
      include: { giftInventory: true }
    });

    if (!prizes || prizes.length === 0) {
      throw new BadRequestException('No active prizes configured in system.');
    }

    // Weighted Probability Selection (10,000 basis points)
    // 10% = 1000 bp, 30% = 3000 bp, 10% = 1000 bp, 50% = 5000 bp
    const totalBasisPoints = prizes.reduce((sum, p) => sum + (p.basisPoints || p.weight * 100), 0);
    const randomPick = this.randomGen.next(totalBasisPoints);

    let cumulative = 0;
    let selectedPrize = prizes[prizes.length - 1];

    for (const prize of prizes) {
      cumulative += (prize.basisPoints || prize.weight * 100);
      if (randomPick < cumulative) {
        selectedPrize = prize;
        break;
      }
    }

    // Fallback if FREE GIFT is selected but inventory is exhausted
    if (selectedPrize.type === PrizeType.FREE_GIFT) {
      const inv = selectedPrize.giftInventory;
      if (!inv || (inv.totalStock - inv.reservedStock) <= 0) {
        this.logger.warn(`Free gift inventory exhausted! Falling back to 5% discount.`);
        const fallback = prizes.find((p) => p.type === PrizeType.DISCOUNT_5) || prizes.find((p) => p.type === PrizeType.NO_PRIZE);
        if (fallback) selectedPrize = fallback;
      }
    }

    // Calculate expiry (default 30 days)
    const rewardExpiryDays = 30;
    const expiresAt = addDays(new Date(), rewardExpiryDays);

    const isTryAgain = selectedPrize.type === PrizeType.TRY_AGAIN;
    const isBetterLuck = selectedPrize.type === PrizeType.BETTER_LUCK || selectedPrize.type === PrizeType.NO_PRIZE;
    const isWin = !isTryAgain && !isBetterLuck;

    // For TRY_AGAIN, use a non-locking periodKey suffix so customer can spin again immediately
    const spinPeriodKey = isTryAgain ? `${periodKey}_try_again_${Date.now()}` : periodKey;

    // Run within atomic database transaction with strict uniqueness constraint
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        // Reserve gift inventory inside transaction
        if (selectedPrize.type === PrizeType.FREE_GIFT && selectedPrize.giftInventory) {
          await tx.giftInventory.update({
            where: { prizeId: selectedPrize.id },
            data: { reservedStock: { increment: 1 } }
          });
        }

        // Create Spin record
        const spin = await tx.spin.create({
          data: {
            customerId,
            campaignId: campaign!.id,
            periodKey: spinPeriodKey,
            prizeId: selectedPrize.id,
            status: SpinStatus.COMPLETED,
            idempotencyKey,
            clientIp
          }
        });

        // If winning prize, create Reward voucher
        let reward = null;
        if (isWin) {
          const discountPct =
            selectedPrize.type === PrizeType.DISCOUNT_20
              ? 20
              : selectedPrize.type === PrizeType.DISCOUNT_10
              ? 10
              : selectedPrize.type === PrizeType.DISCOUNT_5
              ? 5
              : null;

          const isGift = selectedPrize.type === PrizeType.FREE_GIFT;
          const code = generateSecureRewardCode();

          reward = await tx.reward.create({
            data: {
              code,
              customerId,
              spinId: spin.id,
              prizeId: selectedPrize.id,
              campaignId: campaign!.id,
              type: selectedPrize.type,
              sourceType: 'SPIN',
              status: RewardStatus.ISSUED,
              discountPct,
              isGift,
              expiresAt
            }
          });
        }

        return { spin, reward };
      });

      // Map to visual wheel segment
      const wheelConfig = await this.getWheelConfig();
      // Find matching segments on the 8-segment wheel
      const matchingIndices = wheelConfig.segments
        .map((s, idx) => (s.prizeType === selectedPrize.type ? idx : -1))
        .filter((idx) => idx !== -1);

      // Pick one matching segment cleanly
      const chosenSegmentIndex = matchingIndices.length > 0
        ? matchingIndices[this.randomGen.next(matchingIndices.length)]
        : 0;

      return {
        spinId: result.spin.id,
        prizeType: selectedPrize.type as PrizeType,
        prizeName: selectedPrize.name,
        description: selectedPrize.description,
        rewardCode: result.reward?.code,
        expiresAt: result.reward?.expiresAt?.toISOString(),
        segmentIndex: chosenSegmentIndex,
        isWin,
        isTryAgain,
        periodKey
      };
    } catch (error: any) {
      // Catch duplicate key error in PostgreSQL (P2002)
      if (error.code === 'P2002') {
        this.logger.warn(`Concurrent spin detected for customer ${customerId} in period ${periodKey}`);
        // Fetch existing result and return idempotently
        const existingCommitted = await this.prisma.spin.findUnique({
          where: { customer_period_unique: { customerId, periodKey } },
          include: { prize: true, reward: true }
        });

        if (existingCommitted) {
          const wheelConfig = await this.getWheelConfig();
          const segIndex = wheelConfig.segments.findIndex((s) => s.prizeType === existingCommitted.prize.type);
          return {
            spinId: existingCommitted.id,
            prizeType: existingCommitted.prize.type as PrizeType,
            prizeName: existingCommitted.prize.name,
            description: existingCommitted.prize.description,
            rewardCode: existingCommitted.reward?.code,
            expiresAt: existingCommitted.reward?.expiresAt?.toISOString(),
            segmentIndex: segIndex >= 0 ? segIndex : 1,
            isWin: existingCommitted.prize.type !== PrizeType.NO_PRIZE,
            periodKey
          };
        }
      }
      throw new InternalServerErrorException(error.message || 'Failed to execute spin transaction');
    }
  }

  async getCustomerSpinHistory(customerId: string) {
    return this.prisma.spin.findMany({
      where: { customerId },
      include: {
        prize: true,
        reward: true,
        campaign: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
