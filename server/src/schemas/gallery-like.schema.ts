import { v4 as uuidv4 } from 'uuid';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { LikeStatusEnum } from 'src/shared/enums';

@Schema({
  collection: 'GalleryLikes',
  timestamps: true,
  versionKey: false,
})
export class GalleryLike extends Document {
  @Prop({
    type: String,
    default: uuidv4,
  })
  _id: string;

  @Prop({ required: true, type: String })
  galleryId: string;

  @Prop({ default: LikeStatusEnum.LIKE, type: String })
  status: LikeStatusEnum;

  @Prop({ required: true, type: String })
  createdBy: string;
}

export const GalleryLikeSchema = SchemaFactory.createForClass(GalleryLike);
