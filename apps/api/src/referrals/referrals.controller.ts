import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReferralsService } from './referrals.service';
import { CustomerAuthGuard } from '../common/guards/customer-auth.guard';
import { CurrentCustomer } from '../common/decorators/current-user.decorator';

@ApiTags('Refer & Earn')
@Controller('referrals')
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Get('my-code')
  @UseGuards(CustomerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current customer unique referral code and shareable link' })
  async getMyCode(@CurrentCustomer() customer: any) {
    return this.referralsService.getOrCreateMyCode(customer.id);
  }

  @Get('summary')
  @UseGuards(CustomerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get referral counts and reward history' })
  async getSummary(@CurrentCustomer() customer: any) {
    return this.referralsService.getReferralSummary(customer.id);
  }

  @Post('attribute')
  @UseGuards(CustomerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Apply a friend referral code on signup' })
  async attributeReferral(
    @CurrentCustomer() customer: any,
    @Body('code') code: string
  ) {
    return this.referralsService.attributeReferral(customer.id, code);
  }
}
