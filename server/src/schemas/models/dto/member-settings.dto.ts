import { Type } from 'class-transformer';
import { IsBoolean, ValidateNested, IsObject } from 'class-validator';

class NotificationSettingsDto {
  @IsBoolean()
  activities: boolean;

  @IsBoolean()
  reminders: boolean;

  @IsBoolean()
  messages: boolean;

  @IsBoolean()
  hideProfile: boolean;

  @IsBoolean()
  allowOthersToFollow: boolean;
}

export class UpdateMemberSettingsDto {
  @IsObject()
  @ValidateNested()
  @Type(() => NotificationSettingsDto)
  preferences: NotificationSettingsDto;
}
