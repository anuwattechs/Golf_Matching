import {
  Controller,
  Post,
  Patch,
  Body,
  HttpStatus,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseMessage } from 'src/app/common/decorator/response-message.decorator';
import {
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
  ResetPasswordDto,
} from './dto';
import { JwtAuthGuard, JwtRefreshTokenGuard } from './guard';
import { Request } from 'express';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { I18nTranslations } from 'src/generated/i18n.generated';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('auth.USER_REGISTERED_SUCCESSFULLY')
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('auth.USER_LOGGED_IN_SUCCESSFULLY')
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('auth.PASSWORD_CHANGED_SUCCESSFULLY')
  async changePassword(
    @Body() body: ChangePasswordDto,
    @Req() req: Request & { decoded: JwtPayloadType },
  ) {
    return await this.authService.changePassword(body, req.decoded);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshTokenGuard)
  @ResponseMessage('auth.TOKEN_REFRESHED_SUCCESSFULLY')
  async refreshToken(@Req() req: Request & { decoded: JwtPayloadType }) {
    return await this.authService.refreshToken(req.decoded);
  }

  @Patch('reset-password')
  @ResponseMessage('auth.USER_RESET_PASSWORD_SUCCESSFULLY')
  async resetPassword(@Body() body: ResetPasswordDto) {
    return await this.authService.resetPassword(body);
  }
}
