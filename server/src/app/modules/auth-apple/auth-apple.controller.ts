<<<<<<< HEAD
<<<<<<< HEAD
import { Controller, HttpException } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { AuthAppleService } from "./auth-apple.service";
import { Post } from "@nestjs/common";
import { ResponseMessage } from "src/app/common/decorator/response-message.decorator";
import { Body } from "@nestjs/common";
import { AuthAppleLoginDto } from "./dto/auth-apple-login.dto";
import { LoginResponseDto } from "../auth-google/dto/login-response.dto";
import { AuthProvidersEnum } from "src/shared/enums";
=======
import { Controller, HttpException } from '@nestjs/common';
import { AuthService } from '../auth2/auth.service';
import { AuthAppleService } from './auth-apple.service';
import { Post } from '@nestjs/common';
import { ResponseMessage } from 'src/app/common/decorator/response-message.decorator';
import { Body } from '@nestjs/common';
import { AuthAppleLoginDto } from './dto/auth-apple-login.dto';
import { LoginResponseDto } from '../auth-google/dto/login-response.dto';
import { AuthProvidersEnum } from 'src/shared/enums';
>>>>>>> b398a21 (Updated /auth*)

@Controller({
  path: 'auth/apple',
})
export class AuthAppleController {
  constructor(
    private readonly authService: AuthService,
    private readonly authFacebookService: AuthAppleService,
  ) {}

  @Post('login')
  @ResponseMessage('User logged in successfully')
  async login(@Body() loginDto: AuthAppleLoginDto): Promise<LoginResponseDto> {
    try {
      const socialData =
        await this.authFacebookService.getProfileByToken(loginDto);
      return this.authService.validateSocialLogin(
        AuthProvidersEnum.APPLE,
        socialData,
      );
    } catch (error) {
      throw new HttpException(
        {
          message: 'Invalid token',
        },
        401,
      );
    }
  }
=======
import { Controller } from '@nestjs/common';
import { AuthAppleService } from './auth-apple.service';

@Controller('auth-apple')
export class AuthAppleController {
  constructor(private readonly authAppleService: AuthAppleService) {}
>>>>>>> 586cf96 (Created auth social)
}
