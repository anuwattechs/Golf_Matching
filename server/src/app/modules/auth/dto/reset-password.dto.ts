import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ResetPasswordDto {
  @IsUUID()
  @IsNotEmpty()
  transactionId: string; //! Email or Phone

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
