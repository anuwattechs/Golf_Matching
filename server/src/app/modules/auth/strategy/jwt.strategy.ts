import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/app/config/config.type';
import { JwtPayloadType } from './jwt-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService<AllConfigType>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // secretOrKey: configService.get<string>('auth.jwtSecret', { infer: true }),
      // expiresIn: configService.get<string>('auth.jwtExpiresIn', {
      //   infer: true,
      // }),

      secretOrKey: '' + process.env.AUTH_JWT_SECRET,
      expiresIn: '1h',
    });
  }

  public validate(payload: JwtPayloadType) {
    console.log('JwtStrategy.validate', payload);

    return {
      memberId: payload.memberId,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
    };
  }
}
