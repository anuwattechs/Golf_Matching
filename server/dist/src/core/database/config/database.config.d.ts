import { DatabaseConfig } from './database-config.type';
declare const databaseConfig: import("@nestjs/config").ConfigFactory<DatabaseConfig> & import("@nestjs/config").ConfigFactoryKeyHost<DatabaseConfig | Promise<DatabaseConfig>>;
export default databaseConfig;
