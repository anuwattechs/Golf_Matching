import {
  Body,
  Post,
  Controller,
  HttpException,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
  Req,
  Delete,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { AuthAppleService } from './auth-apple.service';
import { ResponseMessage } from 'src/app/common/decorator/response-message.decorator';
import { AuthAppleLoginDto } from './dto/auth-apple-login.dto';
import { NullableType } from 'src/shared/types';
import { UtilsService } from 'src/shared/utils/utils.service';
import { JwtPayloadType } from '../auth/strategies/types';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { SocialTypeEnum } from 'src/shared/enums';

@Controller({
  path: 'auth/apple',
})
export class AuthAppleController {
  constructor(
    private readonly authService: AuthService,
    private readonly authAppleService: AuthAppleService,
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
        await this.authAppleService.getProfileByToken(loginDto);
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

  @Patch('add-social-account')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('auth-apple.ADDED_APPLE_ACCOUNT_SUCCESSFULLY')
  async addSocialAccount(
    @Body() body: AuthAppleLoginDto,
    @Req() req: Request & { decoded: JwtPayloadType },
  ): Promise<NullableType<unknown>> {
    try {
      const socialData = await this.authAppleService.getProfileByToken(body);
      return this.authService.addSocialAccount(
        socialData,
        SocialTypeEnum.APPLE,
        req.decoded,
      );
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

  @Delete('remove-social-account')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('auth-apple.REMOVED_APPLE_ACCOUNT_SUCCESSFULLY')
  async removeSocialAccount(
    @Req() req: Request & { decoded: JwtPayloadType },
  ): Promise<NullableType<unknown>> {
    try {
      return this.authService.removeSocialAccount(
        SocialTypeEnum.APPLE,
        req.decoded,
      );
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
