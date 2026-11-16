import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { RewardStatus } from '@bingooo/shared';

@Injectable()
export class RewardsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCustomerRewards(customerId: string) {
    return this.prisma.reward.findMany({
      where: { customerId },
      include: {
        prize: true,
        campaign: true,
        redemption: {
          include: { staff: { select: { name: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getRewardByCode(code: string, customerId?: string) {
    const cleanCode = code.trim().toUpperCase();
    const reward = await this.prisma.reward.findUnique({
      where: { code: cleanCode },
      include: {
        prize: true,
        campaign: true,
        customer: { select: { phoneNumber: true } },
        redemption: {
          include: { staff: { select: { name: true } } }
        }
      }
    });

    if (!reward) {
      throw new NotFoundException(`Reward voucher with code ${cleanCode} not found.`);
    }

    // Check expiration and dynamically mark if past expiry
    if (reward.status === RewardStatus.ISSUED && new Date() > reward.expiresAt) {
      await this.prisma.reward.update({
        where: { id: reward.id },
        data: { status: RewardStatus.EXPIRED }
      });
      reward.status = RewardStatus.EXPIRED;
    }

    return reward;
  }

  /**
   * Secure staff redemption with atomic status transition
   */
  async redeemReward(code: string, staffId: string, storeLocation = 'Srikakulam Store', notes?: string) {
    const cleanCode = code.trim().toUpperCase();

    return this.prisma.$transaction(async (tx) => {
      const reward = await tx.reward.findUnique({
        where: { code: cleanCode },
        include: { prize: { include: { giftInventory: true } } }
      });

      if (!reward) {
        throw new NotFoundException(`Invalid voucher code: ${cleanCode}`);
      }

      if (reward.status === RewardStatus.REDEEMED) {
        throw new BadRequestException('This voucher has already been redeemed.');
      }

      if (reward.status === RewardStatus.CANCELLED) {
        throw new ForbiddenException('This voucher has been cancelled or revoked.');
      }

      if (new Date() > reward.expiresAt) {
        await tx.reward.update({
          where: { id: reward.id },
          data: { status: RewardStatus.EXPIRED }
        });
        throw new BadRequestException('This voucher has expired and cannot be redeemed.');
      }

      // Transition to REDEEMED
      const updatedReward = await tx.reward.update({
        where: { id: reward.id },
        data: { status: RewardStatus.REDEEMED }
      });

      // Create redemption audit record
      const redemption = await tx.redemption.create({
        data: {
          rewardId: reward.id,
          staffId,
          storeLocation,
          notes
        }
      });

      // If gift, reconcile inventory (shift from reserved to redeemed)
      if (reward.isGift && reward.prize.giftInventory) {
        await tx.giftInventory.update({
          where: { prizeId: reward.prizeId },
          data: {
            reservedStock: { decrement: 1 },
            redeemedStock: { increment: 1 }
          }
        });
      }

      return {
        success: true,
        reward: updatedReward,
        redemption
      };
    });
  }

  async revokeReward(rewardId: string, adminId: string, reason: string) {
    const reward = await this.prisma.reward.findUnique({
      where: { id: rewardId },
      include: { prize: { include: { giftInventory: true } } }
    });

    if (!reward) {
      throw new NotFoundException('Reward not found');
    }

    if (reward.status === RewardStatus.REDEEMED) {
      throw new BadRequestException('Cannot revoke an already redeemed reward.');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.reward.update({
        where: { id: rewardId },
        data: {
          status: RewardStatus.CANCELLED,
          revokedAt: new Date(),
          revokeReason: reason
        }
      });

      // Release reserved gift inventory if applicable
      if (reward.isGift && reward.prize.giftInventory) {
        await tx.giftInventory.update({
          where: { prizeId: reward.prizeId },
          data: { reservedStock: { decrement: 1 } }
        });
      }

      await tx.auditLog.create({
        data: {
          adminId,
          action: 'REWARD_REVOKED',
          entityType: 'Reward',
          entityId: rewardId,
          details: JSON.stringify({ reason, code: reward.code })
        }
      });

      return updated;
    });
  }
}
