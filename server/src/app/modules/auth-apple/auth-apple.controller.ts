import {
  Body,
  Post,
  Controller,
  HttpException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthAppleService } from './auth-apple.service';
import { ResponseMessage } from 'src/app/common/decorator/response-message.decorator';
import { AuthAppleLoginDto } from './dto/auth-apple-login.dto';
import { LoginResponseType, NullableType } from 'src/shared/types';
import { AuthTypeEnum } from 'src/shared/enums';

@Controller({
  path: 'auth/apple',
})
export class AuthAppleController {
  constructor(
    private readonly authService: AuthService,
    private readonly authFacebookService: AuthAppleService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('User logged in successfully')
  async login(
    @Body() loginDto: AuthAppleLoginDto,
  ): Promise<NullableType<unknown>> {
    try {
      const socialData =
        await this.authFacebookService.getProfileByToken(loginDto);
      return this.authService.validateSocialLogin(socialData);
    } catch (error) {
      throw new HttpException(
        {
          message: 'Invalid token',
        },
        401,
      );
    }
  }
}
