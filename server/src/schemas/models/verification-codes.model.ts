import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { VerificationCode } from '..';
import { Model } from 'mongoose';
import { CreateVerificationCodeDto } from './dto/verification-codes.dto';

@Injectable()
export class VerificationCodesModel {
  constructor(
    @InjectModel(VerificationCode.name)
    private verificationCode: Model<VerificationCode>,
  ) {}

  create(input: CreateVerificationCodeDto): Promise<VerificationCode> {
    // const now = new Date();
    // return this.verificationCode.create({
    //   ...input,
    //   expiredAt: now.setMinutes(now.getMinutes() + 5),
    // });
    return this.verificationCode.create(input);
  }

  verify(verifyId: string): Promise<any> {
    return this.verificationCode.updateOne(
      {
        _id: verifyId,
      },
      {
        $set: {
          isVerified: true,
          verifiedAt: new Date(),
        },
      },
    );
  }

  findById(
    verifyId: string,
    isVerified: boolean[] = [false, true, null],
  ): Promise<VerificationCode> {
    return this.verificationCode
      .findOne({ _id: verifyId, isVerified: { $in: isVerified } })
      .exec();
  }

  async validate(verifyId: string, verifyCode: string): Promise<string | null> {
    const result = await this.verificationCode.findOne({
      _id: verifyId,
      verifyCode,
    });

    if (!result) return 'Verification code is invalid';
    if (result.isVerified) return 'Verification code is already verified';
    if (result.expiredAt < new Date()) return 'Verification code is expired';

    return null;
  }
}
