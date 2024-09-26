import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type ActionLoggingDocument = ActionLogging & Document;

@Schema({ collection: 'ActionLogging', versionKey: false })
export class ActionLogging extends Document {
  @Prop({
    type: String, // Define the type of _id as String for UUID
    default: uuidv4, // Set UUID as the default value for _id
  })
  _id: string;

  @Prop({ required: true })
  action_description: string;

  @Prop({ default: null })
  end_point: string;

  @Prop({ required: true })
  creator_id: string;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const ActionLoggingSchema = SchemaFactory.createForClass(ActionLogging);
