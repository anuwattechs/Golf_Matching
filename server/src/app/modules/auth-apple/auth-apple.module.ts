<<<<<<< HEAD
import { Module } from "@nestjs/common";
import { AuthAppleService } from "./auth-apple.service";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "../auth/auth.module";
import { AuthAppleController } from "./auth-apple.controller";

@Module({
  imports: [ConfigModule, AuthModule],
  providers: [AuthAppleService],
  exports: [AuthAppleService],
  controllers: [AuthAppleController],
=======
import { Module } from '@nestjs/common';
import { AuthAppleService } from './auth-apple.service';
import { AuthAppleController } from './auth-apple.controller';

@Module({
  controllers: [AuthAppleController],
  providers: [AuthAppleService],
>>>>>>> 586cf96 (Created auth social)
})
export class AuthAppleModule {}
