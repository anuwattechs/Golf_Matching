// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/app/config/config.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService<AllConfigType>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // รับ JWT จาก header Authorization
      ignoreExpiration: false, // ไม่ยอมรับ token ที่หมดอายุ
      secretOrKey: configService.get<string>('auth.jwtSecret', {
        infer: true,
      }), // ใช้ secret เดียวกับที่ใช้ sign JWT
    });
  }

  async validate(payload: any) {
    // payload คือข้อมูลที่ถูก encode มาใน JWT
    return { userId: payload.sub, username: payload.username };
  }
}