import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Infobip, AuthType } from '@infobip-api/sdk';
import { AllConfigType } from 'src/app/config/config.type';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly from: string;
  private readonly infobip: Infobip;

  constructor(private readonly configService: ConfigService<AllConfigType>) {
    // Retrieve 'from' number and Infobip configuration from environment
    this.from = this.configService.get<string>('sms.fromNumber', {
      infer: true,
    });
    const baseUrl = this.configService.get<string>('infobip.baseUrl', {
      infer: true,
    });
    const apiKey = this.configService.get<string>('infobip.apiKey', {
      infer: true,
    });

    // Initialize Infobip client with dynamic configuration
    this.infobip = new Infobip({
      baseUrl,
      apiKey,
      authType: AuthType.ApiKey,
    });
  }

  async sendSms(to: string, message: string): Promise<void> {
    try {
      // Use dynamic 'from' and 'to' numbers with the provided message
      await this.infobip.channels.whatsapp.send({
        type: 'text',
        from: this.from, // Dynamic sender number
        to,
        content: {
          text: message,
        },
      });

      this.logger.log(`SMS sent successfully to ${to}`);
    } catch (error) {
      // Improved error handling with more details
      this.logger.error(
        `Error sending SMS to ${to}: ${error.message}`,
        error.stack,
      );
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }
}
