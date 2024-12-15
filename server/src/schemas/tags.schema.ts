import { v4 as uuidv4 } from 'uuid';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'Tags',
  timestamps: true,
  versionKey: false,
})
export class Tag extends Document {
  @Prop({
    type: String,
    default: uuidv4,
  })
  _id: string;

  @Prop({ required: true, type: String })
  tagName: string;

  @Prop({ required: true, type: String })
  etag: string;

  @Prop({ required: true, type: String })
  key: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
