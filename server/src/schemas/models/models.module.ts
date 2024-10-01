import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberModel, VerificationRegistrationModel, VerificationResetPasswordModel } from '.';
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
  ]),],
  providers: [MemberModel, VerificationRegistrationModel, VerificationResetPasswordModel],
  exports: [MemberModel, VerificationRegistrationModel, VerificationResetPasswordModel],
})
export class ModelsModule {}
