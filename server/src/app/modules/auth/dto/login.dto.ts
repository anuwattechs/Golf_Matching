import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string; //! Email or Phone

  @IsString()
  @IsNotEmpty()
  password: string;
}
