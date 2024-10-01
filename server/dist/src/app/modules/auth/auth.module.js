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
<<<<<<< HEAD
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const users_module_1 = require("../users/users.module");
=======
const mongoose_1 = require("@nestjs/mongoose");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const schemas_1 = require("../../../schemas");
>>>>>>> a768db95c667773a296a2e5a7ac9eee2a815d013
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
<<<<<<< HEAD
        imports: [users_module_1.UsersModule],
        providers: [auth_service_1.AuthService],
        controllers: [auth_controller_1.AuthController],
=======
        imports: [
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
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService],
>>>>>>> a768db95c667773a296a2e5a7ac9eee2a815d013
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map