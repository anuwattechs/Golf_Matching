import { IsNotEmpty, IsMongoId, Matches } from 'class-validator';

export class VerifyForgotPasswordDto {
  @IsMongoId()
  @IsNotEmpty()
  forgot_pass_id: string;

  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'Code must be exactly 6 digits' })
  code: string;
}
