import { v4 as uuidv4 } from 'uuid';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'GalleryReplyComments',
  timestamps: true,
  versionKey: false,
})
export class GalleryReplyComment extends Document {
  @Prop({
    type: String,
    default: uuidv4,
  })
  _id: string;

  @Prop({ required: true, type: String })
  galleryId: string;

  @Prop({ required: true, type: String })
  commentId: string;

  @Prop({ default: null, type: String })
  message: string;

  @Prop({ required: true, type: String })
  createdBy: string;
}

export const GalleryReplyCommentSchema =
  SchemaFactory.createForClass(GalleryReplyComment);
