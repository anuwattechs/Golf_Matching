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
import { Reflector } from '@nestjs/core';
import { I18nContext } from 'nestjs-i18n';
import { RESPONSE_MESSAGE_METADATA } from '../decorator/response-message.decorator';

export type Response<T> = {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
};

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((res: T) => this.createSuccessResponse(res, context)),
      catchError((err: HttpException) =>
        throwError(() => this.createErrorResponse(err, context)),
      ),
    );
  }

  private createErrorResponse(
    exception: HttpException,
    context: ExecutionContext,
  ) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const i18nMessage = I18nContext.current().t(
      `status-code.${status}`,
    ) as string;


    response.status(status).json({
      status: false,
      statusCode: status,
      message: i18nMessage,
      data: this.extractErrorMessage(exception),
    });
  }

  private extractErrorMessage(exception: HttpException) {
    const response = exception.getResponse();
    if (typeof response === 'string') {
      return null;
    }
    return (response as any).message || null;
  }

  private createSuccessResponse(
    res: T,
    context: ExecutionContext,
  ): Response<T> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;
    const message = this.getResponseMessage(context);

    return {
      status: true,
      statusCode,
      message,
      data: res,
    };
  }

  private getResponseMessage(context: ExecutionContext): string {
    const customMessage = this.reflector.get<string>(
      RESPONSE_MESSAGE_METADATA,
      context.getHandler(),
    );
    return (
      customMessage || (I18nContext.current().t('common.SUCCESS') as string)
    );
  }
}
