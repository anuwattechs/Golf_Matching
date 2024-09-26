import { IsNotEmpty, Matches, IsUUID } from 'class-validator';

export class ConfirmOtpResetPasswordDto {
  @IsUUID()
  @IsNotEmpty()
  transaction_id: string;

  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'Code must be exactly 6 digits' })
  verify_code: string;
}
