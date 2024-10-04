import { AuthTypeEnum } from 'src/shared/enums';

export class CreateVerificationResetPasswordDto {
  userId: string;
  username: string;
  authType: AuthTypeEnum;
  verifyCode: string;
}
