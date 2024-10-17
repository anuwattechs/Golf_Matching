import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { SocialInterface } from 'src/shared/interfaces';
import { AuthGoogleLoginDto } from './dto/auth-google-login.dto';
import { AllConfigType } from 'src/app/config/config.type';
import { UtilsService } from 'src/shared/utils/utils.service';

@Injectable()
export class AuthGoogleService {
  private google: OAuth2Client;

  constructor(
    private configService: ConfigService<AllConfigType>,
    private readonly utilsService: UtilsService,
  ) {
    this.google = new OAuth2Client(
      configService.get<string>('google.clientId', { infer: true }),
      configService.get<string>('google.clientSecret', { infer: true }),
    );
  }

  async getProfileByToken(
    loginDto: AuthGoogleLoginDto,
  ): Promise<SocialInterface> {
    const ticket = await this.google.verifyIdToken({
      idToken: loginDto.idToken,
      audience: [
        this.configService.getOrThrow<string>('google.clientId', {
          infer: true,
        }),
      ],
    });

    const data = ticket.getPayload();

    if (!data) {
      throw new HttpException(
        {
          message: this.utilsService.getMessagesTypeSafe(
            'auth-google.INVALID_TOKEN',
          ),
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return {
      id: data.sub,
      googleId: data.sub,
      email: data.email,
      firstName: data.given_name ?? '',
      lastName: data.family_name ?? '',
    };
  }
}
