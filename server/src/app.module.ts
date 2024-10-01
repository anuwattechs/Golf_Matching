import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './core/database/mongoose-config.service';
import { databaseConfig } from './core/database/config';
import { UsersModule } from './app/modules/users/users.module';
import { AuthGoogleModule } from './app/modules/auth-google/auth-google.module';
<<<<<<< HEAD
import { AuthFacebookModule } from './app/modules/auth-facebook/auth-facebook.module';
import { AuthAppleController } from './app/modules/auth-apple/auth-apple.controller';
import { AuthAppleModule } from './app/modules/auth-apple/auth-apple.module';
import { AuthModule } from './app/modules/auth/auth.module';
import googleConfig from './app/modules/auth-google/config/google.config';
import facebookConfig from './app/modules/auth-facebook/config/facebook.config';
import appConfig from './app/config/app.config';
=======
import { AuthAppleModule } from './app/modules/auth-apple/auth-apple.module';
import { AuthFacebookModule } from './app/modules/auth-facebook/auth-facebook.module';
>>>>>>> 586cf96 (Created auth social)

const infrastructureDatabaseModule = MongooseModule.forRootAsync({
  useClass: MongooseConfigService,
});

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, googleConfig, facebookConfig, appConfig],
      envFilePath: ['.env'],
    }),
    infrastructureDatabaseModule,
    AuthGoogleModule,
<<<<<<< HEAD
    AuthFacebookModule,
    AuthAppleModule,
<<<<<<< HEAD
<<<<<<< HEAD
=======
    AuthAppleModule,
    AuthFacebookModule,
>>>>>>> 586cf96 (Created auth social)
=======
    AuthModule,
>>>>>>> b398a21 (Updated /auth*)
=======
    AuthModule,
>>>>>>> a768db95c667773a296a2e5a7ac9eee2a815d013
  ],
  controllers: [AuthAppleController],
})
export class AppModule {}
