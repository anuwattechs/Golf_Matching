import { Module } from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';
<<<<<<< HEAD
import { AuthModule } from '../auth/auth.module';
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
