import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { VerificationResetPassword } from '..';
import { Model } from 'mongoose';
import { CreateVerificationResetPasswordDto } from './dto';

@Injectable()
export class VerificationResetPasswordModel {
  constructor(
    @InjectModel(VerificationResetPassword.name)
    private verificationResetPassword: Model<VerificationResetPassword>,
  ) {}

  create(
    input: CreateVerificationResetPasswordDto,
  ): Promise<VerificationResetPassword> {
    return this.verificationResetPassword.create(input);
  }

  findById(
    transactionId: string,
    isVerified: boolean[] = [false, true, null],
  ): Promise<VerificationResetPassword> {
    return this.verificationResetPassword
      .findOne({ _id: transactionId, isVerified: { $in: isVerified } })
      .exec();
  }

  verify(transactionId: string): Promise<any> {
    return this.verificationResetPassword.updateOne(
      { _id: transactionId },
      { $set: { isVerified: true } },
    );
  }

  resetAt(transactionId: string): Promise<any> {
    return this.verificationResetPassword.updateOne(
      { _id: transactionId },
      { $set: { resetedAt: new Date() } },
    );
  }
}
