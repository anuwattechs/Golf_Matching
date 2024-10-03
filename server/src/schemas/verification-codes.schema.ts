import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { AuthTypeEnum, VerifyTypeEnum } from 'src/shared/enums';

@Schema({ collection: 'VerificationCodes', timestamps: true, versionKey: false })
export class VerificationCodes extends Document {
  @Prop({
    type: String, // Define the type of _id as String for UUID
    default: uuidv4, // Set UUID as the default value for _id
  })
  _id: string;

  @Prop({ required: true, type: String }) //! Email or Phone Number
  username: string;

  @Prop({ required: true, default: AuthTypeEnum.EMAIL }) //! "EMAIL" or "PHONE"
  authType: AuthTypeEnum;
  
  @Prop({ required: true })
  verifyType: VerifyTypeEnum;

  @Prop({ required: true })
  verifyCode: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: null })
  verifiedAt: Date;

  @Prop({ default: null })
  expiredAt: Date;
}

export const VerificationCodesSchema = SchemaFactory.createForClass(
  VerificationCodes,
);
