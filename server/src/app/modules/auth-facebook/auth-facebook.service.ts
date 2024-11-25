import { Injectable } from '@nestjs/common';
import { Facebook } from 'fb';
import { ConfigService } from '@nestjs/config';
import { SocialInterface } from 'src/shared/interfaces';
import { AuthFacebookLoginDto } from './dto/auth-facebook-login.dto';
import { AllConfigType } from 'src/app/config/config.type';
import { FacebookInterface } from '../../../shared/interfaces/facebook.interface';
import { UtilsService } from 'src/shared/utils/utils.service';

@Injectable()
export class AuthFacebookService {
  private readonly fb: Facebook;

  constructor(
    private configService: ConfigService<AllConfigType>,
    private readonly utilsService: UtilsService,
  ) {
    this.fb = new Facebook({
      appId: this.configService.get<string>('facebook.appId', { infer: true }),
      appSecret: this.configService.get<string>('facebook.appSecret', {
        infer: true,
      }),
      version: 'v7.0',
    });
  }

  async getProfileByToken(
    loginDto: AuthFacebookLoginDto,
  ): Promise<SocialInterface> {
    this.fb.setAccessToken(loginDto.accessToken);

    try {
      const data: FacebookInterface = await this.fetchFacebookProfile();
      return this.mapToSocialInterface(data);
    } catch (error) {
      throw new Error(
        this.utilsService.getMessagesTypeSafe(
          'auth-facebook.ERROR_FETCHING_FACEBOOK_PROFILE:',
        ) + error.message,
      );
    }
  }

  private fetchFacebookProfile(): Promise<FacebookInterface> {
    return new Promise((resolve, reject) => {
      this.fb.api(
        '/me',
        'get',
        { fields: 'id,last_name,email,first_name' },
        (response: any) => {
          if (response?.error) {
            return reject(response?.error);
          }
          resolve(response);
        },
      );
    });
  }

  private mapToSocialInterface(data: FacebookInterface): SocialInterface {
    return {
      id: data.id,
      facebookId: data.id,
      email: data.email ?? '',
      firstName: data.first_name ?? '',
      lastName: data.last_name ?? '',
    };
  }
}
