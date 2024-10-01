import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/app/config/config.type';
import { SocialInterface } from 'src/shared/interfaces';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private configService: ConfigService<AllConfigType>) {
    super({
      clientID: configService.get<string>('facebook.appId', { infer: true }),
      clientSecret: configService.get<string>('facebook.appSecret', {
        infer: true,
      }),
      callbackURL: configService.get<string>('facebook.callbackURL', {
        infer: true,
      }),
      scope: ['email'],
      profileFields: ['id', 'emails', 'name'],
    });
  }
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (error: unknown, user: SocialInterface) => void,
  ): Promise<SocialInterface> {
    const { name, emails, id } = profile;
    const user: SocialInterface = {
      id,
      email: emails[0]?.value,
      firstName: name?.givenName,
      lastName: name?.familyName,
    };
    done(null, user);
    return user;
  }
}
