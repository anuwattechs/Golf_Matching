import { NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
export type Response<T> = {
    status: boolean;
    statusCode: number;
    path: string;
    message: string;
    data: T;
    timestamp: string;
};
export declare class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    private reflector;
    constructor(reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>>;
    errorHandler(exception: HttpException, context: ExecutionContext): void;
    responseHandler(res: T, context: ExecutionContext): {
        status: boolean;
        path: any;
        message: string;
        statusCode: any;
        data: T;
        timestamp: string;
    };
}
