import { Controller } from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';

@Controller('auth-google')
export class AuthGoogleController {
  constructor(private readonly authGoogleService: AuthGoogleService) {}
}
