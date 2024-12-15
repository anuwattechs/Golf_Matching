import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({
  collection: 'Scores',
  timestamps: true,
  versionKey: false,
})
export class Scores extends Document {
  @Prop({
    type: String,
    default: uuidv4,
  })
  _id: string;

  @Prop({ required: true, type: String })
  matchId: string;

  @Prop({ required: true, type: String })
  golfCourseLayoutId: string;

  @Prop({ required: true, type: String })
  playerId: string;

  @Prop({ required: true, type: Number })
  hole: number;

  @Prop({ required: true, type: Number })
  strokes: number;

  @Prop({ required: true, type: Number })
  putts: number;

  @Prop({ required: true, type: Number })
  chipIns: number;

  @Prop({ required: true, type: Array })
  caddieIds: string[]; // Array of caddie ids that helped the player on this hole
}

export const ScoresSchema = SchemaFactory.createForClass(Scores);
