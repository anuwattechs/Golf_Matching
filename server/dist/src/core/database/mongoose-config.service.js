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
exports.MongooseConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let MongooseConfigService = class MongooseConfigService {
    constructor(configService) {
        this.configService = configService;
    }
    createMongooseOptions() {
        const url = this.configService.get('database.url', { infer: true });
        const dbName = this.configService.get('database.name', {
            infer: true,
        });
        const user = this.configService.get('database.username', {
            infer: true,
        });
        const pass = this.configService.get('database.password', {
            infer: true,
        });
        console.log('Connecting to MongoDB with the following options:');
        console.log(`URI: ${url}, Database Name: ${dbName}`);
        return {
            uri: url,
            dbName,
            user,
            pass,
        };
    }
};
exports.MongooseConfigService = MongooseConfigService;
exports.MongooseConfigService = MongooseConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MongooseConfigService);
//# sourceMappingURL=mongoose-config.service.js.map