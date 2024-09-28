import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { GoogleConfig } from './config/google-config.type';
import { AuthGoogleLoginDto } from './dto/auth-google-login.dto';
import { GoogleInterface } from './dto/google.interface';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthGoogleService {
  private google: OAuth2Client;

  constructor(private configService: ConfigService<GoogleConfig>) {
    this.google = new OAuth2Client({
      clientId: this.configService.get('clientId'),
      clientSecret: this.configService.get('clientSecret'),
    });
  }

  async getProfileByToken(loginDto: AuthGoogleLoginDto): Promise<any> {
    const ticket = await this.google.verifyIdToken({
      idToken: loginDto?.IdToken,
      audience: this.configService.get('clientId'),
    });
    return ticket.getPayload();
  }

  async validateSocialLogin(
    authProvider: 'google' | 'facebook',
    socialData: GoogleInterface,
  ): Promise<LoginResponseDto> {
    return {
      token: 'token',
      refreshToken: 'refreshToken',
      tokenExpires: 0,
      user: {
        id: socialData.id,
        email: socialData.email,
        firstName: socialData?.firstName,
        lastName: socialData?.lastName,
      },
    };
  }
}
