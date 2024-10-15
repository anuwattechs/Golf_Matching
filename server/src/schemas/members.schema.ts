import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Exclude } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';

@Schema({ collection: 'Members', timestamps: true, versionKey: false })
export class Member extends Document {
  @Prop({
    type: String, // Define the type of _id as String for UUID
    default: uuidv4, // Set UUID as the default value for _id
  })
  _id: string;

  @Prop({ required: true, type: String })
  firstName: string;

  @Prop({ required: true, type: String })
  lastName: string;

  @Prop({ default: null })
  nickName: string;

  @Prop({ default: null })
  birthDate: string;

  @Prop({ default: null })
  email: string; // Email may be updated later

  @Prop({ default: null })
  phoneNo: string; // Phone number may be updated later

  @Prop({ nullable: true })
  // @Exclude({ toPlainOnly: true })
  password: string;

  @Exclude({ toPlainOnly: true })
  previousPassword?: string;

  loadPreviousPassword() {
    this.previousPassword = this.password;
  }

  // Remove authType and socialId, and instead define individual fields for social logins
  @Prop({ default: null })
  facebookId: string; // May register or connect to the account later

  @Prop({ default: null })
  googleId: string; // May register or connect to the account later

  @Prop({ default: null })
  appleId: string; // May register or connect to the account later

  @Prop({ default: null })
  gender: string;

  @Prop({ default: null })
  country: string;

  @Prop({ default: null })
  location: string;

  @Prop({ default: '' })
  occupation: string;

  @Prop({ default: [], type: [String] })
  tags: string[];

  @Prop({ default: null }) // Year 4 digits
  yearStart: string;

  @Prop({ default: null })
  avgScore: number;

  @Prop({ default: null, type: [String] })
  favoriteCourses: string[];

  @Prop({ default: null })
  countHoleInOne: number;

  @Prop({ default: null })
  bestScore: number;

  @Prop({ default: '' })
  clubBrands: string;

  @Prop({ default: '' })
  introduction: string;

  @Prop({ default: null })
  profileImage: string;

  @Prop({ default: true })
  isInviteAble: boolean;

  @Prop({ default: false })
  isActived: boolean;

  @Prop({ default: false })
  isRegistered: boolean;

  @Prop({ default: null })
  activedAt: Date;
}

export const MemberSchema = SchemaFactory.createForClass(Member);

MemberSchema.pre('save', function (next) {
  const user = this as Member;
  if (!user.isModified('password')) return next();
  user.previousPassword = user.password;
  next();
});
