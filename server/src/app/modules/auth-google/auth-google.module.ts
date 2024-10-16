import { Module } from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';
import { AuthModule } from '../auth/auth.module';
import { AuthGoogleController } from './auth-google.controller';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from './strategy/google.strategy';
import { UtilsModule } from 'src/shared/utils/utils.module';

@Module({
  imports: [ConfigModule, AuthModule, UtilsModule],
  providers: [AuthGoogleService, GoogleStrategy],
  controllers: [AuthGoogleController],
  exports: [AuthGoogleService],
})
export class AuthGoogleModule {}
