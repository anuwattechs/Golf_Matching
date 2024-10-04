import { IsUUID, Matches, IsNotEmpty } from 'class-validator';

export class VerifyOtpDto {
  @IsUUID()
  @IsNotEmpty()
  verifyId: string;

  @Matches(/^[0-9]{6}$/, { message: 'Invalid OTP' })
  @IsNotEmpty()
  verifyCode: string;
}
