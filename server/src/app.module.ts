import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './core/database/mongoose-config.service';
import { databaseConfig } from './core/database/config';
import { AuthModule } from './app/modules/auth/auth.module';
import { UsersModule } from './app/modules/users/users.module';
import { AuthGoogleModule } from './app/modules/auth-google/auth-google.module';
import { AuthAppleModule } from './app/modules/auth-apple/auth-apple.module';
import { AuthFacebookModule } from './app/modules/auth-facebook/auth-facebook.module';

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
    AuthGoogleModule,
    AuthAppleModule,
    AuthFacebookModule,
  ],
})
export class AppModule {}
