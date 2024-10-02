import { AuthService } from './auth.service';
import { VerificationRegisterDto, VerifyOtpDto, RegisterDto, LoginDto, ChangePasswordDto } from './dto';
import { Request } from 'express';
import { JwtPayloadType } from './strategy/jwt-payload.type';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    createVerificationRegister(body: VerificationRegisterDto): Promise<unknown>;
    verifyOtpRegister(body: VerifyOtpDto): Promise<unknown>;
    register(body: RegisterDto): Promise<unknown>;
    login(body: LoginDto): Promise<import("../../../shared/types").LoginResponseType[]>;
    changePassword(body: ChangePasswordDto, req: Request & {
        decoded: JwtPayloadType;
    }): Promise<unknown>;
    test1(req: Request & {
        decoded: JwtPayloadType;
    }): Promise<JwtPayloadType>;
}
