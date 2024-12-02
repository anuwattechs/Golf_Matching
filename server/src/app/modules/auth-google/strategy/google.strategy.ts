import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/app/config/config.type';
import { SocialInterface } from 'src/shared/interfaces';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService<AllConfigType>) {
    super({
      clientID: configService.get<string>('google.clientId', { infer: true }),
      clientSecret: configService.get<string>('google.clientSecret', {
        infer: true,
      }),
      callbackURL: configService.get<string>('google.callbackURL', {
        infer: true,
      }),
      scope: ['email', 'profile'],
    });
  }
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: {
      id: string;
      emails: { value: string }[];
      name: { givenName: string; familyName: string };
    },
    done: VerifyCallback,
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
