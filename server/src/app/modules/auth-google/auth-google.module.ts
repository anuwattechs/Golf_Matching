import { Module } from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { AuthModule } from '../auth/auth.module';
=======
import { AuthModule } from '../auth2/auth.module';
>>>>>>> b398a21 (Updated /auth*)
=======
import { AuthModule } from '../auth2/auth.module';
>>>>>>> a768db95c667773a296a2e5a7ac9eee2a815d013
import { AuthGoogleController } from './auth-google.controller';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [ConfigModule, AuthModule],
  providers: [AuthGoogleService, GoogleStrategy],
  controllers: [AuthGoogleController],
  exports: [AuthGoogleService],
=======
import { AuthGoogleController } from './auth-google.controller';

@Module({
  controllers: [AuthGoogleController],
  providers: [AuthGoogleService],
>>>>>>> 586cf96 (Created auth social)
})
export class AuthGoogleModule {}
