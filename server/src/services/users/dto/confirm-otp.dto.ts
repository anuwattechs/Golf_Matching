import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ConfirmOtpDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'Code must be exactly 6 digits' })
  verify_code: string;
}
