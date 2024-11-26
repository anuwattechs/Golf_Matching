import { v4 as uuidv4 } from 'uuid';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'PostReplyComments',
  timestamps: true,
  versionKey: false,
})
export class PostReplyComment extends Document {
  @Prop({
    type: String,
    default: uuidv4,
  })
  _id: string;

  @Prop({ required: true, type: String })
  postId: string;

  @Prop({ required: true, type: String })
  commentId: string;

  @Prop({ default: null, type: String })
  reply: string;

  @Prop({ default: [], type: [String] })
  references: string[]; // Array of memberId

  @Prop({ default: [], type: [String] })
  likes: string[]; // Array of memberId

  @Prop({ required: true, type: String })
  createdBy: string;
}

export const PostReplyCommentSchema =
  SchemaFactory.createForClass(PostReplyComment);
