import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  // HttpException,
  // HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseMessage } from 'src/app/common/decorator/response-message.decorator';
import {
  VerificationRegisterDto,
  VerifyOtpDto,
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
} from './dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { Request } from 'express';
import { JwtPayloadType } from './strategy/jwt-payload.type';

// @UseGuards(JwtAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verification-register')
  @ResponseMessage('Verification code sent successfully')
  async createVerificationRegister(
    @Body() body: VerificationRegisterDto,
  ) /*: Promise<LoginResponseDto> */ {
    return await this.authService.createVerificationRegister(body);
  }

  @Patch('verify-otp-register')
  @ResponseMessage('User verified successfully')
  async verifyOtpRegister(
    @Body() body: VerifyOtpDto,
  ) /*: Promise<LoginResponseDto> */ {
    return await this.authService.verifyOtpRegister(body);
  }

  @Post('register')
  @ResponseMessage('User registered successfully')
  async register(@Body() body: RegisterDto) /*: Promise<LoginResponseDto> */ {
    return await this.authService.register(body);
  }

  @Post('login')
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
    console.log('req.decoded', req.decoded);
    return await this.authService.changePassword(body, req.decoded);
  }

  @Get('test1')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Test1')
  async test1(
    @Req() req: Request & { decoded: JwtPayloadType },
  ) /*: Promise<LoginResponseDto> */ {
    console.log('req.decoded', req.decoded);
    return req.decoded;
  }
}
