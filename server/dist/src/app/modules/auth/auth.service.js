"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const models_1 = require("../../../schemas/models");
const utils_service_1 = require("../../../shared/utils/utils.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    constructor(utilsService, memberModel, verificationRegistrationModel, verificationResetPasswordModel, jwtService, configService) {
        this.utilsService = utilsService;
        this.memberModel = memberModel;
        this.verificationRegistrationModel = verificationRegistrationModel;
        this.verificationResetPasswordModel = verificationResetPasswordModel;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    generateToken(payload) {
        return this.jwtService.sign(payload);
    }
    validateToken(token) {
        return this.jwtService.verify(token);
    }
    convertTimeStringToMs(timeString) {
        const unit = timeString.at(-1);
        const value = Number(timeString.slice(0, -1));
        if (isNaN(value))
            return 0;
        return unit == 'h' ? value * 3.6e6 : unit == 'd' ? value * 24 * 3.6e6 : 0;
    }
    async validateSocialLogin(authProvider, socialData) {
        try {
            const userRegistered = await this.memberModel.findAllByEmailOrPhone(socialData?.email?.toLowerCase());
            if (userRegistered.length > 0)
                throw new common_1.HttpException('User registered', common_1.HttpStatus.BAD_REQUEST);
            const created = await this.memberModel.createBySocial({
                socialId: socialData.id,
                firstName: socialData.firstName,
                lastName: socialData.lastName,
                email: socialData?.email?.toLowerCase(),
                provider: authProvider,
            });
            const accessToken = this.generateToken({
                userId: created._id,
                email: socialData?.email?.toLowerCase(),
                firstName: socialData?.firstName,
                lastName: socialData?.lastName,
            });
            const jwtExpiresIn = this.configService.get('auth.jwtExpiresIn', {
                infer: true,
            });
            return [
                {
                    accessToken,
                    refreshToken: this.configService.get('auth.refreshSecret', {
                        infer: true,
                    }),
                    accessTokenExpiresIn: this.convertTimeStringToMs(jwtExpiresIn),
                },
            ];
        }
        catch (error) {
            throw new common_1.HttpException({
                status: false,
                statusCode: error.status,
                message: error.message,
                data: null,
            }, error.status);
        }
    }
    async createVerificationRegister(input) {
        try {
            const userRegistered = await this.memberModel.findAllByEmailOrPhone(input.email);
            if (userRegistered.length > 0)
                throw new common_1.HttpException('User already registered', common_1.HttpStatus.BAD_REQUEST);
            const user = await this.verificationRegistrationModel.findOneByEmailOrPhone(input.email.toLowerCase());
            const verifyCode = this.utilsService.generateRandomNumber(6);
            if (!user) {
                await this.verificationRegistrationModel.create({
                    email: input.email.toLowerCase(),
                    provider: input.provider,
                    verifyCode,
                });
            }
            else {
                await this.verificationRegistrationModel.updateOne({
                    email: input.email.toLowerCase(),
                    verifyCode,
                    isVerified: false,
                    sentCount: user.sentCount + 1,
                });
            }
            return [{ verifyCode }];
        }
        catch (error) {
            throw new common_1.HttpException({
                status: false,
                statusCode: error.status,
                message: error.message,
                data: null,
            }, error.status);
        }
    }
    async verifyOtpRegister(input) {
        try {
            const userRegistered = await this.verificationRegistrationModel.findOneByEmailOrPhone(input.email.toLowerCase());
            if (!userRegistered)
                throw new common_1.HttpException('User not registered', common_1.HttpStatus.BAD_REQUEST);
            if (userRegistered.verifyCode !== input.verifyCode)
                throw new common_1.HttpException('Invalid verification code', common_1.HttpStatus.BAD_REQUEST);
            await this.verificationRegistrationModel.verify(input.email.toLowerCase());
            return null;
        }
        catch (error) {
            throw new common_1.HttpException({
                status: false,
                statusCode: error.status,
                message: error.message,
                data: null,
            }, error.status);
        }
    }
    async register(input) {
        try {
            const userIdentityVerified = await this.verificationRegistrationModel.findOneByEmailOrPhone(input.email.toLowerCase(), [true]);
            if (!userIdentityVerified)
                throw new common_1.HttpException('User not verified', common_1.HttpStatus.BAD_REQUEST);
            const userRegistered = await this.memberModel.findAllByEmailOrPhone(input.email.toLowerCase());
            if (userRegistered.length > 0)
                throw new common_1.HttpException('User already registered', common_1.HttpStatus.BAD_REQUEST);
            const hashedPassword = await bcrypt.hash(input.password, bcrypt.genSaltSync(10));
            await this.memberModel.create({
                ...input,
                email: input.email.toLowerCase(),
                password: hashedPassword,
            });
            return null;
        }
        catch (error) {
            throw new common_1.HttpException({
                status: false,
                statusCode: error.status,
                message: error.message,
                data: null,
            }, error.status);
        }
    }
    async login(input) {
        try {
            const userRegistered = await this.memberModel.findOneByEmailOrPhone(input.email.toLowerCase());
            if (!userRegistered)
                throw new common_1.HttpException('User not registered', common_1.HttpStatus.BAD_REQUEST);
            const isMatched = await bcrypt.compare(input.password, userRegistered.password);
            if (!isMatched)
                throw new common_1.HttpException('Invalid password', common_1.HttpStatus.BAD_REQUEST);
            const accessToken = this.generateToken({
                userId: userRegistered._id,
                email: userRegistered.email,
                firstName: userRegistered.firstName,
                lastName: userRegistered.lastName,
            });
            await this.memberModel.active(userRegistered.email, true);
            return [
                {
                    accessToken,
                    refreshToken: this.configService.get('auth.refreshSecret', {
                        infer: true,
                    }),
                    accessTokenExpiresIn: this.convertTimeStringToMs(this.configService.get('auth.jwtExpiresIn', {
                        infer: true,
                    })),
                },
            ];
        }
        catch (error) {
            throw new common_1.HttpException({
                status: false,
                statusCode: error.status,
                message: error.message,
                data: null,
            }, error.status);
        }
    }
    async changePassword(input, decoded) {
        try {
            if (input.oldPassword === input.newPassword)
                throw new common_1.HttpException('Old password same as new password', common_1.HttpStatus.BAD_REQUEST);
            const userRegistered = await this.memberModel.findOneByEmailOrPhone(decoded.email);
            if (!userRegistered)
                throw new common_1.HttpException('User not registered', common_1.HttpStatus.BAD_REQUEST);
            const isMatched = await bcrypt.compare(input.oldPassword, userRegistered.password);
            if (!isMatched)
                throw new common_1.HttpException('Invalid password', common_1.HttpStatus.BAD_REQUEST);
            const hashedPassword = await bcrypt.hash(input.newPassword, 10);
            await this.memberModel.updatePassword(userRegistered._id, hashedPassword);
            return null;
        }
        catch (error) {
            throw new common_1.HttpException({
                status: false,
                statusCode: error.status,
                message: error.message,
                data: null,
            }, error.status);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [utils_service_1.UtilsService,
        models_1.MemberModel,
        models_1.VerificationRegistrationModel,
        models_1.VerificationResetPasswordModel,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map