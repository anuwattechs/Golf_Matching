import { Module } from '@nestjs/common';
import { AuthAppleService } from './auth-apple.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { AuthAppleController } from './auth-apple.controller';
import { UtilsModule } from 'src/shared/utils/utils.module';

@Module({
  imports: [ConfigModule, AuthModule, UtilsModule],
  providers: [AuthAppleService],
  exports: [AuthAppleService],
  controllers: [AuthAppleController],
})
export class AuthAppleModule {}
