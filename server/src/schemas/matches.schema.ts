import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { GenderEnum } from "src/shared/enums";
import { v4 as uuidv4 } from "uuid";

@Schema({ collection: "Matches", timestamps: true, versionKey: false })
export class Matches extends Document {
  @Prop({
    type: String,
    default: uuidv4,
  })
  _id: string;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ type: String })
  description: string;

  @Prop({ required: true, type: String })
  courseId: string;

  @Prop({ required: false, type: String })
  discussionId: string; // for chat and comments on the match

  @Prop({ required: true, type: Date })
  datetime: Date;

  @Prop({
    required: true,
    type: String,
    enum: ["9HOLES", "18HOLES"],
    default: "9HOLES",
  })
  holeType: string;

  @Prop({ required: true, type: String, enum: ["SOLO", "GROUP"] })
  matchesType: string;

  @Prop({ type: String })
  coverImageUrl: string;

  @Prop({ type: Number })
  costPerPerson: number;

  @Prop({ type: String })
  handicap: string;

  @Prop({ type: Number })
  avgScore: number;

  @Prop({
    type: String,
    enum: ["NS", "YES", "NO"],
    default: "NS",
  })
  useGolfCart: string;

  @Prop({ type: Number })
  maxPlayers: number;

  @Prop({ required: true, type: String })
  createdBy: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: null, type: String })
  gender: GenderEnum | null;
}

export const MatchesSchema = SchemaFactory.createForClass(Matches);
