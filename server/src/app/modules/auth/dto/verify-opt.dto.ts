import { IsNotEmpty, IsString /*, IsEnum*/, Matches } from 'class-validator';
// import { AuthProvidersEnum } from 'src/shared/enums';

export class VerifyOptDto {
  @IsString()
  @IsNotEmpty()
  email: string; //! Email or Phone

  // @IsString()
  // @IsNotEmpty()
  // @IsEnum(AuthProvidersEnum)
  // provider: AuthProvidersEnum;

  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'Code must be exactly 6 digits' })
  verifyCode: string;
}
