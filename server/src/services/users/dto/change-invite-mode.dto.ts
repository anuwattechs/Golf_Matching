import { IsNotEmpty, IsBoolean } from 'class-validator';

export class ChangeInviteModeDto {
  @IsBoolean()
  @IsNotEmpty()
  is_invited: boolean;
}
