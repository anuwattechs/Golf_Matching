import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({
  collection: 'GolfCoursesLayouts',
  timestamps: true,
  versionKey: false,
})
export class GolfCoursesLayouts extends Document {
  @Prop({
    type: String,
    default: uuidv4,
  })
  _id: string;

  @Prop({ required: true, type: String })
  golfCourseId: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: Array })
  holes: Array<{
    hole: string;
    par: number;
    yardage: number;
  }>;
}

export const GolfCoursesLayoutsSchema =
  SchemaFactory.createForClass(GolfCoursesLayouts);
