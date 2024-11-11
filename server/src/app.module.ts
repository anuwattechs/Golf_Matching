import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { GolfCoursesModule } from './app/modules/golf-courses/golf-courses.module';
import googleConfig from './app/modules/auth-google/config/google.config';
import facebookConfig from './app/modules/auth-facebook/config/facebook.config';
import mailConfig from './app/common/services/mail/config/mail.config';
import smsConfig from './app/common/services/sms/config/sms.config';
import countryConfig from './app/modules/country/config/country.config';
import { CountryModule } from './app/modules/country/country.module';
import { AssetsModule } from './app/modules/assets/assets.module';
import assetsConfig from './app/modules/assets/config/assets.config';
import { I18nModule } from 'nestjs-i18n/dist/i18n.module';
import { HeaderResolver } from 'nestjs-i18n';
import path from 'path';
import { AllConfigType } from 'src/app/config/config.type';
import { HealthCheckModule } from './app/modules/health-check/health-check.module';
import { MatchModule } from './app/modules/match/match.module';
import { MatchRequestsModule } from './app/modules/match-requests/match-requests.module';
import { MatchPlayerModule } from './app/modules/match-player/match-player.module';
import { GolfCourseLayoutModule } from './app/modules/golf-course-layout/golf-course-layout.module';
import { HoleScoresModule } from './app/modules/hole-scores/hole-scores.module';
import { MemberSettingsModule } from './app/modules/member-settings/member-settings.module';

const infrastructureDatabaseModule = MongooseModule.forRootAsync({
  useClass: MongooseConfigService,
});

const environment = process.env.NODE_ENV || 'development';

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
        assetsConfig,
      ],
      envFilePath: [`.env.${environment}`, '.env'],
    }),
    infrastructureDatabaseModule,
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: true,
        },
        typesOutputPath: path.join(
          __dirname,
          '../src/generated/i18n.generated.ts',
        ),
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get('app.headerLanguage', {
                infer: true,
              }),
            ];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    AuthModule,
    AuthGoogleModule,
    AuthFacebookModule,
    AuthAppleModule,
    MembersModule,
    OtpModule,
    GolfCoursesModule,
    CountryModule,
    AssetsModule,
    HealthCheckModule,
    MatchModule,
    MatchRequestsModule,
    MatchPlayerModule,
    GolfCourseLayoutModule,
    HoleScoresModule,
    MemberSettingsModule,
  ],
})
export class AppModule {}
