import { Module } from '@nestjs/common';
import { StoreQrService } from './store-qr.service';
import { StoreQrController } from './store-qr.controller';
import { LoyaltyModule } from '../loyalty/loyalty.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [LoyaltyModule, AuthModule],
  controllers: [StoreQrController],
  providers: [StoreQrService],
  exports: [StoreQrService]
})
export class StoreQrModule {}
