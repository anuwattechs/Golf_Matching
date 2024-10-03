import { AuthProvidersEnum } from 'src/shared/enums';

export class CreateVerificationResetPasswordDto {
  userId: string;
  email: string;
  provider: AuthProvidersEnum;
  verifyCode: string;
}
