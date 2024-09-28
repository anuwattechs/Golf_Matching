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
exports.UserSchema = exports.User = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const enums_1 = require("../shared/enums");
const class_transformer_1 = require("class-transformer");
const uuid_1 = require("uuid");
let User = class User extends mongoose_2.Document {
    loadPreviousPassword() {
        this.previousPassword = this.password;
    }
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        default: uuid_1.v4,
    }),
    __metadata("design:type", String)
], User.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: true, nullable: true, type: String }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ nullable: true, select: false }),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    __metadata("design:type", String)
], User.prototype, "previousPassword", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: enums_1.AuthProvidersEnum.EMAIL }),
    __metadata("design:type", String)
], User.prototype, "provider", void 0);
__decorate([
    (0, mongoose_1.Prop)({ nullable: true, index: true, type: String }),
    __metadata("design:type", String)
], User.prototype, "socialId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isVerified", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "otp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], User.prototype, "otpExpired", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "otpSent", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        nullable: true,
        type: String,
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ nullable: true, type: String }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ nullable: true, type: String }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: Date.now,
    }),
    __metadata("design:type", Date)
], User.prototype, "lastLogin", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: Date.now,
    }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: Date.now,
    }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "deletedAt", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
exports.UserSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password'))
        return next();
    user.previousPassword = user.password;
    next();
});
//# sourceMappingURL=users.schema.js.map