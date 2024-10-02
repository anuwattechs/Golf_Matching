import { registerAs } from '@nestjs/config';

import { IsString } from 'class-validator';
import { MailConfig } from './mail-config.type';
import { validateConfig } from '../../../../shared/validators/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  AWS_SES_ACCESS_KEY_ID!: string;

  @IsString()
  AWS_SES_SECRET_ACCESS_KEY!: string;

  @IsString()
  AWS_SES_REGION!: string;

  @IsString()
  SOURCE_EMAIL!: string;
}

export default registerAs<MailConfig>('mail', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
    region: process.env.AWS_SES_REGION,
    sourceEmail: process.env.SOURCE_EMAIL,
  };
});
