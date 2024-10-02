import { AuthService } from './auth.service';
import { VerificationRegisterDto, VerifyOtpDto, VerifyOtpResetPasswordDto, RegisterDto, LoginDto, ChangePasswordDto, ResetPasswordDto } from './dto';
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
    createVerificationResetPassword(body: VerificationRegisterDto): Promise<unknown>;
    verifyOtpResetPassword(body: VerifyOtpResetPasswordDto): Promise<unknown>;
    resetPassword(body: ResetPasswordDto): Promise<unknown>;
}
