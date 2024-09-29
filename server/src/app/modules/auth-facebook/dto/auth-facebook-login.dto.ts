import { IsNotEmpty } from "class-validator";

export class AuthFacebookLoginDto {
  @IsNotEmpty()
  accessToken: string;
}
