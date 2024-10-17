import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { GenderEnum } from 'src/shared/enums';

@Schema({ collection: 'Members', timestamps: true, versionKey: false })
export class Member extends Document {
  @Prop({
    type: String, // Define the type of _id as String for UUID
    default: uuidv4, // Set UUID as the default value for _id
  })
  _id: string;

  @Prop({ required: true, type: String })
  firstName: string;

  @Prop({ required: false, type: String })
  lastName: string;

  @Prop({ default: null, type: String })
  nickName: string;

  @Prop({ default: null, type: String })
  birthDate: string;

  @Prop({ default: null, type: String })
  email: string; // Email may be updated later

  @Prop({ default: null, type: String })
  phoneNo: string; // Phone number may be updated later

  @Prop({ default: null, type: String })
  // @Exclude({ toPlainOnly: true })
  password: string;

  // Remove authType and socialId, and instead define individual fields for social logins
  @Prop({ default: null, type: String })
  facebookId: string; // May register or connect to the account later

  @Prop({ default: null, type: String })
  googleId: string; // May register or connect to the account later

  @Prop({ default: null, type: String })
  appleId: string; // May register or connect to the account later

  @Prop({ default: null, type: String })
  gender: GenderEnum;

  @Prop({ default: null, type: String })
  country: string;

  @Prop({ default: null, type: String })
  location: string;

  @Prop({ default: '', type: String })
  occupation: string;

  @Prop({ default: [], type: [String] })
  tags: string[];

  @Prop({ default: null, type: String }) // Year 4 digits
  yearStart: string;

  @Prop({ default: null, type: Number })
  avgScore: number;

  @Prop({ default: [], type: [String] })
  favoriteCourses: string[];

  @Prop({ default: null, type: Number })
  countHoleInOne: number;

  @Prop({ default: null, type: Number })
  bestScore: number;

  @Prop({ default: '', type: String })
  clubBrands: string;

  @Prop({ default: '', type: String })
  introduction: string;

  @Prop({ default: null, type: String })
  profileImage: string;

  @Prop({ default: true, type: Boolean })
  isInviteAble: boolean;

  @Prop({ default: false, type: Boolean })
  isActived: boolean;

  @Prop({ default: false, type: Boolean })
  isRegistered: boolean;

  @Prop({ default: null, type: Date })
  activedAt: Date;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
