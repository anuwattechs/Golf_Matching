// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/app/config/config.type';
import { JwtPayloadType } from './jwt-payload.type';

console.log('Test', new ConfigService<AllConfigType>().get<string>('auth.jwtSecret', {
  infer: true,
}));

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // constructor(private readonly configService: ConfigService<AllConfigType>) {
  //   super({
  //     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  //     ignoreExpiration: false,
  //     secretOrKey: configService.get<string>('auth.jwtSecret', {
  //       infer: true,
  //     }), 
  //   });
  // }
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // secretOrKey: new ConfigService<AllConfigType>().get<string>('auth.jwtSecret', {
      //   infer: true,
      // }), 
      secretOrKey: process.env.AUTH_JWT_SECRET, 
    });
  }

  async validate(payload: JwtPayloadType) {
    return { userId: payload.userId, email: payload.email, firstName: payload.firstName, lastName: payload.lastName };
  }
}