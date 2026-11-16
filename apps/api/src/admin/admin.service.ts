import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PrizeType, Role } from '@bingooo/shared';
import { startOfDay, subDays } from 'date-fns';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Complete KPI summary for Admin Dashboard
   */
  async getDashboardSummary() {
    const todayStart = startOfDay(new Date());

    const [
      totalCustomers,
      verifiedCustomers,
      spinsToday,
      spinsTotal,
      prizesBreakdown,
      rewardStats,
      activePrizes,
      giftInventory,
      loyaltyCoinsStats,
      referralCount,
      checkInCount
    ] = await Promise.all([
      this.prisma.customer.count(),
      this.prisma.customer.count({ where: { isVerified: true } }),
      this.prisma.spin.count({ where: { createdAt: { gte: todayStart } } }),
      this.prisma.spin.count(),
      this.prisma.spin.groupBy({
        by: ['prizeId'],
        _count: { id: true }
      }),
      this.prisma.reward.groupBy({
        by: ['status'],
        _count: { id: true }
      }),
      this.prisma.prize.findMany({ include: { giftInventory: true } }),
      this.prisma.giftInventory.findMany(),
      this.prisma.loyaltyLedgerEntry.findMany({ select: { amount: true } }),
      this.prisma.referral.count({ where: { status: 'REWARDED' } }),
      this.prisma.storeCheckIn.count({ where: { status: 'VERIFIED' } })
    ]);

    const totalCoinsIssued = loyaltyCoinsStats
      .filter((e) => e.amount > 0)
      .reduce((sum, e) => sum + e.amount, 0);
    const totalCoinsRedeemed = Math.abs(
      loyaltyCoinsStats
        .filter((e) => e.amount < 0)
        .reduce((sum, e) => sum + e.amount, 0)
    );

    const prizeMap = new Map(activePrizes.map((p) => [p.id, p]));

    const prizeCounts = {
      discount10: 0,
      discount5: 0,
      freeGift: 0,
      noPrize: 0
    };

    prizesBreakdown.forEach((item) => {
      const p = prizeMap.get(item.prizeId);
      if (p) {
        if (p.type === PrizeType.DISCOUNT_10) prizeCounts.discount10 += item._count.id;
        else if (p.type === PrizeType.DISCOUNT_5) prizeCounts.discount5 += item._count.id;
        else if (p.type === PrizeType.FREE_GIFT) prizeCounts.freeGift += item._count.id;
        else if (p.type === PrizeType.NO_PRIZE) prizeCounts.noPrize += item._count.id;
      }
    });

    const rewardCounts = {
      issued: 0,
      redeemed: 0,
      expired: 0,
      cancelled: 0
    };

    rewardStats.forEach((item) => {
      if (item.status === 'ISSUED') rewardCounts.issued = item._count.id;
      if (item.status === 'REDEEMED') rewardCounts.redeemed = item._count.id;
      if (item.status === 'EXPIRED') rewardCounts.expired = item._count.id;
      if (item.status === 'CANCELLED') rewardCounts.cancelled = item._count.id;
    });

    const totalGiftStock = giftInventory.reduce((acc, i) => acc + (i.totalStock - i.reservedStock - i.redeemedStock), 0);

    return {
      totalCustomers,
      verifiedCustomers,
      spinsToday,
      spinsTotal,
      prizeCounts,
      rewardCounts,
      totalGiftStockRemaining: Math.max(0, totalGiftStock),
      totalCoinsIssued,
      totalCoinsRedeemed,
      outstandingCoins: totalCoinsIssued - totalCoinsRedeemed,
      qualifiedReferrals: referralCount,
      verifiedCheckIns: checkInCount
    };
  }

  async getCustomers(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where = search
      ? { phoneNumber: { contains: search } }
      : {};

    const [total, data] = await Promise.all([
      this.prisma.customer.count({ where }),
      this.prisma.customer.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: { select: { spins: true, rewards: true } }
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return { total, page, limit, data };
  }

  async getSpins(page = 1, limit = 20, periodKey?: string) {
    const skip = (page - 1) * limit;
    const where = periodKey ? { periodKey } : {};

    const [total, data] = await Promise.all([
      this.prisma.spin.count({ where }),
      this.prisma.spin.findMany({
        where,
        skip,
        take: limit,
        include: {
          customer: { select: { phoneNumber: true } },
          prize: true,
          reward: true,
          campaign: true
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return { total, page, limit, data };
  }

  async getRewards(page = 1, limit = 20, status?: string) {
    const skip = (page - 1) * limit;
    const where = status ? { status: status as any } : {};

    const [total, data] = await Promise.all([
      this.prisma.reward.count({ where }),
      this.prisma.reward.findMany({
        where,
        skip,
        take: limit,
        include: {
          customer: { select: { phoneNumber: true } },
          prize: true,
          redemption: { include: { staff: { select: { name: true, username: true } } } }
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return { total, page, limit, data };
  }

  async getPrizes() {
    return this.prisma.prize.findMany({
      include: { giftInventory: true },
      orderBy: { displayOrder: 'asc' }
    });
  }

  /**
   * Only SUPER_ADMIN can configure prize probabilities.
   * Enforces 10,000 basis points (100.00%) total weight validation.
   */
  async updatePrizes(
    prizesData: Array<{ id: string; weight: number; basisPoints?: number; isActive: boolean }>,
    adminId: string
  ) {
    // Validate total active probabilities
    const activePrizes = prizesData.filter((p) => p.isActive);
    const totalBasisPoints = activePrizes.reduce(
      (sum, p) => sum + (p.basisPoints !== undefined ? p.basisPoints : p.weight * 100),
      0
    );

    if (totalBasisPoints !== 10000) {
      throw new BadRequestException(
        `Invalid probabilities: Total must equal 10,000 basis points (100%). Received: ${totalBasisPoints}`
      );
    }

    return this.prisma.$transaction(async (tx) => {
      for (const p of prizesData) {
        await tx.prize.update({
          where: { id: p.id },
          data: {
            weight: p.weight,
            basisPoints: p.basisPoints || p.weight * 100,
            isActive: p.isActive
          }
        });
      }

      const all = await tx.prize.findMany();
      await tx.prizeConfigurationVersion.create({
        data: {
          snapshot: JSON.stringify(all),
          appliedBy: adminId
        }
      });

      await tx.auditLog.create({
        data: {
          adminId,
          action: 'PRIZE_PROBABILITIES_UPDATED',
          entityType: 'Prize',
          details: JSON.stringify({ updated: prizesData })
        }
      });

      return all;
    });
  }

  async getCheckIns(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [total, data] = await Promise.all([
      this.prisma.storeCheckIn.count(),
      this.prisma.storeCheckIn.findMany({
        skip,
        take: limit,
        include: {
          customer: { select: { phoneNumber: true } },
          store: true,
          verifiedByAdmin: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);
    return { total, page, limit, data };
  }

  async getPurchases(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [total, data] = await Promise.all([
      this.prisma.purchase.count(),
      this.prisma.purchase.findMany({
        skip,
        take: limit,
        include: {
          customer: { select: { phoneNumber: true } },
          store: true
        },
        orderBy: { purchasedAt: 'desc' }
      })
    ]);
    return { total, page, limit, data };
  }

  async getReferrals(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [total, data] = await Promise.all([
      this.prisma.referral.count(),
      this.prisma.referral.findMany({
        skip,
        take: limit,
        include: {
          referrer: { select: { phoneNumber: true } },
          referred: { select: { phoneNumber: true } },
          referralCode: true
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);
    return { total, page, limit, data };
  }

  async getAuditLogs(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [total, data] = await Promise.all([
      this.prisma.auditLog.count(),
      this.prisma.auditLog.findMany({
        skip,
        take: limit,
        include: { admin: { select: { username: true, name: true, role: true } } },
        orderBy: { createdAt: 'desc' }
      })
    ]);
    return { total, page, limit, data };
  }

  async getSettings() {
    return this.prisma.appSetting.findMany();
  }

  async updateSettings(settings: Array<{ key: string; value: string }>, adminId: string) {
    return this.prisma.$transaction(async (tx) => {
      for (const s of settings) {
        await tx.appSetting.upsert({
          where: { key: s.key },
          update: { value: s.value },
          create: { key: s.key, value: s.value }
        });
      }

      await tx.auditLog.create({
        data: {
          adminId,
          action: 'SETTINGS_UPDATED',
          entityType: 'AppSetting',
          details: JSON.stringify({ settings })
        }
      });

      return tx.appSetting.findMany();
    });
  }
}
