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
import { NullableType } from 'src/shared/types';
import { UtilsService } from 'src/shared/utils/utils.service';

@Controller({
  path: 'auth/apple',
})
export class AuthAppleController {
  constructor(
    private readonly authService: AuthService,
    private readonly authFacebookService: AuthAppleService,
    private readonly utilsService: UtilsService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('auth-apple.USER_LOGGED_IN_SUCCESSFULLY')
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
          message: this.utilsService.getMessagesTypeSafe(
            'auth-apple.INVALID_TOKEN',
          ),
        },
        401,
      );
    }
  }
}
