import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
