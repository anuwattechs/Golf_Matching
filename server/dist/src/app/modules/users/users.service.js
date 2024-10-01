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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("./repository/user.repository");
let UsersService = class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(createUserDto) {
        const { email } = createUserDto;
        const user = await this.findByEmail(email);
        if (user) {
            throw new common_1.HttpException(`User with email ${email} already exists`, common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const clonedPayload = { ...createUserDto };
            return await this.userRepository.create(clonedPayload);
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    findByEmail(email) {
        return this.userRepository.findByEmail(email);
    }
    findBySocialIdAndProvider({ socialId, provider, }) {
        return this.userRepository.findBySocialIdAndProvider({
            socialId,
            provider,
        });
    }
    async findAll() {
        return await this.userRepository.findAll();
    }
    async update(id, payload) {
        const clonedPayload = { ...payload, updatedAt: new Date() };
        return await this.userRepository.update(id, clonedPayload);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], UsersService);
//# sourceMappingURL=users.service.js.map