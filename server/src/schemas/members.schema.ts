import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AuthProvidersEnum } from 'src/shared/enums';
import { Exclude } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';

@Schema({ collection: 'Members', timestamps: true })
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
  dateOfBirth: string;

  @Prop({ unique: true, required: true, type: String }) //! Email, Phone, Social
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

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  location: string;

  @Prop({ default: '' })
  occupation: string;

  @Prop({ default: [], type: [String] })
  lifestyle: string[];

  @Prop({ default: null }) //! Year 4 digits
  startedGolf: number;

  @Prop({ default: null })
  avgScore: number;

  @Prop({ default: null })
  favoriteCourse: string;

  @Prop({ default: null })
  holesInOne: number;

  @Prop({ default: null })
  bestScore: number;

  @Prop({ default: '' })
  clubs: string;

  @Prop({ default: '' })
  introduction: string;

  @Prop({ default: true })
  isInvited: boolean;

  @Prop({ default: false })
  isActived: boolean;

  @Prop({ default: null })
  activedAt: Date;

  // @Prop({ nullable: true, type: String })
  // phone: string | null;

  // @Prop({ default: Date.now })
  // lastLogin: Date;

  // @Prop({default: Date.now})
  // createdAt: Date;

  // @Prop({default: Date.now})
  // updatedAt: Date;m

  // @Prop({ nullable: true })
  // deletedAt: Date | null;
}

export const MemberSchema = SchemaFactory.createForClass(Member);

MemberSchema.pre('save', function (next) {
  const user = this as Member;
  if (!user.isModified('password')) return next();
  user.previousPassword = user.password;
  next();
});
