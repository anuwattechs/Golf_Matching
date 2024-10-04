import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({ collection: 'GolfCourses', timestamps: true, versionKey: false })
export class GolfCourse extends Document {
  @Prop({
    type: String, // Define the type of _id as String for UUID
    default: uuidv4, // Set UUID as the default value for _id
  })
  _id: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ default: [], type: [String] })
  gallery: string[];
}

export const GolfCourseSchema = SchemaFactory.createForClass(GolfCourse);
