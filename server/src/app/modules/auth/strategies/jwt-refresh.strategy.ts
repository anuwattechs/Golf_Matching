import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/app/config/config.type';
import { JwtPayloadType } from './types/jwt-payload.type';
import { OrNeverType } from 'src/shared/types';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService<AllConfigType>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: '' + process.env.AUTH_REFRESH_SECRET,
      // secretOrKey: configService.get('auth.refreshSecret', { infer: true }),
      expiresIn: '1h',
    });
  }

  public validate(payload: JwtPayloadType): OrNeverType<JwtPayloadType> {
    if (!payload.userId) throw new UnauthorizedException();
    // console.log('JwtStrategy.validate', payload);
    return {
      userId: payload.userId,
      username: payload.username,
      firstName: payload.firstName,
      lastName: payload.lastName,
    };
  }
}
