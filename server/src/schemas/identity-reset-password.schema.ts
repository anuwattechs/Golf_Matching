import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { AuthProvidersEnum } from "src/shared/enums";

// export type IdentityResetPasswordDocument = IdentityResetPassword & Document;

// @Schema({ collection: 'IdentityResetPassword', versionKey: false })
@Schema({ collection: "IdentityResetPassword", timestamps: true })
export class IdentityResetPassword extends Document {
  @Prop({
    type: String, // Define the type of _id as String for UUID
    default: uuidv4, // Set UUID as the default value for _id
  })
  _id: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true }) //! Email or Phone Number
  email: string;

  @Prop({ required: true, default: AuthProvidersEnum.EMAIL }) //! "EMAIL" or "PHONE"
  provider: AuthProvidersEnum;

  @Prop({ required: true })
  verifyCode: string;

  @Prop({ default: null })
  isVerified: boolean;

  @Prop({ default: null })
  resetedAt: Date;

  //   @Prop({ default: Date.now })
  //   createdAt: Date;

  //   @Prop({ default: Date.now })
  //   updatedAt: Date;
}

export const IdentityResetPasswordPasswordSchema = SchemaFactory.createForClass(
  IdentityResetPassword
);
