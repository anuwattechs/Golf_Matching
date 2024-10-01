import { Controller, Get, HttpException, UseGuards } from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';
import { Post, Body, Request, Response } from '@nestjs/common';
import { ResponseMessage } from 'src/app/common/decorator/response-message.decorator';
import { AuthGoogleLoginDto } from './dto/auth-google-login.dto';
import { AuthProvidersEnum } from 'src/shared/enums';
import { AuthService } from '../auth2/auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { GoogleOAuthGuard } from './guard/google-oauth.guard';
import { SocialInterface } from 'src/shared/interfaces';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/app/config/config.type';

@Controller({
  path: 'auth/google',
})
export class AuthGoogleController {
  constructor(
    private readonly authGoogleService: AuthGoogleService,
    private readonly authService: AuthService,
    private configService: ConfigService<AllConfigType>,
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

  @Get()
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Request() _: unknown) {}

  @Get('callback')
  @UseGuards(GoogleOAuthGuard)
  @ResponseMessage('User logged in successfully')
  async googleAuthRedirect(
    @Request() req: any,
    @Response({
      passthrough: true,
    })
    res: any,
  ) {
    try {
      const socialData = req.user as SocialInterface;
      return this.authService.validateSocialLogin(
        AuthProvidersEnum.GOOGLE,
        socialData,
      );
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          message: `Invalid token`,
        },
        401,
      );
    }
  }
}
