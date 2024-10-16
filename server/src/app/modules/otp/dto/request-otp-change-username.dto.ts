import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { VerifyTypeEnum } from 'src/shared/enums';

export class RequestOtpChangeUsernameDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEnum(VerifyTypeEnum)
  type: VerifyTypeEnum;
}
