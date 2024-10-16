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
import {
  RESPONSE_MESSAGE_METADATA,
  ResponseMessage as ResponseMessageType,
} from '../decorator/response-message.decorator';
import { I18nContext } from 'nestjs-i18n';
import { I18nPath } from 'src/generated/i18n.generated';

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
      map((res: T) => this.formatResponse(res, context)),
      catchError((error: HttpException) =>
        throwError(() => this.formatError(error, context)),
      ),
    );
  }

  private formatError(exception: HttpException, context: ExecutionContext) {
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = this.getErrorMessage(exception, status);

    const response = context.switchToHttp().getResponse();
    response.status(status).json({
      status: false,
      statusCode: status,
      message,
      data: this.extractErrorData(exception, status),
    });
  }

  private formatResponse(res: T, context: ExecutionContext): Response<T> {
    const statusCode = context.switchToHttp().getResponse().statusCode;
    const message = this.getSuccessMessage(context);
    const { statusCode: resStatus, ...data } = (res || {}) as any;

    return {
      status: true,
      statusCode: resStatus ?? statusCode,
      message,
      data: Array.isArray(res) ? res : data,
    };
  }

  private getErrorMessage(exception: HttpException, status: number): string {
    const i18nMessage = I18nContext.current().t(`status-code.${status}`);
    const isBadRequest = status === HttpStatus.BAD_REQUEST;
    const responseMessage = (exception.getResponse() as any)?.message;

    return isBadRequest && typeof responseMessage !== 'string'
      ? i18nMessage
      : (I18nContext.current().t(
          typeof responseMessage === 'string' && responseMessage
            ? responseMessage
            : 'common.ERROR',
        ) as string);
  }

  private extractErrorData(exception: HttpException, status: number) {
    if (status !== HttpStatus.BAD_REQUEST) return null;

    const response = (exception.getResponse() as any)?.message;
    return typeof response === 'string' ? null : response || null;
  }

  private getSuccessMessage(context: ExecutionContext): string {
    const message = this.reflector.get<I18nPath>(
      RESPONSE_MESSAGE_METADATA,
      context.getHandler(),
    );

    return I18nContext.current().t(
      message ? message : 'common.SUCCESS',
    ) as string;
  }
}
