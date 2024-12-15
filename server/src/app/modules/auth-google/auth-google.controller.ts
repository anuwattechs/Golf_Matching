import {
  Controller,
  HttpException,
  HttpCode,
  HttpStatus,
  Post,
  Body,
} from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';
import { ResponseMessage } from 'src/app/common/decorator/response-message.decorator';
import { AuthGoogleLoginDto } from './dto/auth-google-login.dto';
import { AuthService } from '../auth/auth.service';
import { NullableType } from 'src/shared/types';
import { UtilsService } from 'src/shared/utils/utils.service';

@Controller({
  path: 'auth/google',
})
export class AuthGoogleController {
  constructor(
    private readonly authGoogleService: AuthGoogleService,
    private readonly authService: AuthService,
    private readonly utilsService: UtilsService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('auth-google.USER_LOGGED_IN_SUCCESSFULLY')
  async login(
    @Body() body: AuthGoogleLoginDto,
  ): Promise<NullableType<unknown>> {
    try {
      const socialData = await this.authGoogleService.getProfileByToken(body);
      return this.authService.validateSocialLogin(socialData);
    } catch (error) {
      throw new HttpException(
        {
          message: this.utilsService.getMessagesTypeSafe(
            'auth-google.INVALID_TOKEN',
          ),
        },
        401,
      );
    }
  }
}
