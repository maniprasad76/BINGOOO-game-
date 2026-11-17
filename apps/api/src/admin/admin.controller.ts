import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AuthService } from '../auth/auth.service';
import { RewardsService } from '../rewards/rewards.service';
import { StoreQrService } from '../store-qr/store-qr.service';
import { PurchasesService } from '../purchases/purchases.service';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentAdmin } from '../common/decorators/current-user.decorator';
import { Role } from '@bingooo/shared';
import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';

export class AdminLoginRequestDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class AdminGoogleLoginDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  googleId?: string;
}

export class RedeemVoucherDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class RevokeRewardDto {
  @IsNotEmpty()
  @IsString()
  reason: string;
}

@ApiTags('Admin Operations')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
    private readonly rewardsService: RewardsService,
    private readonly storeQrService: StoreQrService,
    private readonly purchasesService: PurchasesService
  ) {}

  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin staff login' })
  async login(@Body() dto: AdminLoginRequestDto, @Req() req: any) {
    const ip = req.ip || req.headers['x-forwarded-for'];
    return this.authService.adminLogin(dto.username, dto.password, ip);
  }

  @Post('auth/google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin staff login with Google' })
  async googleLogin(@Body() dto: AdminGoogleLoginDto, @Req() req: any) {
    const ip = req.ip || req.headers['x-forwarded-for'];
    return this.authService.adminGoogleLogin(dto.email, dto.displayName, dto.googleId, ip);
  }

  @Get('auth/me')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated admin profile' })
  async getMe(@CurrentAdmin() admin: any) {
    return {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      role: admin.role,
      email: admin.email
    };
  }

  @Get('dashboard')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'KPI summary dashboard metrics' })
  async getDashboard() {
    return this.adminService.getDashboardSummary();
  }

  @Get('customers')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List customer accounts with search and pagination' })
  async getCustomers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string
  ) {
    return this.adminService.getCustomers(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      search
    );
  }

  @Get('spins')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List customer spin records' })
  async getSpins(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('periodKey') periodKey?: string
  ) {
    return this.adminService.getSpins(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      periodKey
    );
  }

  @Get('rewards')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List rewards vouchers' })
  async getRewards(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('prizeType') prizeType?: string
  ) {
    return this.adminService.getRewards(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 50,
      status,
      prizeType
    );
  }

  @Post('rewards/redeem')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Staff store redemption of reward code' })
  async redeemReward(@Body() dto: RedeemVoucherDto, @CurrentAdmin() admin: any) {
    return this.rewardsService.redeemReward(dto.code, admin.id, 'Srikakulam Store', dto.notes);
  }

  @Post('rewards/:id/revoke')
  @UseGuards(AdminAuthGuard)
  @Roles(Role.SUPER_ADMIN, Role.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke an issued reward with recorded audit reason' })
  async revokeReward(
    @Param('id') id: string,
    @Body() dto: RevokeRewardDto,
    @CurrentAdmin() admin: any
  ) {
    return this.rewardsService.revokeReward(id, admin.id, dto.reason);
  }

  @Get('prizes')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get active prizes and probabilities' })
  async getPrizes() {
    return this.adminService.getPrizes();
  }

  @Patch('prizes')
  @UseGuards(AdminAuthGuard)
  @Roles(Role.SUPER_ADMIN) // ONLY SUPER_ADMIN can alter probabilities
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update prize probabilities (Super Admin only, strictly 100% / 10000 basis points)' })
  async updatePrizes(@Body() body: any, @CurrentAdmin() admin: any) {
    return this.adminService.updatePrizes(body.prizes, admin.id);
  }

  @Get('check-ins')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List customer store check-ins' })
  async getCheckIns(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.adminService.getCheckIns(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20
    );
  }

  @Post('store-check-ins/:id/approve')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Staff approve store visit and award 5 Coins' })
  async approveCheckIn(@Param('id') id: string, @CurrentAdmin() admin: any) {
    return this.storeQrService.approveCheckIn(id, admin.id);
  }

  @Post('purchases')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Staff record verified offline purchase' })
  async recordPurchase(
    @Body('customerId') customerId: string,
    @Body('storeId') storeId: string,
    @Body('externalReceiptId') externalReceiptId: string,
    @Body('grossAmount') grossAmount: number,
    @Body('discountAmount') discountAmount: number,
    @CurrentAdmin() admin: any
  ) {
    return this.purchasesService.recordPurchase(
      customerId,
      storeId,
      externalReceiptId,
      grossAmount,
      discountAmount || 0,
      admin.id
    );
  }

  @Get('purchases')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List verified store purchases' })
  async getPurchases(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.adminService.getPurchases(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20
    );
  }

  @Get('referrals')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List customer referrals' })
  async getReferrals(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.adminService.getReferrals(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20
    );
  }

  @Get('audit-logs')
  @UseGuards(AdminAuthGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List administrative audit trail' })
  async getAuditLogs(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.adminService.getAuditLogs(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 50
    );
  }

  @Get('settings')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get store application settings' })
  async getSettings() {
    return this.adminService.getSettings();
  }

  @Patch('settings')
  @UseGuards(AdminAuthGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update store application settings' })
  async updateSettings(@Body() body: any, @CurrentAdmin() admin: any) {
    return this.adminService.updateSettings(body.settings, admin.id);
  }
}
