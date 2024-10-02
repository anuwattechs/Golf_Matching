import { DatabaseConfig } from 'src/core/database/config';
import { AppConfig } from './app-config.type';
import { AuthConfig } from '../modules/auth/config/auth-config.type';
import { GoogleConfig } from '../modules/auth-google/config/google-config.type';
import { FacebookConfig } from '../modules/auth-facebook/config/facebook-config.type';
import { AppleConfig } from '../modules/auth-apple/config/apple-config.type';
import { MailConfig } from '../modules/mail/config/mail-config.type';
import { SMSConfig } from '../modules/sms/config/sms-config.type';

export type AllConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
  google: GoogleConfig;
  facebook: FacebookConfig;
  apple: AppleConfig;
  mail: MailConfig;
  sms: SMSConfig;
};
