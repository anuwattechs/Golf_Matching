import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { VerifyTypeAuthEnum } from 'src/shared/enums';

export class RequestOtpAuthDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEnum(VerifyTypeAuthEnum)
  type: VerifyTypeAuthEnum;
}
