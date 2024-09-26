import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ResetPasswordDto {
  @IsUUID()
  @IsNotEmpty()
  transaction_id: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
