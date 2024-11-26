import { v4 as uuidv4 } from 'uuid';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PostDisplayEnum, MediaTypeEnum } from 'src/shared/enums';

@Schema({ _id: false })
export class Media {
  @Prop({ required: true, type: String })
  etag: string;

  @Prop({ required: true, type: String })
  key: string;

  @Prop({ required: true, type: String })
  type: MediaTypeEnum;
}

@Schema({
  collection: 'Posts',
  timestamps: true,
  versionKey: false,
})
export class Post extends Document {
  @Prop({
    type: String,
    default: uuidv4,
  })
  _id: string;

  @Prop({ required: true, type: String })
  memberId: string;

  @Prop({ default: '', type: String })
  caption: string;

  @Prop({ default: [], type: [Media] })
  media: Array<Media>;

  @Prop({ default: [], type: [String] })
  tags: string[]; // Array of hashtags

  @Prop({ default: [], type: [String] })
  likes: string[]; // Array of memberId

  //! Comments

  @Prop({ default: false, type: Boolean })
  isPinned: boolean;

  @Prop({ default: null, type: Date })
  pinnedAt: Date;

  @Prop({ default: PostDisplayEnum.PRIVATE, type: String })
  display: PostDisplayEnum;
}

export const PostSchema = SchemaFactory.createForClass(Post);
