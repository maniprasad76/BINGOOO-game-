import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Headers,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WheelService } from './wheel.service';
import { CustomerAuthGuard } from '../common/guards/customer-auth.guard';
import { CurrentCustomer } from '../common/decorators/current-user.decorator';

@ApiTags('Wheel')
@Controller('wheel')
export class WheelController {
  constructor(private readonly wheelService: WheelService) {}

  @Get('config')
  @ApiOperation({ summary: 'Get visual wheel configuration and prizes' })
  async getWheelConfig() {
    return this.wheelService.getWheelConfig();
  }

  @Get('eligibility')
  @UseGuards(CustomerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if current verified customer is eligible to spin this month' })
  async checkEligibility(@CurrentCustomer() customer: any) {
    return this.wheelService.checkEligibility(customer.id);
  }

  @Post('spin')
  @UseGuards(CustomerAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Execute spin and receive secure server-selected prize' })
  async executeSpin(
    @CurrentCustomer() customer: any,
    @Req() req: any,
    @Headers('x-idempotency-key') idempotencyKey?: string
  ) {
    const ip = req.ip || req.headers['x-forwarded-for'];
    return this.wheelService.executeSpin(customer.id, ip, idempotencyKey);
  }

  @Get('history')
  @UseGuards(CustomerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current customer spin history' })
  async getHistory(@CurrentCustomer() customer: any) {
    return this.wheelService.getCustomerSpinHistory(customer.id);
  }
}
