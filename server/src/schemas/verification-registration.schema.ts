import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { AuthTypeEnum } from 'src/shared/enums';

// export type IdentityRegistrationDocument = IdentityRegistration & Document;

// @Schema({ collection: 'IdentityRegistration', versionKey: false })
@Schema({ collection: 'VerificationRegistration', timestamps: true })
export class VerificationRegistration extends Document {
  @Prop({
    type: String, // Define the type of _id as String for UUID
    default: uuidv4, // Set UUID as the default value for _id
  })
  _id: string;

  @Prop({ unique: true, required: true, type: String }) //! Email or Phone Number
  email: string;

  @Prop({ required: true, default: AuthTypeEnum.EMAIL }) //! "EMAIL" or "PHONE"
  provider: AuthTypeEnum;

  @Prop({ required: true })
  verifyCode: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: 1 })
  sentCount: number;

  //   @Prop({ default: Date.now })
  //   createdAt: Date;

  //   @Prop({ default: Date.now })
  //   updatedAt: Date;
}

export const VerificationRegistrationSchema = SchemaFactory.createForClass(
  VerificationRegistration,
);
