import { AuthTypeEnum } from 'src/shared/enums';

export class CreateVerificationRegistrationDto {
  username: string;
  authType: AuthTypeEnum;
  verifyCode: string;
}

export class UpdateOneVerificationRegistrationDto {
  username: string;
  verifyCode: string;
  isVerified: boolean;
  sentCount: number;
}
