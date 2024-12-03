import { VerifyTypeEnum, VerifyTypeAuthEnum } from 'src/shared/enums';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

type VerifyType = VerifyTypeEnum | VerifyTypeAuthEnum;

export class CreateVerificationCodeDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  verifyType: VerifyType;

  @IsString()
  @IsNotEmpty()
  verifyCode: string;

  @IsString()
  @IsOptional()
  memberId: string;
}

// export class VerifyCodeDto {
//   verifyId: string;
//   verifyCode: string;
// }
