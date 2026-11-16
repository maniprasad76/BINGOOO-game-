import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StoreQrService } from './store-qr.service';
import { CustomerAuthGuard } from '../common/guards/customer-auth.guard';
import { CurrentCustomer } from '../common/decorators/current-user.decorator';

@ApiTags('Store QR Rewards')
@Controller('store')
export class StoreQrController {
  constructor(private readonly storeQrService: StoreQrService) {}

  @Get('stores')
  @ApiOperation({ summary: 'List active store locations' })
  async getStores() {
    return this.storeQrService.getStores();
  }

  @Post('check-ins/request')
  @UseGuards(CustomerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Request visit check-in by scanning store QR code' })
  async requestCheckIn(
    @CurrentCustomer() customer: any,
    @Body('storeId') storeId: string,
    @Body('qrNonce') qrNonce?: string
  ) {
    return this.storeQrService.requestCheckIn(customer.id, storeId, qrNonce);
  }

  @Get('check-ins/history')
  @UseGuards(CustomerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current customer store visit check-in history' })
  async getHistory(@CurrentCustomer() customer: any) {
    return this.storeQrService.getCustomerCheckInHistory(customer.id);
  }
}
