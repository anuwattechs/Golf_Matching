import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MemberModel,
  VerificationRegistrationModel,
  VerificationResetPasswordModel,
  VerificationCodesModel,
} from '.';
import {
  Member,
  MemberSchema,
  VerificationRegistration,
  VerificationRegistrationSchema,
  VerificationResetPassword,
  VerificationResetPasswordSchema,
  VerificationCode,
  VerificationCodeSchema,
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
      {
        name: VerificationCode.name,
        schema: VerificationCodeSchema,
      },
    ]),
  ],
  providers: [
    MemberModel,
    VerificationRegistrationModel,
    VerificationResetPasswordModel,
    VerificationCodesModel,
  ],
  exports: [
    MemberModel,
    VerificationRegistrationModel,
    VerificationResetPasswordModel,
    VerificationCodesModel,
  ],
})
export class ModelsModule {}
