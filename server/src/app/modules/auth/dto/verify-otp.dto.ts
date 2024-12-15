import { IsNotEmpty, IsString /*, IsEnum*/, Matches } from 'class-validator';
// import { AuthTypeEnum } from 'src/shared/enums';

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  email: string; //! Email or Phone

  // @IsString()
  // @IsNotEmpty()
  // @IsEnum(AuthTypeEnum)
  // provider: AuthTypeEnum;

  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'Code must be exactly 6 digits' })
  verifyCode: string;
}
