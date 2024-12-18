import {
  Controller,
  HttpException,
  HttpCode,
  HttpStatus,
  Post,
  Patch,
  Delete,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGoogleService } from './auth-google.service';
import { ResponseMessage } from 'src/app/common/decorator/response-message.decorator';
import { AuthGoogleLoginDto } from './dto/auth-google-login.dto';
import { AuthService } from '../auth/auth.service';
import { NullableType } from 'src/shared/types';
import { UtilsService } from 'src/shared/utils/utils.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { SocialTypeEnum } from 'src/shared/enums';

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

  @Patch('add-social-account')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('auth-google.ADDED_GOOGLE_ACCOUNT_SUCCESSFULLY')
  async addSocialAccount(
    @Body() body: AuthGoogleLoginDto,
    @Req() req: Request & { decoded: JwtPayloadType },
  ): Promise<NullableType<unknown>> {
    try {
      const socialData = await this.authGoogleService.getProfileByToken(body);
      return this.authService.addSocialAccount(
        socialData,
        SocialTypeEnum.GOOGLE,
        req.decoded,
      );
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

  @Delete('remove-social-account')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('auth-google.REMOVED_GOOGLE_ACCOUNT_SUCCESSFULLY')
  async removeSocialAccount(
    @Req() req: Request & { decoded: JwtPayloadType },
  ): Promise<NullableType<unknown>> {
    try {
      return this.authService.removeSocialAccount(
        SocialTypeEnum.GOOGLE,
        req.decoded,
      );
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
