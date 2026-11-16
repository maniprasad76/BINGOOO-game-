import { Module } from '@nestjs/common';
import { WheelService } from './wheel.service';
import { WheelController } from './wheel.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [WheelController],
  providers: [WheelService],
  exports: [WheelService]
})
export class WheelModule {}
