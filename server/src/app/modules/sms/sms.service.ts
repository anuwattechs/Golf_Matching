import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwilioService } from 'nestjs-twilio';
import { AllConfigType } from 'src/app/config/config.type';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly from: string;

  constructor(
    private readonly twilioService: TwilioService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {
    this.from = configService.get<string>('sms.fromNumber', {
      infer: true,
    });
  }

  /**
   * This TypeScript function sends an SMS message using the Twilio service to a specified recipient.
   * @param {string} to - The `to` parameter in the `send` function represents the phone number of the
   * recipient to whom the SMS will be sent.
   * @param {string} body - The `body` parameter in the `send` function represents the content or
   * message that you want to send in the SMS. It is the actual text that will be delivered to the
   * recipient's phone number specified in the `to` parameter.
   * @returns The `send` function is returning a Promise that resolves to the result of creating a
   * message using the Twilio client.
   */
  async send(to: string, body: string) {
    this.logger.log(`Sending SMS to ${to}`);
    return this.twilioService.client.messages.create({
      body,
      from: this.from,
      to,
    });
  }
}
