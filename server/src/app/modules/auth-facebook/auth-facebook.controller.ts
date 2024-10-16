import {
  Controller,
  HttpException,
  HttpCode,
  HttpStatus,
  // Request,
  Body,
  Post,
  // Get,
  // UseGuards,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { ResponseMessage } from 'src/app/common/decorator/response-message.decorator';
import { AuthFacebookService } from './auth-facebook.service';
import { AuthFacebookLoginDto } from './dto/auth-facebook-login.dto';
import { NullableType } from 'src/shared/types';
import { UtilsService } from 'src/shared/utils/utils.service';

@Controller({
  path: 'auth/facebook',
})
export class AuthFacebookController {
  constructor(
    private readonly authService: AuthService,
    private readonly authFacebookService: AuthFacebookService,
    private readonly utilsService: UtilsService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('auth-facebook.USER_LOGGED_IN_SUCCESSFULLY')
  async login(
    @Body() loginDto: AuthFacebookLoginDto,
  ): Promise<NullableType<unknown>> {
    try {
      const socialData =
        await this.authFacebookService.getProfileByToken(loginDto);
      return this.authService.validateSocialLogin(socialData);
    } catch (error) {
      throw new HttpException(
        {
          message: this.utilsService.getMessagesTypeSafe(
            'auth-facebook.INVALID_TOKEN',
          ),
        },
        401,
      );
    }
  }
}
