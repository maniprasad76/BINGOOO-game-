import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { ReferralsService } from '../referrals/referrals.service';
import { LoyaltyTransactionType } from '@bingooo/shared';

@Injectable()
export class PurchasesService {
  private readonly logger = new Logger(PurchasesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly loyaltyService: LoyaltyService,
    private readonly referralsService: ReferralsService
  ) {}

  /**
   * Cashier / Staff records an offline store purchase.
   * Awards 1 Coin per ₹10 eligible net spend.
   * Qualifies referrer if this is the friend's first purchase.
   */
  async recordPurchase(
    customerId: string,
    storeId: string,
    externalReceiptId: string,
    grossAmountRupees: number,
    discountAmountRupees = 0,
    staffId?: string
  ) {
    if (grossAmountRupees <= 0) {
      throw new BadRequestException('Gross purchase amount must be greater than 0.');
    }

    const cleanReceipt = externalReceiptId.trim().toUpperCase();

    // Prevent duplicate receipt entries
    const existing = await this.prisma.purchase.findUnique({
      where: {
        store_receipt_unique: {
          storeId,
          externalReceiptId: cleanReceipt
        }
      }
    });

    if (existing) {
      throw new BadRequestException(`Receipt number ${cleanReceipt} has already been recorded!`);
    }

    const netAmountRupees = Math.max(0, grossAmountRupees - discountAmountRupees);
    const grossAmountPaise = Math.round(grossAmountRupees * 100);
    const discountAmountPaise = Math.round(discountAmountRupees * 100);
    const eligibleAmountPaise = Math.round(netAmountRupees * 100);

    // 1 Coin for every ₹10 eligible spend
    const coinsEarned = Math.floor(netAmountRupees / 10);

    return this.prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.create({
        data: {
          customerId,
          storeId,
          externalReceiptId: cleanReceipt,
          grossAmountPaise,
          discountAmountPaise,
          eligibleAmountPaise,
          coinsEarned,
          status: 'COMPLETED',
          verifiedByAdminId: staffId
        }
      });

      // 1. Award coins to customer
      if (coinsEarned > 0) {
        await this.loyaltyService.awardCoins(
          customerId,
          coinsEarned,
          LoyaltyTransactionType.EARN,
          'PURCHASE',
          purchase.id,
          `purchase_coins_${purchase.id}`,
          `Earned on store purchase #${cleanReceipt} (₹${netAmountRupees})`
        );
      }

      // 2. Check and trigger referral qualification if applicable
      await this.referralsService.qualifyReferral(customerId, purchase.id);

      return purchase;
    });
  }

  async getCustomerPurchases(customerId: string) {
    return this.prisma.purchase.findMany({
      where: { customerId },
      include: { store: true },
      orderBy: { purchasedAt: 'desc' }
    });
  }
}
