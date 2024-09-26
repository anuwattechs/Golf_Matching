import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// export type UserDocument = User & Document;

@Schema({ collection: 'Users', versionKey: false })
export class User extends Document {
  @Prop({
    type: String, // Define the type of _id as String for UUID
    default: uuidv4, // Set UUID as the default value for _id
  })
  _id: string;

  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ default: null })
  nick_name: string;

  @Prop({ required: true })
  date_of_birth: string;

  @Prop({ required: true, unique: true })
  // @Prop({ required: true })
  email: string;

  // @Prop({ required: true, unique: true })
  // @Prop({ required: true })
  @Prop({ default: null })
  phone_number: string;

  @Prop({ required: true })
  password: string;

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
  started_golf: number;

  @Prop({ default: null })
  avg_score: number;

  @Prop({ default: null })
  favorite_course: string;

  @Prop({ default: null })
  holes_in_one: number;

  @Prop({ default: null })
  best_score: number;

  @Prop({ default: '' })
  clubs: string;

  @Prop({ default: '' })
  introduction: string;

  @Prop({ default: true })
  is_invited: boolean;

  @Prop({ default: false })
  is_actived: boolean;

  @Prop({ default: null })
  actived_at: Date;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
