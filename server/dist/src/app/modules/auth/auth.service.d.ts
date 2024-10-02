import { LoginResponseType, NullableType } from 'src/shared/types';
import { SocialInterface } from 'src/shared/interfaces';
import { VerificationRegisterDto, VerifyOtpDto, RegisterDto, LoginDto, ChangePasswordDto } from './dto';
import { MemberModel, VerificationRegistrationModel, VerificationResetPasswordModel } from 'src/schemas/models';
import { UtilsService } from 'src/shared/utils/utils.service';
import { JwtService } from '@nestjs/jwt';
import { AuthProvidersEnum } from 'src/shared/enums';
import { JwtPayloadType } from './strategy/jwt-payload.type';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/app/config/config.type';
import { MailService } from '../mail/mail.service';
export declare class AuthService {
    private readonly utilsService;
    private readonly memberModel;
    private readonly verificationRegistrationModel;
    private readonly verificationResetPasswordModel;
    private readonly jwtService;
    private readonly mailService;
    private readonly configService;
    constructor(utilsService: UtilsService, memberModel: MemberModel, verificationRegistrationModel: VerificationRegistrationModel, verificationResetPasswordModel: VerificationResetPasswordModel, jwtService: JwtService, mailService: MailService, configService: ConfigService<AllConfigType>);
    private generateToken;
    private convertTimeStringToMs;
    validateSocialLogin(authProvider: AuthProvidersEnum, socialData: SocialInterface): Promise<LoginResponseType[]>;
    createVerificationRegister(input: VerificationRegisterDto): Promise<NullableType<unknown>>;
    verifyOtpRegister(input: VerifyOtpDto): Promise<NullableType<unknown>>;
    register(input: RegisterDto): Promise<NullableType<unknown>>;
    login(input: LoginDto): Promise<LoginResponseType[]>;
    changePassword(input: ChangePasswordDto, decoded: JwtPayloadType): Promise<NullableType<unknown>>;
}
