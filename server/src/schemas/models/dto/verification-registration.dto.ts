import { AuthTypeEnum } from 'src/shared/enums';

export class CreateVerificationRegistrationDto {
  email: string;
  provider: AuthTypeEnum;
  verifyCode: string;
}

export class UpdateOneVerificationRegistrationDto {
  email: string;
  verifyCode: string;
  isVerified: boolean;
  sentCount: number;
}
