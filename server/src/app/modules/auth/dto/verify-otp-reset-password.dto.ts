import { IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator';
// import { AuthProvidersEnum } from 'src/shared/enums';

export class VerifyOtpResetPasswordDto {
  @IsUUID()
  @IsNotEmpty()
  transactionId: string; //! Email or Phone

  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'Code must be exactly 6 digits' })
  verifyCode: string;
}
