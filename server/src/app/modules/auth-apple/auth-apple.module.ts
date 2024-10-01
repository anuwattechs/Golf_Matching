<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { Module } from "@nestjs/common";
import { AuthAppleService } from "./auth-apple.service";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "../auth/auth.module";
import { AuthAppleController } from "./auth-apple.controller";
=======
=======
>>>>>>> a768db95c667773a296a2e5a7ac9eee2a815d013
import { Module } from '@nestjs/common';
import { AuthAppleService } from './auth-apple.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth2/auth.module';
import { AuthAppleController } from './auth-apple.controller';
<<<<<<< HEAD
>>>>>>> b398a21 (Updated /auth*)
=======
>>>>>>> a768db95c667773a296a2e5a7ac9eee2a815d013

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
