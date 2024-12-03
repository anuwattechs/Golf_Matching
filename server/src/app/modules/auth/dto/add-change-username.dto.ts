import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddChangeUsernameDto {
  @IsUUID()
  @IsNotEmpty()
  verifyId: string;
}
