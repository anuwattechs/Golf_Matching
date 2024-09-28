import { Controller } from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';
import { Body } from '@nestjs/common';
import { AuthGoogleLoginDto } from './dto/auth-google-login.dto';

@Controller('auth/google')
export class AuthGoogleController {
  constructor(private readonly authGoogleService: AuthGoogleService) {}
  async login(@Body() loginDto: AuthGoogleLoginDto): Promise<any> {
    const socialProfile =
      await this.authGoogleService.getProfileByToken(loginDto);
    return socialProfile;
  }
}
