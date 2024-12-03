import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateCustomUserIdDto {
  @IsString()
  @IsNotEmpty()
  customUserId: string;
}
