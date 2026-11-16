import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RewardsService } from './rewards.service';
import { CustomerAuthGuard } from '../common/guards/customer-auth.guard';
import { CurrentCustomer } from '../common/decorators/current-user.decorator';

@ApiTags('Rewards')
@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  @UseGuards(CustomerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of rewards for the logged-in customer' })
  async getMyRewards(@CurrentCustomer() customer: any) {
    return this.rewardsService.getCustomerRewards(customer.id);
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get reward details by code (public/customer accessible)' })
  async getRewardByCode(@Param('code') code: string) {
    return this.rewardsService.getRewardByCode(code);
  }
}
