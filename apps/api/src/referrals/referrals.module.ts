import { Module } from '@nestjs/common';
import { ReferralsService } from './referrals.service';
import { ReferralsController } from './referrals.controller';
import { LoyaltyModule } from '../loyalty/loyalty.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [LoyaltyModule, AuthModule],
  controllers: [ReferralsController],
  providers: [ReferralsService],
  exports: [ReferralsService]
})
export class ReferralsModule {}
