import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { AuthProvidersEnum } from 'src/shared/enums';

// @Schema({ collection: 'IdentityResetPassword', versionKey: false })
@Schema({ collection: 'VerificationResetPassword', timestamps: true })
export class VerificationResetPassword extends Document {
  @Prop({
    type: String, // Define the type of _id as String for UUID
    default: uuidv4, // Set UUID as the default value for _id
  })
  _id: string;

  @Prop({ required: true })
  memberId: string;

  @Prop({ required: true }) //! Email or Phone Number
  email: string;

  @Prop({ required: true, default: AuthProvidersEnum.EMAIL }) //! "EMAIL" or "PHONE"
  provider: AuthProvidersEnum;

  @Prop({ required: true })
  verifyCode: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: null })
  resetedAt: Date;

  //   @Prop({ default: Date.now })
  //   createdAt: Date;

  //   @Prop({ default: Date.now })
  //   updatedAt: Date;
}

export const VerificationResetPasswordSchema = SchemaFactory.createForClass(
  VerificationResetPassword,
);