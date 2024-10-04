import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberModel, VerificationCodesModel } from '.';
import {
  Member,
  MemberSchema,
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
        name: VerificationCode.name,
        schema: VerificationCodeSchema,
      },
    ]),
  ],
  providers: [MemberModel, VerificationCodesModel],
  exports: [MemberModel, VerificationCodesModel],
})
export class ModelsModule {}
