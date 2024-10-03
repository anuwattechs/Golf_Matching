import { AuthTypeEnum } from 'src/shared/enums';

export class CreateVerificationResetPasswordDto {
  userId: string;
  email: string;
  provider: AuthTypeEnum;
  verifyCode: string;
}
