import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class ResetPasswordDto {
  @IsMongoId()
  @IsNotEmpty()
  forgot_pass_id: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
