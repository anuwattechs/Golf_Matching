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
exports.ResponseInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const date_fns_1 = require("date-fns");
const core_1 = require("@nestjs/core");
const response_message_decorator_1 = require("../decorator/response-message.decorator");
let ResponseInterceptor = class ResponseInterceptor {
    constructor(reflector) {
        this.reflector = reflector;
    }
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.map)((res) => this.responseHandler(res, context)), (0, operators_1.catchError)((err) => (0, rxjs_1.throwError)(() => this.errorHandler(err, context))));
    }
    errorHandler(exception, context) {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        response.status(status).json({
            status: false,
            statusCode: status,
            path: request.url,
            message: exception.message,
            data: null,
            timestamp: (0, date_fns_1.format)(new Date().toISOString(), 'yyyy-MM-dd HH:mm:ss'),
        });
    }
    responseHandler(res, context) {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const statusCode = response.statusCode;
        const message = this.reflector.get(response_message_decorator_1.RESPONSE_MESSAGE_METADATA, context.getHandler()) || 'success';
        return {
            status: true,
            path: request.url,
            message: message,
            statusCode,
            data: res,
            timestamp: (0, date_fns_1.format)(new Date().toISOString(), 'yyyy-MM-dd HH:mm:ss'),
        };
    }
};
exports.ResponseInterceptor = ResponseInterceptor;
exports.ResponseInterceptor = ResponseInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], ResponseInterceptor);
//# sourceMappingURL=response.interceptor.js.map