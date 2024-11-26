import { v4 as uuidv4 } from 'uuid';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'PostComments',
  timestamps: true,
  versionKey: false,
})
export class PostComment extends Document {
  @Prop({
    type: String,
    default: uuidv4,
  })
  _id: string;

  @Prop({ required: true, type: String })
  postId: string;

  @Prop({ default: null, type: String })
  comment: string;

  @Prop({ required: true, type: String })
  reference: string; // Array of memberId

  @Prop({ default: [], type: [String] })
  likes: string[]; // Array of memberId

  @Prop({ required: true, type: String })
  createdBy: string;
}

export const PostCommentSchema = SchemaFactory.createForClass(PostComment);
