import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CustomerAuthGuard } from '../common/guards/customer-auth.guard';
import { CurrentCustomer } from '../common/decorators/current-user.decorator';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class RequestOtpDto {
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsBoolean()
  marketingConsent?: boolean;
}

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  challengeId: string;

  @IsNotEmpty()
  @IsString()
  otp: string;
}

export class AdminLoginDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class EmailLoginDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  displayName?: string;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('email-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Customer sign in or sign up using email' })
  async emailLogin(@Body() dto: EmailLoginDto, @Req() req: any) {
    const ip = req.ip || req.headers['x-forwarded-for'];
    const ua = req.headers['user-agent'];
    return this.authService.loginWithEmail(dto.email, dto.displayName, ip, ua);
  }

  @Post('otp/request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request OTP for Indian mobile number' })
  async requestOtp(@Body() dto: RequestOtpDto, @Req() req: any) {
    const ip = req.ip || req.headers['x-forwarded-for'];
    const ua = req.headers['user-agent'];
    return this.authService.requestOtp(dto.phoneNumber, dto.marketingConsent, ip, ua);
  }

  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP code and create customer session' })
  async verifyOtp(@Body() dto: VerifyOtpDto, @Req() req: any) {
    const ip = req.ip || req.headers['x-forwarded-for'];
    const ua = req.headers['user-agent'];
    return this.authService.verifyOtp(dto.challengeId, dto.otp, ip, ua);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout customer session' })
  async logout(@Req() req: any) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : '';
    return this.authService.logout(token);
  }

  @Get('me')
  @UseGuards(CustomerAuthGuard)
  @ApiOperation({ summary: 'Get current verified customer details' })
  async getMe(@CurrentCustomer() customer: any) {
    return {
      id: customer.id,
      phoneNumber: customer.phoneNumber,
      isVerified: customer.isVerified,
      createdAt: customer.createdAt
    };
  }
}
