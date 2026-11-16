import { Controller, Get, Post, Body, UseGuards, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LoyaltyService } from './loyalty.service';
import { CustomerAuthGuard } from '../common/guards/customer-auth.guard';
import { CurrentCustomer } from '../common/decorators/current-user.decorator';

@ApiTags('Loyalty Coins')
@Controller('loyalty')
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Get('wallet')
  @UseGuards(CustomerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current customer BINGOOO Coins wallet balance and history' })
  async getWallet(@CurrentCustomer() customer: any) {
    return this.loyaltyService.getWallet(customer.id);
  }

  @Get('redemption-options')
  @ApiOperation({ summary: 'List available Coins-to-Voucher conversion tiers' })
  getRedemptionOptions() {
    return this.loyaltyService.getRedemptionOptions();
  }

  @Post('redeem')
  @UseGuards(CustomerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Redeem Coins for a unique in-store discount voucher' })
  async redeemCoins(
    @CurrentCustomer() customer: any,
    @Body('tierId') tierId: string,
    @Headers('x-idempotency-key') idempotencyKey?: string
  ) {
    return this.loyaltyService.redeemCoins(customer.id, tierId, idempotencyKey);
  }
}
