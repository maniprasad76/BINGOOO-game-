import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthModule } from '../auth/auth.module';
import { RewardsModule } from '../rewards/rewards.module';
import { StoreQrModule } from '../store-qr/store-qr.module';
import { PurchasesModule } from '../purchases/purchases.module';

@Module({
  imports: [AuthModule, RewardsModule, StoreQrModule, PurchasesModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService]
})
export class AdminModule {}
