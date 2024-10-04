import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './core/database/mongoose-config.service';
import { databaseConfig } from './core/database/config';
import { AuthModule } from './app/modules/auth/auth.module';
import authConfig from './app/modules/auth/config/auth.config';
import appConfig from './app/config/app.config';
import { AuthGoogleModule } from './app/modules/auth-google/auth-google.module';
import { AuthFacebookModule } from './app/modules/auth-facebook/auth-facebook.module';
import { AuthAppleModule } from './app/modules/auth-apple/auth-apple.module';
import { MembersModule } from './app/modules/members/members.module';
import { OtpModule } from './app/modules/otp/otp.module';
import googleConfig from './app/modules/auth-google/config/google.config';
import facebookConfig from './app/modules/auth-facebook/config/facebook.config';
import mailConfig from './app/common/services/mail/config/mail.config';
import smsConfig from './app/common/services/sms/config/sms.config';
import countryConfig from './app/modules/country/config/country.config';
import { CountryModule } from './app/modules/country/country.module';

const infrastructureDatabaseModule = MongooseModule.forRootAsync({
  useClass: MongooseConfigService,
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        appConfig,
        authConfig,
        googleConfig,
        facebookConfig,
        mailConfig,
        smsConfig,
        countryConfig,
      ],
      envFilePath: ['.env'],
    }),
    infrastructureDatabaseModule,
    AuthModule,
    AuthGoogleModule,
    AuthFacebookModule,
    AuthAppleModule,
    MembersModule,
    OtpModule,
    CountryModule,
  ],
})
export class AppModule {}
