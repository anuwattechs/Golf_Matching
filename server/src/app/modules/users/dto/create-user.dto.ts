import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string | null;

  @MinLength(6)
  password?: string;

  provider?: string;

  socialId?: string | null;

  @IsNotEmpty()
  firstName: string | null;

  @IsNotEmpty()
  lastName: string | null;
}
