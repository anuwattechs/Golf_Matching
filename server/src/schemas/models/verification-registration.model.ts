import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { VerificationRegistration } from '..';
import { Model } from 'mongoose';
import {
  CreateVerificationRegistrationDto,
  UpdateOneVerificationRegistrationDto,
} from './dto/verification-registration.dto';

@Injectable()
export class VerificationRegistrationModel {
  constructor(
    @InjectModel(VerificationRegistration.name)
    private verificationRegistration: Model<VerificationRegistration>,
  ) {}

  create(
    input: CreateVerificationRegistrationDto,
  ): Promise<VerificationRegistration> {
    return this.verificationRegistration.create(input);
  }

  updateOne(input: UpdateOneVerificationRegistrationDto): Promise<any> {
    return this.verificationRegistration.updateOne(
      {
        email: input.email.toLowerCase(),
      },
      {
        $set: {
          ...input,
          email: input.email.toLowerCase(),
          // updatedAt: new Date(),
        },
      },
    );
  }

  verify(email: string): Promise<any> {
    return this.verificationRegistration.updateOne(
      {
        email,
      },
      {
        $set: {
          isVerified: true,
          updatedAt: new Date(),
        },
      },
    );
  }

  findAllByEmailOrPhone(
    email: string,
    isVerified: boolean[] = [false, true],
  ): Promise<VerificationRegistration[]> {
    return this.verificationRegistration
      .find({ email, isVerified: { $in: isVerified } })
      .exec();
  }

  findOneByEmailOrPhone(
    email: string,
    isVerified: boolean[] = [false, true],
  ): Promise<VerificationRegistration> {
    return this.verificationRegistration
      .findOne({ email, isVerified: { $in: isVerified } })
      .exec();
  }
}
