import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CustomerAuthGuard } from '../common/guards/customer-auth.guard';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ADMIN_SECRET', 'admin_secret'),
        signOptions: { expiresIn: '1d' }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, CustomerAuthGuard, AdminAuthGuard],
  exports: [AuthService, CustomerAuthGuard, AdminAuthGuard, JwtModule]
})
export class AuthModule {}
