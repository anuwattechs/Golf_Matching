"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const schemas_1 = require("../../../schemas");
const jwt_strategy_1 = require("./strategy/jwt.strategy");
const config_1 = require("@nestjs/config");
const config_2 = require("@nestjs/config");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_2.ConfigModule,
            mongoose_1.MongooseModule.forFeature([
                {
                    name: schemas_1.Member.name,
                    schema: schemas_1.MemberSchema,
                },
                {
                    name: schemas_1.VerificationRegistration.name,
                    schema: schemas_1.VerificationRegistrationSchema,
                },
                {
                    name: schemas_1.VerificationResetPassword.name,
                    schema: schemas_1.VerificationResetPasswordSchema,
                },
            ]),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secret: new config_1.ConfigService().get('auth.jwtSecret', {
                    infer: true,
                }),
                signOptions: { expiresIn: new config_1.ConfigService().get('auth.jwtExpiresIn', {
                        infer: true,
                    }) },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService]
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map