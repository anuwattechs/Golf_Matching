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
<<<<<<< HEAD
<<<<<<< HEAD
const users_service_1 = require("../users/users.service");
const speakeasy = require("speakeasy");
let AuthService = class AuthService {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async register(createUserDto) {
        const otp = speakeasy.totp({
            secret: process.env.OTP_SECRET,
            encoding: 'base32',
        });
        console.log(otp);
=======
const bcrypt = require("bcrypt");
const models_1 = require("../../../schemas/models");
const utils_1 = require("../../../shared/utils/utils");
=======
const users_service_1 = require("../users/users.service");
const speakeasy = require("speakeasy");
>>>>>>> 744d629 (Revert "Refactor enum and schema imports")
let AuthService = class AuthService {
    constructor(usersService) {
        this.usersService = usersService;
    }
<<<<<<< HEAD
    async createVerificationRegister(input) {
        try {
            const userRegistered = await this.memberModel.findAllByEmailOrPhone(input.email);
            if (userRegistered.length > 0)
                throw new common_1.HttpException('User already registered', common_1.HttpStatus.BAD_REQUEST);
            const user = await this.verificationRegistrationModel.findOneByEmailOrPhone(input.email.toLowerCase());
            const verifyCode = this.utils.generateRandomNumber(6);
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
            return {
                status: true,
                statusCode: common_1.HttpStatus.CREATED,
                message: 'Verification code sent successfully',
                data: [{ verify_code: verifyCode }],
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async verifyRegister(input) {
        try {
            const userRegistered = await this.verificationRegistrationModel.findOneByEmailOrPhone(input.email.toLowerCase());
            if (!userRegistered)
                throw new common_1.HttpException('User not registered', common_1.HttpStatus.BAD_REQUEST);
            if (userRegistered.verifyCode !== input.verifyCode)
                throw new common_1.HttpException('Invalid verification code', common_1.HttpStatus.BAD_REQUEST);
            await this.verificationRegistrationModel.verify(input.email.toLowerCase());
            return {
                status: true,
                statusCode: common_1.HttpStatus.CREATED,
                message: 'Indentity verified successfully',
                data: [],
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async register(input) {
        try {
            const userIdentityVerified = await this.verificationRegistrationModel.findOneByEmailOrPhone(input.email.toLowerCase(), true);
            if (!userIdentityVerified)
                throw new common_1.HttpException('User not verified', common_1.HttpStatus.BAD_REQUEST);
            const userRegistered = await this.memberModel.findAllByEmailOrPhone(input.email.toLowerCase());
            if (userRegistered.length > 0)
                throw new common_1.HttpException('User already registered', common_1.HttpStatus.BAD_REQUEST);
            const hashedPassword = await bcrypt.hash(input.password, 10);
            await this.memberModel.create({
                ...input,
                email: input.email.toLowerCase(),
                password: hashedPassword,
            });
            return {
                status: true,
                statusCode: common_1.HttpStatus.CREATED,
                message: 'User registered successfully',
                data: [],
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateProfile(input, decoded) {
        try {
            const userRegistered = await this.userModel.findOne({
                _id: decoded.user_id,
            });
            if (!userRegistered)
                return {
                    status: 'error',
                    statusCode: 400,
                    message: 'User not registered',
                    data: [],
                };
            const updated = await this.userModel.updateOne({ _id: decoded.user_id }, {
                $set: {
                    ...input,
                },
            });
            return {
                status: 'success',
                statusCode: 201,
                message: 'User updated successfully',
                data: [updated],
            };
        }
        catch (error) {
            return {
                status: 'error',
                statusCode: 500,
                message: error.message,
                data: [],
            };
        }
    }
    async login(input) {
        try {
            const userRegistered = await this.userModel.findOne({
                $or: [
                    { email: input.username.toLowerCase() },
                ],
            });
            if (!userRegistered)
                return {
                    status: 'error',
                    statusCode: 400,
                    message: 'User not registered',
                    data: [],
                };
            const isMatched = await bcrypt.compare(input.password, userRegistered.password);
            if (!isMatched)
                return {
                    status: 'error',
                    statusCode: 400,
                    message: 'Invalid password',
                    data: [],
                };
            const now = new Date();
            const payload = {
                user_id: userRegistered._id,
                name: `${userRegistered.first_name} ${userRegistered.last_name}`,
                email: userRegistered.email,
                phone_number: userRegistered.phone_number,
            };
            const token = jwt.sign(payload, configuration().jwtSecret, {
                expiresIn: '1000d',
            });
            await this.userModel.updateOne({
                _id: userRegistered._id,
            }, {
                $set: {
                    is_actived: true,
                    actived_at: now,
                },
            });
            return {
                status: 'success',
                statusCode: 200,
                message: 'User logged in successfully',
                data: [
                    {
                        user_id: userRegistered._id,
                        token,
                        first_name: userRegistered.first_name,
                        last_name: userRegistered.last_name,
                        email: userRegistered.email,
                        phone_number: userRegistered.phone_number,
                        nick_name: userRegistered.nick_name,
                    },
                ],
            };
        }
        catch (error) {
            return {
                status: 'error',
                statusCode: 500,
                message: error.message,
                data: [],
            };
        }
    }
    async changePassword(input, decoded) {
        try {
            if (input.new_password === input.old_password)
                return {
                    status: 'error',
                    statusCode: 400,
                    message: 'Old password same as new password',
                    data: [],
                };
            const userRegistered = await this.userModel.findOne({
                _id: decoded.user_id,
            });
            if (!userRegistered)
                return {
                    status: 'error',
                    statusCode: 400,
                    message: 'User not registered',
                    data: [],
                };
            const isMatched = await bcrypt.compare(input.old_password, userRegistered.password);
            if (!isMatched)
                return {
                    status: 'error',
                    statusCode: 400,
                    message: 'Invalid password',
                    data: [],
                };
            const hashedPassword = await bcrypt.hash(input.new_password, 10);
            const now = new Date();
            await this.userModel.updateOne({
                _id: userRegistered._id,
            }, {
                $set: {
                    password: hashedPassword,
                    updated_at: now,
                },
            });
            return {
                status: 'success',
                statusCode: 201,
                message: 'Password changed successfully',
                data: [],
            };
        }
        catch (error) {
            return {
                status: 'error',
                statusCode: 500,
                message: error.message,
                data: [],
            };
        }
    }
    async changeInviteMode(input, decoded) {
        try {
            const now = new Date();
            await this.userModel.updateOne({
                _id: decoded.user_id,
            }, {
                $set: {
                    is_invited: input.is_invited,
                    updated_at: now,
                },
            });
            return {
                status: 'success',
                statusCode: 201,
                message: 'Invite mode changed successfully',
                data: [{ is_invited: input.is_invited }],
            };
        }
        catch (error) {
            return {
                status: 'error',
                statusCode: 500,
                message: error.message,
                data: [],
            };
        }
    }
    async findOneProsonalInfo(decoded) {
        try {
            const user = await this.userModel
                .findOne({
                _id: decoded.user_id,
            })
                .select('-_id -password -is_actived -actived_at -created_at -updated_at');
            return {
                status: 'success',
                statusCode: 200,
                message: 'User found successfully',
                data: [user],
            };
        }
        catch (error) {
            return {
                status: 'error',
                statusCode: 500,
                message: error.message,
                data: [],
            };
        }
    }
    async createIndentityVerifyResetPassword(input) {
        try {
            const userRegistered = await this.userModel.findOne({
                $or: [
                    { email: input.username.toLowerCase() },
                    { phone_number: input.username.toLowerCase() },
                ],
            });
            if (!userRegistered)
                return {
                    status: 'error',
                    statusCode: 400,
                    message: 'User not registered',
                    data: [],
                };
            const verifyCode = this.randomNumber();
            const created = await this.identityVerificationForgorPasswordModel.create({
                user_id: userRegistered._id,
                username: input.username.toLowerCase(),
                type: input.type,
                verify_code: verifyCode,
            });
            return {
                status: 'success',
                statusCode: 201,
                message: 'Indentity verified successfully',
                data: [
                    {
                        transaction_id: created._id,
                        verify_code: verifyCode,
                    },
                ],
            };
        }
        catch (error) {
            return {
                status: 'error',
                statusCode: 500,
                message: error.message,
                data: [],
            };
        }
    }
    async identityResetPasswordConfirm(input) {
        try {
            const transaction = await this.identityVerificationForgorPasswordModel.findOne({
                _id: input.transaction_id,
            });
            if (!transaction)
                return {
                    status: 'error',
                    statusCode: 400,
                    message: 'Transaction not found',
                    data: [],
                };
            if (transaction.verify_code !== input.verify_code)
                return {
                    status: 'error',
                    statusCode: 400,
                    message: 'Invalid verification code',
                    data: [],
                };
            const now = new Date();
            await this.identityVerificationForgorPasswordModel.updateOne({
                _id: input.transaction_id,
            }, { $set: { is_verified: true, updated_at: now } });
            return {
                status: 'success',
                statusCode: 201,
                message: 'Indentity verified successfully',
                data: [{ transaction_id: input.transaction_id }],
            };
        }
        catch (error) {
            return {
                status: 'error',
                statusCode: 500,
                message: error.message,
                data: [],
            };
        }
    }
    async resetPassword(input) {
        try {
            const transaction = await this.identityVerificationForgorPasswordModel.findOne({
                _id: input.transaction_id,
                is_verified: true,
                reseted_at: null,
            });
            if (!transaction)
                return {
                    status: 'error',
                    statusCode: 400,
                    message: 'Transaction not found or not verified',
                    data: [],
                };
            const now = new Date();
            await this.identityVerificationRegistrationModel.updateOne({
                _id: input.transaction_id,
            }, { $set: { reseted_at: now, updated_at: now } });
            const hashedPassword = await bcrypt.hash(input.password, 10);
            await this.userModel.updateOne({ _id: transaction.user_id }, {
                $set: {
                    password: hashedPassword,
                    updated_at: now,
                },
            });
            return {
                status: 'success',
                statusCode: 201,
                message: 'Password reseted successfully',
                data: [],
            };
        }
        catch (error) {
            return {
                status: 'error',
                statusCode: 500,
                message: error.message,
                data: [],
            };
        }
>>>>>>> a768db95c667773a296a2e5a7ac9eee2a815d013
=======
    async register(createUserDto) {
        const otp = speakeasy.totp({
            secret: process.env.OTP_SECRET,
            encoding: 'base32',
        });
        console.log(otp);
>>>>>>> 744d629 (Revert "Refactor enum and schema imports")
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
<<<<<<< HEAD
<<<<<<< HEAD
    __metadata("design:paramtypes", [users_service_1.UsersService])
=======
    __metadata("design:paramtypes", [utils_1.Utils,
        models_1.MemberModel,
        models_1.VerificationRegistrationModel,
        models_1.VerificationResetPasswordModel])
>>>>>>> a768db95c667773a296a2e5a7ac9eee2a815d013
=======
    __metadata("design:paramtypes", [users_service_1.UsersService])
>>>>>>> 744d629 (Revert "Refactor enum and schema imports")
], AuthService);
//# sourceMappingURL=auth.service.js.map