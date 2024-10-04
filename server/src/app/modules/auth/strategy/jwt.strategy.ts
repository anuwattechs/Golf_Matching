import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/app/config/config.type';
import { JwtPayloadType } from './jwt-payload.type';
import { OrNeverType } from 'src/shared/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService<AllConfigType>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: '' + process.env.AUTH_JWT_SECRET,
      expiresIn: '1h',
    });
  }

  public validate(payload: JwtPayloadType): OrNeverType<JwtPayloadType> {
    // console.log('JwtStrategy.validate', payload);
    return {
      userId: payload.userId,
      username: payload.username,
      firstName: payload.firstName,
      lastName: payload.lastName,
    };
  }
}
