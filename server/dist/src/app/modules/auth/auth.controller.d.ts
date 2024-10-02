import { AuthService } from './auth.service';
import { VerificationRegisterDto, VerifyOtpDto, RegisterDto, LoginDto, ChangePasswordDto } from './dto';
import { Request } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    createVerificationRegister(body: VerificationRegisterDto): Promise<unknown>;
    verifyOtpRegister(body: VerifyOtpDto): Promise<unknown>;
    register(body: RegisterDto): Promise<unknown>;
    login(body: LoginDto): Promise<import("../../../shared/types").LoginResponseType[]>;
    changePassword(req: Request, body: ChangePasswordDto): Promise<Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>>;
}
