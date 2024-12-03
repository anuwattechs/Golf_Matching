import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { VerificationCode } from '..';
import { Model, UpdateWriteOpResult, now } from 'mongoose';
import { CreateVerificationCodeDto } from './dto';

@Injectable()
export class VerificationCodesModel {
  constructor(
    @InjectModel(VerificationCode.name)
    private verificationCode: Model<VerificationCode>,
  ) {}

  create(input: CreateVerificationCodeDto): Promise<VerificationCode> {
    console.log('input', input);

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
          registeredAt: now(),
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
          resetedAt: now(),
        },
      },
    );
  }

  verify(verifyId: string): Promise<UpdateWriteOpResult> {
    return this.verificationCode.updateOne(
      {
        _id: verifyId,
      },
      {
        $set: {
          isVerified: true,
          verifiedAt: now(),
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

    if (!result) return 'otp.VERIFICATION_CODE_IS_INVALID';
    if (result.isVerified) return 'otp.VERIFICATION_CODE_IS_ALREADY_VERIFIED';
    if (result.expiredAt < new Date())
      return 'otp.VERIFICATION_CODE_IS_EXPIRED';

    return null;
  }
}
