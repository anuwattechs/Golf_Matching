export class LoginResponseDto {
  token: string;
  refreshToken: string;
  tokenExpires: number;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}
