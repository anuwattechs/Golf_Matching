import { AuthService } from './auth.service';
import { VerificationRegisterDto } from './dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    createVerificationRegister(body: VerificationRegisterDto): Promise<unknown>;
}
