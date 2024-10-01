import { registerAs } from '@nestjs/config';

import { IsString } from 'class-validator';
import { validateConfig } from '../../../../shared/validators/validate-config';
import { SMSConfig } from './sms-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  TWILIO_ACCOUNT_SID!: string;

  @IsString()
  TWILIO_AUTH_TOKEN!: string;

  @IsString()
  TWILIO_PHONE_NUMBER!: string;
}

export default registerAs<SMSConfig>('sms', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    fromNumber: process.env.TWILIO_PHONE_NUMBER,
  };
});
