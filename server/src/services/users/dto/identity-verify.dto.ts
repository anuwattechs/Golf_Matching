import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class IdentityVerifyDto {
  @IsString()
  @IsNotEmpty()
  username: string; //! Email or Phone

  @IsString()
  @IsNotEmpty()
  @IsIn(['EMAIL', 'PHONE'])
  type: string;
}
