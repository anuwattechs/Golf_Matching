import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AllConfigType } from 'src/app/config/config.type';
import { VerifyTypeEnum } from 'src/shared/enums';
import * as libphonenumber from 'google-libphonenumber';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private infobipApiKey: string;
  private infobipBaseUrl: string;
  private infobipFrom: string;
  private phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

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

  /**
   * Sends an SMS message based on the verification type using the Infobip API.
   * @param {string} to - The recipient's phone number.
   * @param {VerifyTypeEnum} type - The type of verification for SMS content.
   * @param {Object} data - Dynamic data for populating the template (e.g., code or reset link).
   */
  async sendSms(
    to: string,
    type: VerifyTypeEnum = VerifyTypeEnum.REGISTER,
    data: {
      code?: string;
      referenceCode?: string;
    } = {},
  ): Promise<boolean> {
    const message = this.generateMessage(type, data);
    const url = `${this.infobipBaseUrl}/sms/2/text/advanced`;
    const headers = {
      Authorization: `App ${this.infobipApiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    const smsData = {
      messages: [
        {
          destinations: [
            {
              to: this.getCountriesFromPhone(to).phone,
            },
          ],
          from: this.infobipFrom,
          text: message,
        },
      ],
    };

    try {
      const response = await axios.post(url, smsData, { headers });
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

  /**
   * Generates a message template based on verification type.
   * @param {VerifyTypeEnum} type - The type of verification.
   * @param {Object} data - Data to populate in the message.
   * @returns {string} - The generated message.
   */
  private generateMessage(
    type: VerifyTypeEnum,
    data: {
      code?: string;
      referenceCode?: string;
    },
  ): string {
    switch (type) {
      case VerifyTypeEnum.REGISTER:
        return `Your verification code is: ${data.code} (Ref: ${data.referenceCode}). for registration. Please do not share this code with anyone.`;
      case VerifyTypeEnum.RECOVER_PASSWORD:
        return `Your verification code is: ${data.code} (Ref: ${data.referenceCode}).  for password recovery. Please do not share this code with anyone.`;
      default:
        return `Your verification code is: ${data.code} (Ref: ${data.referenceCode}). Please do not share this code with anyone.`;
    }
  }

  /**
   * Extracts the country code and standardized phone number from a given phone number string.
   * @param {string} phone - The phone number in local or international format.
   * @returns {Object} - An object containing the country code and formatted phone number.
   */
  private getCountriesFromPhone(phone: string): {
    country: string;
    phone: string;
  } {
    try {
      const parsedNumber = this.phoneUtil.parseAndKeepRawInput(phone, 'TH');
      const country = this.phoneUtil.getRegionCodeForNumber(parsedNumber);
      const internationalFormat = this.phoneUtil.format(
        parsedNumber,
        libphonenumber.PhoneNumberFormat.E164,
      );

      return {
        country,
        phone: internationalFormat?.replace('+', ''),
      };
    } catch (error) {
      console.error('Error parsing phone number:', error);
      return { country: 'Unknown', phone: phone };
    }
  }
}
