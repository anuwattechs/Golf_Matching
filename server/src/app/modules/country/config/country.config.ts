import { registerAs } from '@nestjs/config';

import { IsString } from 'class-validator';
import { validateConfig } from 'src/shared';

class EnvironmentVariablesValidator {
  @IsString()
  COUNTRY_API_URL!: string;

  @IsString()
  COUNTRY_API_KEY!: string;
}

export default registerAs('country', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    baseUrl: process.env.COUNTRY_API_URL,
    authToken: process.env.COUNTRY_API_KEY,
  };
});
