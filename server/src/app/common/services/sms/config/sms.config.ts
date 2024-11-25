import { registerAs } from '@nestjs/config';

import { IsString } from 'class-validator';
import { validateConfig } from '../../../../../shared/validators/validate-config';
import { SMSConfig } from './sms-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  INFOBIP_BASE_URL!: string;

  @IsString()
  INFOBIP_API_KEY!: string;

  @IsString()
  INFOBIP_FROM!: string;
}

export default registerAs<SMSConfig>('sms', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    baseUrl: process.env.INFOBIP_BASE_URL,
    authToken: process.env.INFOBIP_API_KEY,
    fromNumber: process.env.INFOBIP_FROM,
  };
});
