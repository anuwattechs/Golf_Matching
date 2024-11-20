import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({ collection: 'MatchPlayers', timestamps: true, versionKey: false })
export class MatchPlayer extends Document {
  @Prop({
    type: String,
    default: uuidv4,
  })
  _id: string;

  @Prop({ required: true, type: String })
  matchId: string;

  @Prop({ required: true, type: String })
  playerId: string;

  @Prop({ required: true, type: Boolean })
  isHost: boolean;

  @Prop({ required: true, type: Date })
  joinedAt: Date;

  @Prop({
    type: String,
    enum: ['LET_HOST', 'BOOK_THIS_CADDIE', 'PICK_AT_COURSE'],
    required: true,
  })
  caddieSelection: string;

  @Prop({ type: String, required: false })
  caddieId?: string;

  @Prop({ type: String })
  caddieInfo?: string;
}

export const MatchPlayerSchema = SchemaFactory.createForClass(MatchPlayer);
