import { registerAs } from '@nestjs/config';

import { IsOptional, IsString } from 'class-validator';
import { AuthConfig } from './auth-config.type';
import { validateConfig } from 'src/shared/validators/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  AUTH_JWT_SECRET: string;

  @IsString()
  @IsOptional()
  AUTH_JWT_EXPIRES_IN: string;

  @IsString()
  @IsOptional()
  AUTH_REFRESH_SECRET: string;

  @IsString()
  @IsOptional()
  AUTH_REFRESH_EXPIRES_IN: string;
}

export default registerAs<AuthConfig>('auth', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  // console.log('AUTH_JWT_SECRET', process.env.AUTH_JWT_SECRET);

  return {
    jwtSecret: '' + process.env.AUTH_JWT_SECRET,
    jwtExpiresIn: process.env.AUTH_JWT_EXPIRES_IN || '1h',
    refreshSecret: '' + process.env.AUTH_REFRESH_SECRET,
    refreshExpiresIn: process.env.AUTH_REFRESH_EXPIRES_IN || '365d',
  };
});
