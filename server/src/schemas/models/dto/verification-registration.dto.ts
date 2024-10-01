import { AuthProvidersEnum } from 'src/shared/enums';

export class CreateVerificationRegistrationDto {
  email: string;
  provider: AuthProvidersEnum;
  verifyCode: string;
}

export class UpdateOneVerificationRegistrationDto {
  email: string;
  verifyCode: string;
  isVerified: boolean;
  sentCount: number;
}
