import { AuthTypeEnum, VerifyTypeEnum } from 'src/shared/enums';

export class CreateVerificationCodeDto {
  username: string;
  authType: AuthTypeEnum;
  type: VerifyTypeEnum;
  verifyCode: string;
}

// export class VerifyCodeDto {
//   verifyId: string;
//   verifyCode: string;
// }
