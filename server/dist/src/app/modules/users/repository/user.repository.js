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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const schemas_1 = require("../../../../schemas");
let UserRepository = class UserRepository {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(data) {
<<<<<<< HEAD
        const createdUser = new this.userModel({
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return createdUser.save();
    }
    async findById(id) {
        return this.userModel.findById(id).exec();
=======
        const currentDate = new Date();
        const createdUser = new this.userModel({
            ...data,
            createdAt: currentDate,
            updatedAt: currentDate,
        });
        return await createdUser.save();
    }
    async findById(id) {
        return await this.userModel.findById(id).exec();
>>>>>>> a768db95c667773a296a2e5a7ac9eee2a815d013
    }
    async remove(id) {
        await this.userModel.findByIdAndDelete(id).exec();
    }
    async findByEmail(email) {
<<<<<<< HEAD
        return this.userModel.findOne({ email }).exec();
    }
    async findBySocialIdAndProvider({ socialId, provider, }) {
        return this.userModel.findOne({ socialId, provider }).exec();
    }
    async findAll() {
        return this.userModel.find().exec();
=======
        return await this.userModel.findOne({ email }).exec();
    }
    async findBySocialIdAndProvider({ socialId, provider, }) {
        return await this.userModel.findOne({
            where: { socialId, provider },
        });
    }
    async findAll() {
        return await this.userModel.find().exec();
    }
    async update(id, data) {
        return await this.userModel
            .findByIdAndUpdate(id, data, { new: true })
            .exec();
>>>>>>> a768db95c667773a296a2e5a7ac9eee2a815d013
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(schemas_1.User.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], UserRepository);
//# sourceMappingURL=user.repository.js.map