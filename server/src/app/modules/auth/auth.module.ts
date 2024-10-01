import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {
  Member,
  MemberSchema,
  VerificationRegistration,
  VerificationRegistrationSchema,
  VerificationResetPassword,
  VerificationResetPasswordSchema,
} from 'src/schemas';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/app/config/config.type';


// สร้าง module สำหรับการจัดการ authentication
// โดยมีการ import JwtModule, PassportModule, MongooseModule และ AuthService
// และ JwtStrategy ซึ่งเป็น class ที่ใช้สำหรับการ validate JWT
// โดย JwtStrategy จะถูกใช้เป็น default strategy ในการ authenticate ผู้ใช้
// และใช้ secret ที่ถูกกำหนดใน config ของโปรเจคเป็น secret ในการ sign JWT
// และกำหนดเวลาในการหมดอายุของ token ให้เป็น 1 ชั่วโมง
// โดยใน module นี้มี controller ชื่อ AuthController และ provider ชื่อ AuthService
// และ JwtStrategy

const configService = new ConfigService<AllConfigType>();

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Member.name,
        schema: MemberSchema,
      },
      {
        name: VerificationRegistration.name,
        schema: VerificationRegistrationSchema,
      },
      {
        name: VerificationResetPassword.name,
        schema: VerificationResetPasswordSchema,
      },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      // secret: new ConfigService<AllConfigType>().get<string>('auth.jwtSecret', {
      //   infer: true,
      // }),
      // signOptions: { expiresIn: '1h' },
      secret: configService.get<string>('auth.jwtSecret', {
        infer: true,
      }),
      signOptions: { expiresIn: configService.get<string>('auth.jwtExpiresIn', {
        infer: true,
      }) },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
