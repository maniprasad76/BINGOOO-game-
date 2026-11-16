import { Controller, Get, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BirthdaysService } from './birthdays.service';
import { CustomerAuthGuard } from '../common/guards/customer-auth.guard';
import { CurrentCustomer } from '../common/decorators/current-user.decorator';

@ApiTags('Birthday Rewards')
@Controller('birthdays')
export class BirthdaysController {
  constructor(private readonly birthdaysService: BirthdaysService) {}

  @Get('profile')
  @UseGuards(CustomerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current customer birthday and preference profile' })
  async getProfile(@CurrentCustomer() customer: any) {
    return this.birthdaysService.getProfile(customer.id);
  }

  @Patch('preferences')
  @UseGuards(CustomerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Save birth month and day (opt-in for annual birthday gift)' })
  async updatePreferences(
    @CurrentCustomer() customer: any,
    @Body('birthMonth') birthMonth: number,
    @Body('birthDay') birthDay: number,
    @Body('birthYear') birthYear?: number,
    @Body('preferredCategory') preferredCategory?: string
  ) {
    return this.birthdaysService.updateBirthdayPreferences(
      customer.id,
      birthMonth,
      birthDay,
      birthYear,
      preferredCategory
    );
  }

  @Get('eligibility')
  @UseGuards(CustomerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check annual birthday reward eligibility' })
  async checkEligibility(@CurrentCustomer() customer: any) {
    return this.birthdaysService.checkEligibility(customer.id);
  }

  @Post('claim')
  @UseGuards(CustomerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Claim annual 50 Coins + 10% Discount Birthday Voucher' })
  async claim(@CurrentCustomer() customer: any) {
    return this.birthdaysService.claimBirthdayReward(customer.id);
  }

  @Get('history')
  @UseGuards(CustomerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get past birthday claims' })
  async getHistory(@CurrentCustomer() customer: any) {
    return this.birthdaysService.getHistory(customer.id);
  }
}
