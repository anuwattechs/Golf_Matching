<<<<<<< HEAD
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private usersService;
    constructor(usersService: UsersService);
    register(createUserDto: CreateUserDto): Promise<void>;
=======
import { ResponseType } from 'src/shared/types';
import { VerificationRegisterDto, VerifyOptDto, RegisterDto } from './dto';
import { MemberModel, VerificationRegistrationModel, VerificationResetPasswordModel } from 'src/schemas/models';
import { Utils } from 'src/shared/utils/utils';
export declare class AuthService {
    private utils;
    private memberModel;
    private verificationRegistrationModel;
    private verificationResetPasswordModel;
    constructor(utils: Utils, memberModel: MemberModel, verificationRegistrationModel: VerificationRegistrationModel, verificationResetPasswordModel: VerificationResetPasswordModel);
    createVerificationRegister(input: VerificationRegisterDto): Promise<ResponseType<any[]>>;
    verifyRegister(input: VerifyOptDto): Promise<ResponseType<any[]>>;
    register(input: RegisterDto): Promise<ResponseType<any[]>>;
    updateProfile(input: UpdatePersonalInfoDto, decoded: TJwtPayload): Promise<TServiceResponse>;
    login(input: LoginDto): Promise<TServiceResponse>;
    changePassword(input: ChangePasswordDto, decoded: TJwtPayload): Promise<TServiceResponse>;
    changeInviteMode(input: ChangeInviteModeDto, decoded: TJwtPayload): Promise<TServiceResponse>;
    findOneProsonalInfo(decoded: TJwtPayload): Promise<TServiceResponse>;
    createIndentityVerifyResetPassword(input: IdentityVerifyDto): Promise<TServiceResponse>;
    identityResetPasswordConfirm(input: ConfirmOtpResetPasswordDto): Promise<TServiceResponse>;
    resetPassword(input: ResetPasswordDto): Promise<TServiceResponse>;
>>>>>>> a768db95c667773a296a2e5a7ac9eee2a815d013
}
