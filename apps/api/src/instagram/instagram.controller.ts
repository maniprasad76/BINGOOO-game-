import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus, Logger, Res } from '@nestjs/common';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { InstagramService, InstagramReel } from './instagram.service';
import { Response } from 'express';

export class AddReelDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  caption?: string;

  @IsString()
  @IsOptional()
  badge?: string;
}

@Controller('instagram')
export class InstagramController {
  private readonly logger = new Logger(InstagramController.name);

  constructor(private readonly instagramService: InstagramService) {}

  @Get('reels')
  async getReels(): Promise<{ success: boolean; data: InstagramReel[] }> {
    const reels = await this.instagramService.getReels();
    return {
      success: true,
      data: reels
    };
  }

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  async syncInstagram(): Promise<{ success: boolean; count: number; message: string }> {
    return this.instagramService.syncInstagram();
  }

  @Post('reels')
  @HttpCode(HttpStatus.CREATED)
  async addReel(@Body() dto: AddReelDto): Promise<{ success: boolean; data: InstagramReel }> {
    const reel = await this.instagramService.addReel(dto);
    return {
      success: true,
      data: reel
    };
  }

  /**
   * Instagram / Meta Webhook verification handshake
   */
  @Get('webhook')
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response
  ) {
    const VERIFY_TOKEN = process.env.INSTAGRAM_VERIFY_TOKEN || 'bingooo_webhook_secret';
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      this.logger.log('Instagram Webhook challenge verified successfully.');
      return res.status(HttpStatus.OK).send(challenge);
    }
    return res.status(HttpStatus.FORBIDDEN).send('Forbidden');
  }

  /**
   * Instagram / Meta Webhook listener for real-time reel & media upload updates
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() payload: any) {
    this.logger.log(`Received Instagram Webhook event: ${JSON.stringify(payload)}`);
    // Automatically trigger reel sync when new media is posted
    await this.instagramService.syncInstagram();
    return { status: 'EVENT_RECEIVED' };
  }
}
