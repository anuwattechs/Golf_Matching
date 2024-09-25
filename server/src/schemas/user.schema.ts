import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'Users', versionKey: false })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  // @Prop({ required: true, unique: true })
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  username: string;

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
