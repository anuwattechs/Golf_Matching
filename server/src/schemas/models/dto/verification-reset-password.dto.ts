import { AuthProvidersEnum } from 'src/shared/enums';

export class CreateVerificationResetPasswordDto {
  memberId: string;
  email: string;
  provider: AuthProvidersEnum;
  verifyCode: string;
}
