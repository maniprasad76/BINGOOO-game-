import { Module } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { LoyaltyModule } from '../loyalty/loyalty.module';
import { ReferralsModule } from '../referrals/referrals.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [LoyaltyModule, ReferralsModule, AuthModule],
  providers: [PurchasesService],
  exports: [PurchasesService]
})
export class PurchasesModule {}
