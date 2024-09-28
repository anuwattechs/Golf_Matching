import { DatabaseConfig } from 'src/core/database/config';
import { AppConfig } from './app-config.type';
import { GoogleConfig } from '../modules/auth-google/config/google-config.type';

export type AllConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
  google: GoogleConfig;
};
