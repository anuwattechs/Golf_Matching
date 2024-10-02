import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './core/database/mongoose-config.service';
import { databaseConfig } from './core/database/config';
// import { AuthGoogleModule } from './app/modules/auth-google/auth-google.module';
// import { AuthFacebookModule } from './app/modules/auth-facebook/auth-facebook.module';
// import { AuthAppleController } from './app/modules/auth-apple/auth-apple.controller';
// import { AuthAppleModule } from './app/modules/auth-apple/auth-apple.module';
import { AuthModule } from './app/modules/auth/auth.module';
import googleConfig from './app/modules/auth-google/config/google.config';
import facebookConfig from './app/modules/auth-facebook/config/facebook.config';
import authConfig from './app/modules/auth/config/auth.config';
import appConfig from './app/config/app.config';

const infrastructureDatabaseModule = MongooseModule.forRootAsync({
  useClass: MongooseConfigService,
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, googleConfig, facebookConfig, appConfig],
      envFilePath: ['.env'],
    }),
    infrastructureDatabaseModule,
    // AuthGoogleModule,
    // AuthFacebookModule,
    // AuthAppleModule,
    AuthModule,
  ],
  // controllers: [AuthAppleController],
})
export class AppModule {}
