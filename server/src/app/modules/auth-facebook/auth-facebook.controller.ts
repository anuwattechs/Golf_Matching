import { Controller, HttpException } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { Body, Post } from "@nestjs/common";
import { ResponseMessage } from "src/app/common/decorator/response-message.decorator";
import { AuthFacebookService } from "./auth-facebook.service";
import { AuthFacebookLoginDto } from "./dto/auth-facebook-login.dto";
import { LoginResponseDto } from "../auth-google/dto/login-response.dto";
import { AuthProvidersEnum } from "src/shared/enums";

@Controller({
  path: "auth/facebook",
})
export class AuthFacebookController {
  constructor(
    private readonly authService: AuthService,
    private readonly authFacebookService: AuthFacebookService
  ) {}

  @Post("login")
  @ResponseMessage("User logged in successfully")
  async login(
    @Body() loginDto: AuthFacebookLoginDto
  ): Promise<LoginResponseDto> {
    try {
      const socialData =
        await this.authFacebookService.getProfileByToken(loginDto);
      return this.authService.validateSocialLogin(
        AuthProvidersEnum.FACEBOOK,
        socialData
      );
    } catch (error) {
      throw new HttpException(
        {
          message: "Invalid token",
        },
        401
      );
    }
  }
}
