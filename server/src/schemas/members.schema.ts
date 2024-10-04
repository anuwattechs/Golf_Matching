import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AuthTypeEnum } from 'src/shared/enums';
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

  @Prop() //! Email, Phone, Social
  username: string | null;

  @Prop({ nullable: true })
  // @Exclude({ toPlainOnly: true })
  password: string;

  @Exclude({ toPlainOnly: true })
  previousPassword?: string;

  loadPreviousPassword() {
    this.previousPassword = this.password;
  }

  @Prop({ default: AuthTypeEnum.EMAIL })
  authType: AuthTypeEnum;

  @Prop({ nullable: true, type: String })
  socialId: string | null;

  @Prop({ default: null })
  // @Prop({ required: true })
  gender: string;

  @Prop({ default: null })
  // @Prop({ required: true })
  country: string;

  @Prop({ default: null })
  // @Prop({ required: true })
  location: string;

  @Prop({ default: '' })
  occupation: string;

  @Prop({ default: [], type: [String] })
  tags: string[];

  @Prop({ default: null }) //! Year 4 digits
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
