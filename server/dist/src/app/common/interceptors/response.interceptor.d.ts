import { NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
export type Response<T> = {
    status: boolean;
    statusCode: number;
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 744d629 (Revert "Refactor enum and schema imports")
    path: string;
    message: string;
    data: T;
    timestamp: string;
<<<<<<< HEAD
=======
    message: string;
    data: T;
>>>>>>> a768db95c667773a296a2e5a7ac9eee2a815d013
=======
>>>>>>> 744d629 (Revert "Refactor enum and schema imports")
};
export declare class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    private reflector;
    constructor(reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>>;
    errorHandler(exception: HttpException, context: ExecutionContext): void;
    responseHandler(res: T, context: ExecutionContext): {
        status: boolean;
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 744d629 (Revert "Refactor enum and schema imports")
        path: any;
        message: string;
        statusCode: any;
        data: T;
        timestamp: string;
<<<<<<< HEAD
=======
        message: string;
        statusCode: any;
        data: T;
>>>>>>> a768db95c667773a296a2e5a7ac9eee2a815d013
=======
>>>>>>> 744d629 (Revert "Refactor enum and schema imports")
    };
}
