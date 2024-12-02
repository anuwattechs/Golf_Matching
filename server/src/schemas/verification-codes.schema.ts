import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { VerifyTypeAuthEnum, VerifyTypeEnum } from 'src/shared/enums';

@Schema({
  collection: 'VerificationCodes',
  timestamps: true,
  versionKey: false,
})
export class VerificationCode extends Document {
  @Prop({
    type: String, // Define the type of _id as String for UUID
    default: uuidv4, // Set UUID as the default value for _id
  })
  _id: string;

  @Prop({ required: true, type: String }) //! Email or Phone Number
  username: string;

  @Prop({ required: true, default: VerifyTypeEnum.REGISTER, type: String })
  verifyType: VerifyTypeEnum | VerifyTypeAuthEnum;

  @Prop({ required: true })
  verifyCode: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: null })
  verifiedAt: Date;

  @Prop({ default: null })
  expiredAt: Date;

  @Prop({ default: null })
  registeredAt: Date;

  @Prop({ default: null })
  resetedAt: Date;
}

export const VerificationCodeSchema =
  SchemaFactory.createForClass(VerificationCode);

VerificationCodeSchema.pre('save', function (next) {
  const verificationCode = this as VerificationCode;
  const now = new Date();
  // if (verificationCode.isModified('isVerified')) {
  //   verificationCode.verifiedAt = now;
  //   return next();
  // }
  now.setMinutes(now.getMinutes() + 5);
  verificationCode.expiredAt = now;
  next();
});
