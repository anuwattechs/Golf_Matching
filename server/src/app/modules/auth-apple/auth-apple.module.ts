import { Module } from '@nestjs/common';
import { AuthAppleService } from './auth-apple.service';
import { AuthAppleController } from './auth-apple.controller';

@Module({
  controllers: [AuthAppleController],
  providers: [AuthAppleService],
})
export class AuthAppleModule {}
