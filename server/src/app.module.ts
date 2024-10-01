import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './core/database/mongoose-config.service';
import { databaseConfig } from './core/database/config';
import { AuthModule } from './app/modules/auth/auth.module';
import { UsersModule } from './app/modules/users/users.module';
import { AuthGoogleModule } from './app/modules/auth-google/auth-google.module';
import { AuthFacebookModule } from './app/modules/auth-facebook/auth-facebook.module';
import { AuthAppleController } from './app/modules/auth-apple/auth-apple.controller';
import { AuthAppleModule } from './app/modules/auth-apple/auth-apple.module';
import { MailService } from './app/modules/mail/mail.service';
import { MailModule } from './app/modules/mail/mail.module';
import { SmsModule } from './app/modules/sms/sms.module';
import googleConfig from './app/modules/auth-google/config/google.config';
import facebookConfig from './app/modules/auth-facebook/config/facebook.config';
import mailConfig from './app/modules/mail/config/mail.config';
import smsConfig from './app/modules/sms/config/sms.config';

const infrastructureDatabaseModule = MongooseModule.forRootAsync({
  useClass: MongooseConfigService,
});

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        googleConfig,
        facebookConfig,
        mailConfig,
        smsConfig,
      ],
      envFilePath: ['.env'],
    }),
    infrastructureDatabaseModule,
    AuthGoogleModule,
    AuthFacebookModule,
    AuthAppleModule,
    MailModule,
    SmsModule,
  ],
})
export class AppModule {}
