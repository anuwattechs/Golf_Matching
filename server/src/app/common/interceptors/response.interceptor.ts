import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
// import { format } from 'date-fns';
import { Reflector } from '@nestjs/core';
import { RESPONSE_MESSAGE_METADATA } from '../decorator/response-message.decorator';
import { I18nContext } from 'nestjs-i18n';

export type Response<T> = {
  status: boolean;
  statusCode: number;
  // path: string;
  message: string;
  data: T;
  // timestamp: string;
};

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((res: unknown) => this.responseHandler(res as T, context)),
      catchError((err: HttpException) =>
        throwError(() => this.errorHandler(err, context)),
      ),
    );
  }

  errorHandler(exception: HttpException, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    // const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const tMessage = I18nContext.current().t(`status-code.${status}`) as string;

    const badRequestValidate =
      status === HttpStatus.BAD_REQUEST &&
      typeof (exception.getResponse() as any).message !== 'string';
    response.status(status).json({
      status: false,
      statusCode: status,
      // path: request.url,
      // message: exception.message,
      // message: I18nContext.current().t(`status-code.${status}`) as string,
      message: badRequestValidate ? tMessage : exception.message,
      data:
        status === HttpStatus.BAD_REQUEST
          ? typeof (exception.getResponse() as any).message === 'string'
            ? null
            : (exception.getResponse() as any).message || null
          : null,
      // timestamp: format(new Date().toISOString(), 'yyyy-MM-dd HH:mm:ss'),
    });
  }

  responseHandler(res: T, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    // const request = ctx.getRequest();
    const statusCode = response.statusCode;
    const message =
      this.reflector.get<string>(
        RESPONSE_MESSAGE_METADATA,
        context.getHandler(),
      ) || I18nContext.current().t('common.SUCCESS');

    // console.log('message', message);
    // console.log(i18n.translate('common.SUCCESS'));

    const tMessage = I18nContext.current().t(message) as string;

    if (Array.isArray(res))
      return {
        status: true,
        // path: request.url,
        statusCode,
        // message: message,
        message: tMessage,
        data: res,
        // timestamp: format(new Date().toISOString(), 'yyyy-MM-dd HH:mm:ss'),
      };

    const { statusCode: status, ...rest } = (res || {}) as any;

    return {
      status: true,
      // path: request.url,
      statusCode: status === undefined ? statusCode : status,
      // message: message,
      message: tMessage,
      data: res === null ? null : rest,
      // timestamp: format(new Date().toISOString(), 'yyyy-MM-dd HH:mm:ss'),
    };
  }
}
