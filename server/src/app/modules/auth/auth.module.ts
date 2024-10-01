import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
// import {
//   Member,
//   MemberSchema,
//   VerificationRegistration,
//   VerificationRegistrationSchema,
//   VerificationResetPassword,
//   VerificationResetPasswordSchema,
// } from 'src/schemas';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/app/config/config.type';
import { ConfigModule } from '@nestjs/config';
import { UtilsModule } from 'src/shared/utils/utils.module';
// import { MemberModelModule, VerificationRegistrationModelModule, VerificationResetPasswordModelModule } from 'src/schemas/models';
import { ModelsModule } from 'src/schemas/models/models.module';

@Module({
  imports: [
    ConfigModule,
    UtilsModule,
    // MemberModelModule,
    // VerificationRegistrationModelModule,
    // VerificationResetPasswordModelModule,
    ModelsModule,
    // MongooseModule.forFeature([
    //   {
    //     name: Member.name,
    //     schema: MemberSchema,
    //   },
    //   {
    //     name: VerificationRegistration.name,
    //     schema: VerificationRegistrationSchema,
    //   },
    //   {
    //     name: VerificationResetPassword.name,
    //     schema: VerificationResetPasswordSchema,
    //   },
    // ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      // secret: new ConfigService<AllConfigType>().get<string>('auth.jwtSecret', {
      //   infer: true,
      // }),
      // signOptions: { expiresIn: '1h' },
      secret: new ConfigService<AllConfigType>().get<string>('auth.jwtSecret', {
        infer: true,
      }),
      signOptions: { expiresIn: new ConfigService<AllConfigType>().get<string>('auth.jwtExpiresIn', {
        infer: true,
      }) },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
