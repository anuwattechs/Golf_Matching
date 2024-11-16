import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  FriendInteractionActionEnum,
  FriendStatusEnum,
} from 'src/shared/enums'; // Assuming these enums are correctly defined in your project
import { v4 as uuidv4 } from 'uuid';

@Schema({ collection: 'Friends', timestamps: true, versionKey: false })
export class Friends extends Document {
  @Prop({
    type: String,
    default: uuidv4,
  })
  _id: string;

  @Prop({ required: true, type: String })
  memberId: string; // User ID of the person sending the friend request

  @Prop({ required: true, type: String })
  friendId: string; // User ID of the person receiving the friend request

  @Prop({
    required: true,
    type: String,
    enum: [
      FriendStatusEnum.BLOCKED,
      FriendStatusEnum.REMOVED,
      FriendStatusEnum.FOLLOWING,
      FriendStatusEnum.FOLLOWED,
    ],
  })
  status: string;

  @Prop({
    type: [
      {
        action: {
          type: String,
          enum: Object.values(FriendInteractionActionEnum),
          required: true,
        },
        date: { type: Date, required: true },
      },
    ],
    default: [],
  })
  interactionHistory: { action: FriendInteractionActionEnum; date: Date }[]; // Interaction history
}

export const FriendsSchema = SchemaFactory.createForClass(Friends);
