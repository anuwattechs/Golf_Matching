import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

import { UpdateMemberSettingsDto } from "./models/dto";

@Schema({ collection: "MemberSettings", timestamps: true, versionKey: false })
export class MemberSettings extends Document {
  @Prop({
    type: String,
    default: uuidv4,
  })
  _id: string;

  @Prop({ required: true })
  memberId: string;

  @Prop({
    type: Object,
    default: {
      activities: true,
      reminders: true,
      messages: true,
      hideProfile: false,
      allowOthersToFollow: true,
      privateAccount: false,
    },
  })
  preferences: UpdateMemberSettingsDto;
}

export const MemberSettingsSchema =
  SchemaFactory.createForClass(MemberSettings);
