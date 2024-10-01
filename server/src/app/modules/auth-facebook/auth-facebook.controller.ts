import { Controller, HttpException, HttpStatus, Request } from '@nestjs/common';
import { AuthService } from '../auth2/auth.service';
import { Body, Post, Get } from '@nestjs/common';
import { ResponseMessage } from 'src/app/common/decorator/response-message.decorator';
import { AuthFacebookService } from './auth-facebook.service';
import { AuthFacebookLoginDto } from './dto/auth-facebook-login.dto';
import { LoginResponseDto } from '../auth-google/dto/login-response.dto';
import { AuthProvidersEnum } from 'src/shared/enums';
import { UseGuards } from '@nestjs/common';
import { FacebookAuthGuard } from './guard/facebook.guard';

@Controller({
  path: 'auth/facebook',
})
export class AuthFacebookController {
  constructor(
    private readonly authService: AuthService,
    private readonly authFacebookService: AuthFacebookService,
  ) {}

  @Post('login')
  @ResponseMessage('User logged in successfully')
  async login(
    @Body() loginDto: AuthFacebookLoginDto,
  ): Promise<LoginResponseDto> {
    try {
      const socialData =
        await this.authFacebookService.getProfileByToken(loginDto);
      return this.authService.validateSocialLogin(
        AuthProvidersEnum.FACEBOOK,
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
  @UseGuards(FacebookAuthGuard)
  @ResponseMessage('User logged in successfully')
  async facebookAuth(@Request() _: unknown) {
    return HttpStatus.OK;
  }

  @Get('callback')
  @UseGuards(FacebookAuthGuard)
  @ResponseMessage('User logged in successfully')
  async facebookAuthRedirect(@Request() req: any) {
    try {
      return this.authService.validateSocialLogin(
        AuthProvidersEnum.FACEBOOK,
        req.user,
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
