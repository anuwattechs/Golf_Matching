import { IsNotEmpty } from "class-validator";

export class AuthAppleLoginDto {
  @IsNotEmpty()
  idToken: string;
}
