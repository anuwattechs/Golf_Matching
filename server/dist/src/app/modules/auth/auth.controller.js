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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const response_message_decorator_1 = require("../../common/decorator/response-message.decorator");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("./guard/jwt-auth.guard");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async createVerificationRegister(body) {
        return await this.authService.createVerificationRegister(body);
    }
    async verifyOtpRegister(body) {
        return await this.authService.verifyOtpRegister(body);
    }
    async register(body) {
        return await this.authService.register(body);
    }
    async login(body) {
        return await this.authService.login(body);
    }
    async changePassword(body, req) {
        console.log('req.user', req.user);
        return await this.authService.changePassword(body, req.user);
    }
    async test1(req) {
        console.log('req.user', req.user);
        return req.user;
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('verification-register'),
    (0, response_message_decorator_1.ResponseMessage)('Verification code sent successfully'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.VerificationRegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createVerificationRegister", null);
__decorate([
    (0, common_1.Patch)('verify-otp-register'),
    (0, response_message_decorator_1.ResponseMessage)('User verified successfully'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.VerifyOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtpRegister", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, response_message_decorator_1.ResponseMessage)('User registered successfully'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, response_message_decorator_1.ResponseMessage)('User logged in successfully'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Patch)('change-password'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, response_message_decorator_1.ResponseMessage)('Password changed successfully'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ChangePasswordDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Get)('test1'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, response_message_decorator_1.ResponseMessage)('Test1'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "test1", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map