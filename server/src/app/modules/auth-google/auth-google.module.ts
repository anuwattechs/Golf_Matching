import { Module } from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';
import { AuthModule } from '../auth/auth.module';
import { AuthGoogleController } from './auth-google.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, AuthModule],
  providers: [AuthGoogleService],
  controllers: [AuthGoogleController],
  exports: [AuthGoogleService],
})
export class AuthGoogleModule {}
