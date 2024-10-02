"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_config_service_1 = require("./core/database/mongoose-config.service");
const config_2 = require("./core/database/config");
const auth_module_1 = require("./app/modules/auth/auth.module");
const auth_config_1 = require("./app/modules/auth/config/auth.config");
const app_config_1 = require("./app/config/app.config");
const auth_google_module_1 = require("./app/modules/auth-google/auth-google.module");
const auth_facebook_module_1 = require("./app/modules/auth-facebook/auth-facebook.module");
const auth_apple_module_1 = require("./app/modules/auth-apple/auth-apple.module");
const mail_module_1 = require("./app/modules/mail/mail.module");
const sms_module_1 = require("./app/modules/sms/sms.module");
const google_config_1 = require("./app/modules/auth-google/config/google.config");
const facebook_config_1 = require("./app/modules/auth-facebook/config/facebook.config");
const mail_config_1 = require("./app/modules/mail/config/mail.config");
const sms_config_1 = require("./app/modules/sms/config/sms.config");
const infrastructureDatabaseModule = mongoose_1.MongooseModule.forRootAsync({
    useClass: mongoose_config_service_1.MongooseConfigService,
});
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [
                    config_2.databaseConfig,
                    app_config_1.default,
                    auth_config_1.default,
                    google_config_1.default,
                    facebook_config_1.default,
                    mail_config_1.default,
                    sms_config_1.default,
                ],
                envFilePath: ['.env'],
            }),
            infrastructureDatabaseModule,
            auth_module_1.AuthModule,
            auth_google_module_1.AuthGoogleModule,
            auth_facebook_module_1.AuthFacebookModule,
            auth_apple_module_1.AuthAppleModule,
            mail_module_1.MailModule,
            sms_module_1.SmsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map