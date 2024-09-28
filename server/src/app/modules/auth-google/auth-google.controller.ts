import { Controller, HttpException } from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';
import { Post, Body } from '@nestjs/common';
import { ResponseMessage } from 'src/app/common/decorator/response-message.decorator';
import { AuthGoogleLoginDto } from './dto/auth-google-login.dto';
import { AuthProvidersEnum } from 'src/shared/enums';
import { AuthService } from '../auth/auth.service';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller({
  path: 'auth/google',
})
export class AuthGoogleController {
  constructor(
    private readonly authGoogleService: AuthGoogleService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @ResponseMessage('User logged in successfully')
  async login(@Body() loginDto: AuthGoogleLoginDto): Promise<LoginResponseDto> {
    try {
      const socialData =
        await this.authGoogleService.getProfileByToken(loginDto);

      return this.authService.validateSocialLogin(
        AuthProvidersEnum.GOOGLE,
        socialData,
      );
    } catch (error) {
      throw new HttpException(
        {
          message: 'Invalid token',
        },
        401,
      );
    }
  }
}
