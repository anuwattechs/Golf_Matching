import { DatabaseConfig } from 'src/core/database/config';
import { MailConfig } from '../common/services/mail/config/mail-config.type';
import { SMSConfig } from '../common/services/sms/config/sms-config.type';
import { FileConfig } from '../modules/assets/config/assets-config.type';
import { AppleConfig } from '../modules/auth-apple/config/apple-config.type';
import { FacebookConfig } from '../modules/auth-facebook/config/facebook-config.type';
import { GoogleConfig } from '../modules/auth-google/config/google-config.type';
import { AuthConfig } from '../modules/auth/config/auth-config.type';
import { CountryConfig } from '../modules/country/config/country-config.type';
import { AppConfig } from './app-config.type';

export type AllConfigType = {
  app: AppConfig;
  assets: FileConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
  google: GoogleConfig;
  facebook: FacebookConfig;
  apple: AppleConfig;
  mail: MailConfig;
  sms: SMSConfig;
  country: CountryConfig;
};
