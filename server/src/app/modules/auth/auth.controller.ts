import {
  Controller,
  Post,
  // Get,
  Patch,
  Body,
  // HttpException,
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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('User registered successfully')
  async register(@Body() body: RegisterDto) /*: Promise<LoginResponseDto> */ {
    return await this.authService.register(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('User logged in successfully')
  async login(@Body() body: LoginDto) /*: Promise<LoginResponseDto> */ {
    return await this.authService.login(body);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Password changed successfully')
  async changePassword(
    @Body() body: ChangePasswordDto,
    @Req() req: Request & { decoded: JwtPayloadType },
  ) /*: Promise<LoginResponseDto> */ {
    return await this.authService.changePassword(body, req.decoded);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshTokenGuard)
  @ResponseMessage('Token refreshed successfully')
  async refreshToken(
    @Req() req: Request & { decoded: JwtPayloadType },
  ) /*: Promise<LoginResponseDto> */ {
    return await this.authService.refreshToken(req.decoded);
    // console.log('req.decoded', req.decoded);
    // return null;
  }

  @Patch('reset-password')
  @ResponseMessage('User reset password successfully')
  async resetPassword(
    @Body() body: ResetPasswordDto,
  ) /*: Promise<LoginResponseDto> */ {
    return await this.authService.resetPassword(body);
  }
}
