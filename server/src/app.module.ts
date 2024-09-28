import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './core/database/mongoose-config.service';
import { databaseConfig } from './core/database/config';
import { AuthModule } from './app/modules/auth/auth.module';
import { UsersModule } from './app/modules/users/users.module';

const infrastructureDatabaseModule = MongooseModule.forRootAsync({
  useClass: MongooseConfigService,
});

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: ['.env'],
    }),
    infrastructureDatabaseModule,
  ],
})
export class AppModule {}
