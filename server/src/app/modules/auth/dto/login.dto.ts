import { IsNotEmpty, IsString , IsEnum } from 'class-validator';
import { AuthProvidersEnum } from 'src/shared/enums';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  email: string; //! Email or Phone

  @IsString()
  @IsNotEmpty()
  @IsEnum(AuthProvidersEnum)
  provider: AuthProvidersEnum;

  @IsString()
  @IsNotEmpty()
  password: string;
}
