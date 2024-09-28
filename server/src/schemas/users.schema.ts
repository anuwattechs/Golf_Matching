import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AuthProvidersEnum } from 'src/shared/enums';
import { Exclude } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({
    type: String, // Define the type of _id as String for UUID
    default: uuidv4, // Set UUID as the default value for _id
  })
  _id: string;

  @Prop({ unique: true, nullable: true, type: String })
  email: string | null;

  @Prop({ nullable: true, select: false })
  @Exclude({ toPlainOnly: true })
  password?: string;

  @Exclude({ toPlainOnly: true })
  previousPassword?: string;

  loadPreviousPassword() {
    this.previousPassword = this.password;
  }

  @Prop({ default: AuthProvidersEnum.EMAIL })
  provider: AuthProvidersEnum;

  @Prop({ nullable: true, index: true, type: String })
  socialId: string | null;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ type: String })
  otp: string; // สำหรับ OTP

  @Prop({ type: Date })
  otpExpired: Date;

  @Prop({ default: false })
  otpSent: boolean;

  @Prop({
    nullable: true,
    type: String,
    unique: true,
  })
  phone: string | null;

  @Prop({ nullable: true, type: String })
  firstName: string | null;

  @Prop({ nullable: true, type: String })
  lastName: string | null;

  @Prop({
    default: Date.now,
  })
  lastLogin: Date;

  @Prop({
    default: Date.now,
  })
  createdAt: Date;

  @Prop({
    default: Date.now,
  })
  updatedAt: Date;

  @Prop({ nullable: true })
  deletedAt: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  const user = this as User;
  if (!user.isModified('password')) return next();
  user.previousPassword = user.password;
  next();
});
