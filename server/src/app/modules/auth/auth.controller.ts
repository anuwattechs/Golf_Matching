import {
  Controller,
  Post,
  Patch,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseMessage } from 'src/app/common/decorator/response-message.decorator';
import {
  VerificationRegisterDto,
  VerifyOtpDto,
  RegisterDto,
  LoginDto,
} from './dto';

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
}
