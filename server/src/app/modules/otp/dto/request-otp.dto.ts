import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { AuthTypeEnum, VerifyTypeEnum } from 'src/shared/enums';

export class RequestOtpDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEnum(AuthTypeEnum)
  authType: AuthTypeEnum;

  @IsNotEmpty()
  @IsEnum(VerifyTypeEnum)
  type: VerifyTypeEnum;
}
