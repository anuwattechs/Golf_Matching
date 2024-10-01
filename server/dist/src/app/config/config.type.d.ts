import { DatabaseConfig } from 'src/core/database/config';
import { AppConfig } from './app-config.type';
export type AllConfigType = {
    app: AppConfig;
    database: DatabaseConfig;
};
