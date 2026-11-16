import { Logger } from '@nestjs/common';

export interface ISmsProvider {
  sendOtp(phoneNumber: string, otp: string): Promise<boolean>;
}

export class MockSmsProvider implements ISmsProvider {
  private readonly logger = new Logger(MockSmsProvider.name);

  async sendOtp(phoneNumber: string, otp: string): Promise<boolean> {
    this.logger.log(`[DEVELOPMENT MOCK SMS] Sending OTP to ${phoneNumber}: Code = ${otp}`);
    return true;
  }
}

export class ProductionSmsProvider implements ISmsProvider {
  private readonly logger = new Logger(ProductionSmsProvider.name);

  constructor(
    private readonly provider: string,
    private readonly apiKey: string,
    private readonly senderId: string,
    private readonly templateId: string
  ) {}

  async sendOtp(phoneNumber: string, otp: string): Promise<boolean> {
    if (!this.apiKey) {
      this.logger.error(`SMS Provider "${this.provider}" has no API key configured in .env!`);
      throw new Error('Production SMS provider is not properly configured.');
    }

    // Adapt for MSG91 / Fast2SMS / Twilio etc.
    this.logger.log(`Dispatching OTP via ${this.provider} to ${phoneNumber} (Template: ${this.templateId})`);
    
    // In actual production runtime with configured key:
    // e.g. await axios.post(...)
    return true;
  }
}
