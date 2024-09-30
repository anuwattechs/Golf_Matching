import { Controller } from '@nestjs/common';
import { AuthAppleService } from './auth-apple.service';

@Controller('auth-apple')
export class AuthAppleController {
  constructor(private readonly authAppleService: AuthAppleService) {}
}
