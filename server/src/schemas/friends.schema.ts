import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FriendStatusEnum } from 'src/shared/enums'; // Assuming enums are defined correctly
import { v4 as uuidv4 } from 'uuid';

@Schema({
  collection: 'Friends',
  timestamps: true,
  versionKey: false,
})
export class Friends extends Document {
  // Unique ID for the friend request
  @Prop({
    type: String,
    default: uuidv4,
  })
  _id: string;

  // ID of the user who initiated the friend request (sender)
  @Prop({
    required: true,
    type: String,
    index: true,
  })
  senderId: string;

  // ID of the user who is the target of the friend request (receiver)
  @Prop({
    required: true,
    type: String,
    index: true,
  })
  receiverId: string;

  // Status of the friendship (e.g., FOLLOWING, FOLLOWED, BLOCKED)
  @Prop({
    required: true,
    type: String,
    enum: Object.values(FriendStatusEnum),
    default: FriendStatusEnum.FOLLOWING,
  })
  status: FriendStatusEnum;
}

// Create a unique index to prevent duplicate friend relationships
const friendsSchema = SchemaFactory.createForClass(Friends);
friendsSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

export const FriendsSchema = friendsSchema;
