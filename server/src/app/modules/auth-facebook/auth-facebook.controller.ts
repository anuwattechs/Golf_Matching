import { Controller } from '@nestjs/common';
import { AuthFacebookService } from './auth-facebook.service';

@Controller('auth-facebook')
export class AuthFacebookController {
  constructor(private readonly authFacebookService: AuthFacebookService) {}
}
