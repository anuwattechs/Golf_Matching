import { v4 as uuidv4 } from 'uuid';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'Gallery',
  timestamps: true,
  versionKey: false,
})
export class Gallery extends Document {
  @Prop({
    type: String,
    default: uuidv4,
  })
  _id: string;

  @Prop({ default: false, type: Boolean })
  isPinned: boolean;

  @Prop({ default: null, type: Date })
  pinned_at: Date;

  @Prop({ required: true, type: Boolean })
  isPublic: boolean;

  @Prop({ required: true, type: String })
  etag: string;

  @Prop({ required: true, type: String })
  key: string;

  @Prop({ required: true, type: String })
  createdBy: string;
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);
