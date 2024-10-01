import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { VerificationResetPassword } from '..';
import { Model } from 'mongoose';

@Injectable()
export class VerificationResetPasswordModel {
  constructor(
    @InjectModel(VerificationResetPassword.name)
    private verificationResetPassword: Model<VerificationResetPassword>,
  ) {}
}
