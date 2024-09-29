import { registerAs } from '@nestjs/config';

import { IsOptional, IsString } from 'class-validator';
import { FacebookConfig } from './facebook-config.type';
import { validateConfig } from '../../../../shared/validators/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  FACEBOOK_APP_ID: string;

  @IsString()
  @IsOptional()
  FACEBOOK_APP_SECRET: string;

  @IsString()
  @IsOptional()
  FACEBOOK_CALLBACK_URL: string;
}

export default registerAs<FacebookConfig>('facebook', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    appId: process.env.FACEBOOK_APP_ID,
    appSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  };
});
