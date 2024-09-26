import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// export type IdentityVerificationDocument = IdentityVerification & Document;

@Schema({ collection: 'IdentityVerificationRegistration', versionKey: false })
export class IdentityVerificationRegistration extends Document {
  @Prop({
    type: String, // Define the type of _id as String for UUID
    default: uuidv4, // Set UUID as the default value for _id
  })
  _id: string;

  @Prop({ required: true }) //! Email or Phone Number
  username: string;

  @Prop({ required: true }) //! "EMAIL" or "PHONE"
  type: string;

  @Prop({ required: true })
  verify_code: string;

  @Prop({ default: null })
  is_verified: boolean;

  @Prop({ default: 1 })
  sent_count: number;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const IdentityVerificationRegistrationSchema =
  SchemaFactory.createForClass(IdentityVerificationRegistration);
