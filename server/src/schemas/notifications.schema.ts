import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({
  collection: 'Notifications',
  timestamps: true,
  versionKey: false,
})
export class Notifications extends Document {
  @Prop({
    type: String,
    default: uuidv4,
  })
  _id: string;

  @Prop({ required: true, type: String })
  memberId: string;

  @Prop({ required: true, type: String })
  type: string;

  @Prop({ required: true, type: String })
  message: string;

  @Prop({ required: true, type: Object })
  metadata: object;

  @Prop({ required: true, type: Boolean })
  isRead: boolean;
}

export const notificationsSchema = SchemaFactory.createForClass(Notifications);
notificationsSchema.index({ memberId: 1, type: 1, isRead: 1 });
export const NotificationsSchema = notificationsSchema;
