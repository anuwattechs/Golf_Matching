import { AuthService } from './auth.service';
import { VerificationRegisterDto, VerifyOtpDto, RegisterDto, LoginDto } from './dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    createVerificationRegister(body: VerificationRegisterDto): Promise<unknown>;
    verifyOtpRegister(body: VerifyOtpDto): Promise<unknown>;
    register(body: RegisterDto): Promise<unknown>;
    login(body: LoginDto): Promise<import("../../../shared/types").LoginResponseType[]>;
}
