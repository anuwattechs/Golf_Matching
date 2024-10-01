import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { AuthFacebookController } from './auth-facebook.controller';
import { AuthFacebookService } from './auth-facebook.service';
import { FacebookStrategy } from './strategy/facebook.strategy';

@Module({
  imports: [ConfigModule, AuthModule],
  providers: [AuthFacebookService, FacebookStrategy],
  exports: [AuthFacebookService],
  controllers: [AuthFacebookController],
})
export class AuthFacebookModule {}
