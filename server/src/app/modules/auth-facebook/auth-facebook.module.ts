import { Module } from '@nestjs/common';
<<<<<<< HEAD
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
=======
import { AuthFacebookService } from './auth-facebook.service';
import { AuthFacebookController } from './auth-facebook.controller';

@Module({
  controllers: [AuthFacebookController],
  providers: [AuthFacebookService],
>>>>>>> 586cf96 (Created auth social)
})
export class AuthFacebookModule {}
