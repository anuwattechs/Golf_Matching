import { VerifyTypeEnum, VerifyTypeAuthEnum } from 'src/shared/enums';

export class CreateVerificationCodeDto {
  username: string;
  type: VerifyTypeEnum | VerifyTypeAuthEnum;
  verifyCode: string;
}

// export class VerifyCodeDto {
//   verifyId: string;
//   verifyCode: string;
// }
