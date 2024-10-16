import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { VerificationCode } from '..';
import { Model } from 'mongoose';
import { CreateVerificationCodeDto } from './dto';

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

  registerAt(verifyId: string): Promise<unknown> {
    return this.verificationCode.updateOne(
      {
        _id: verifyId,
      },
      {
        $set: {
          registeredAt: new Date(),
        },
      },
    );
  }

  resetAt(verifyId: string): Promise<unknown> {
    return this.verificationCode.updateOne(
      {
        _id: verifyId,
      },
      {
        $set: {
          resetedAt: new Date(),
        },
      },
    );
  }

  verify(verifyId: string): Promise<unknown> {
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

  findByUsername(
    username: string,
    isVerified: boolean[] = [false, true, null],
  ): Promise<VerificationCode> {
    return this.verificationCode
      .findOne({ username: username, isVerified: { $in: isVerified } })
      .exec();
  }

  async validate(verifyId: string, verifyCode: string): Promise<string | null> {
    // return this.verificationCode.findOne({
    //   _id: verifyId,
    //   verifyCode,
    // });

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
