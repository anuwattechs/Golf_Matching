import { Module } from '@nestjs/common';
import { AuthFacebookService } from './auth-facebook.service';
import { AuthFacebookController } from './auth-facebook.controller';

@Module({
  controllers: [AuthFacebookController],
  providers: [AuthFacebookService],
})
export class AuthFacebookModule {}
