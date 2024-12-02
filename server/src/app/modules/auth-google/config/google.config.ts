import { registerAs } from '@nestjs/config';

import { IsOptional, IsString } from 'class-validator';
import { validateConfig } from 'src/shared';
import { GoogleConfig } from './google-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  GOOGLE_CLIENT_ID: string;

  @IsString()
  @IsOptional()
  GOOGLE_CLIENT_ID_AUTHORIZER: string;

  @IsString()
  @IsOptional()
  GOOGLE_CLIENT_ID_ANDROID: string;

  @IsString()
  @IsOptional()
  GOOGLE_CLIENT_ID_WEB: string;

  @IsString()
  @IsOptional()
  GOOGLE_CLIENT_ID_IOS: string;

  @IsString()
  @IsOptional()
  GOOGLE_CLIENT_SECRET: string;

  @IsString()
  @IsOptional()
  GOOGLE_CALLBACK_URL: string;
}

export default registerAs<GoogleConfig>('google', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientIdAuthorizer: process.env.GOOGLE_CLIENT_ID_AUTHORIZER,
    clientIdAndroid: process.env.GOOGLE_CLIENT_ID_ANDROID,
    clientIdWeb: process.env.GOOGLE_CLIENT_ID_WEB,
    clientIdIos: process.env.GOOGLE_CLIENT_ID_IOS,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  };
});
