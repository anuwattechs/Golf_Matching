import {
  Controller,
  HttpException,
  HttpCode,
  HttpStatus,
  Body,
  Post,
  Patch,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { ResponseMessage } from 'src/app/common/decorator/response-message.decorator';
import { AuthFacebookService } from './auth-facebook.service';
import { AuthFacebookLoginDto } from './dto/auth-facebook-login.dto';
import { NullableType } from 'src/shared/types';
import { UtilsService } from 'src/shared/utils/utils.service';
import { JwtPayloadType } from '../auth/strategies/types';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { SocialTypeEnum } from 'src/shared/enums';

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

  @Patch('add-social-account')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('auth-facebook.ADDED_FACEBOOK_ACCOUNT_SUCCESSFULLY')
  async addSocialAccount(
    @Body() body: AuthFacebookLoginDto,
    @Req() req: Request & { decoded: JwtPayloadType },
  ): Promise<NullableType<unknown>> {
    try {
      const socialData = await this.authFacebookService.getProfileByToken(body);
      return this.authService.addSocialAccount(
        socialData,
        SocialTypeEnum.FACEBOOK,
        req.decoded,
      );
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

  @Delete('remove-social-account')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('auth-facebook.REMOVED_FACEBOOK_ACCOUNT_SUCCESSFULLY')
  async removeSocialAccount(
    @Req() req: Request & { decoded: JwtPayloadType },
  ): Promise<NullableType<unknown>> {
    try {
      return this.authService.removeSocialAccount(
        SocialTypeEnum.FACEBOOK,
        req.decoded,
      );
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
