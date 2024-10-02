import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AllConfigType } from 'src/app/config/config.type';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private infobipApiKey: string;
  private infobipBaseUrl: string;
  private infobipFrom: string;

  constructor(configService: ConfigService<AllConfigType>) {
    this.infobipBaseUrl = configService.get<string>('sms.baseUrl', {
      infer: true,
    });
    this.infobipApiKey = configService.get<string>('sms.authToken', {
      infer: true,
    });
    this.infobipFrom = configService.get<string>('sms.fromNumber', {
      infer: true,
    });
  }

  async sendSms(to: string, message: string): Promise<boolean> {
    const url = `${this.infobipBaseUrl}/sms/2/text/advanced`;
    const headers = {
      Authorization: `App ${this.infobipApiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    const data = {
      messages: [
        {
          destinations: [{ to }],
          from: this.infobipFrom,
          text: message,
        },
      ],
    };

    try {
      const response = await axios.post(url, data, { headers });
      if (response.status === 200) {
        return true;
      } else {
        throw new HttpException(
          'Failed to send SMS',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (error) {
      this.logger.error(
        `Error sending SMS to ${to}: ${error.message}`,
        error.stack,
      );
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }
}
