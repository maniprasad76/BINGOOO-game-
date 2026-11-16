import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { WheelModule } from './wheel/wheel.module';
import { RewardsModule } from './rewards/rewards.module';
import { AdminModule } from './admin/admin.module';
import { LoyaltyModule } from './loyalty/loyalty.module';
import { ReferralsModule } from './referrals/referrals.module';
import { StoreQrModule } from './store-qr/store-qr.module';
import { BirthdaysModule } from './birthdays/birthdays.module';
import { PurchasesModule } from './purchases/purchases.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.example']
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100
      }
    ]),
    DatabaseModule,
    AuthModule,
    WheelModule,
    RewardsModule,
    AdminModule,
    LoyaltyModule,
    ReferralsModule,
    StoreQrModule,
    BirthdaysModule,
    PurchasesModule
  ]
})
export class AppModule {}
