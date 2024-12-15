import { Type } from "class-transformer";
import {
  IsBoolean,
  ValidateNested,
  IsObject,
  IsOptional,
} from "class-validator";

class NotificationSettingsDto {
  @IsBoolean()
  @IsOptional()
  activities: boolean;

  @IsBoolean()
  @IsOptional()
  reminders: boolean;

  @IsBoolean()
  @IsOptional()
  messages: boolean;

  @IsBoolean()
  @IsOptional()
  hideProfile: boolean;

  @IsBoolean()
  @IsOptional()
  allowOthersToFollow: boolean;

  @IsBoolean()
  @IsOptional()
  privateAccount: boolean;
}

export class UpdateMemberSettingsDto {
  @IsObject()
  @ValidateNested()
  @Type(() => NotificationSettingsDto)
  preferences: NotificationSettingsDto;
}
