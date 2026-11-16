import { Module } from '@nestjs/common';
import { BirthdaysService } from './birthdays.service';
import { BirthdaysController } from './birthdays.controller';
import { LoyaltyModule } from '../loyalty/loyalty.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [LoyaltyModule, AuthModule],
  controllers: [BirthdaysController],
  providers: [BirthdaysService],
  exports: [BirthdaysService]
})
export class BirthdaysModule {}
