import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { AuthTypeEnum } from 'src/shared/enums';

export class VerificationRegisterDto {
  @IsString()
  @IsNotEmpty()
  email: string; //! Email or Phone

  @IsString()
  @IsNotEmpty()
  @IsEnum(AuthTypeEnum)
  provider: AuthTypeEnum;
}
