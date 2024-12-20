import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/app/config/config.type';
import { AuthAppleLoginDto } from './dto/auth-apple-login.dto';
import { SocialInterface } from 'src/shared/interfaces';
import appleSigninAuth from 'apple-signin-auth';

@Injectable()
export class AuthAppleService {
  constructor(private configService: ConfigService<AllConfigType>) {}

  async getProfileByToken(
    loginDto: AuthAppleLoginDto,
  ): Promise<SocialInterface> {
    const data = await appleSigninAuth.verifyIdToken(loginDto.idToken, {
      audience: this.configService.get<string>('apple.appAudience', {
        infer: true,
      }),
    });

    return {
      id: data.sub,
      appleId: data.sub,
      email: data.email,
      firstName: '',
      lastName: '',
    };
  }
}
