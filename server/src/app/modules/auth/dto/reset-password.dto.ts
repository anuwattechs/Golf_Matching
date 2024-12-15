import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ResetPasswordDto {
  @IsUUID()
  @IsNotEmpty()
  verifyId: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
