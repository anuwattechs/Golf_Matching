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
import { RESPONSE_MESSAGE_METADATA } from '../decorator/response-message.decorator';
import { I18nContext } from 'nestjs-i18n';
// import { I18nPath } from 'src/generated/i18n.generated';
import { LoggingService } from 'src/core/logging/logging.service';

export type Response<T> = {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
};

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(
    private readonly reflector: Reflector,
    private readonly loggingService: LoggingService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((res: T) => this.formatResponse(res, context)),
      catchError((error: any) => {
        // Ensure the error is handled correctly
        return throwError(() => this.formatError(error, context));
      }),
    );
  }

  private formatError(exception: any, context: ExecutionContext) {
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = this.getErrorMessage(exception, status);

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.loggingService.error(
        message,
        exception.stack,
        context.getClass().name,
      );
    }
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
      data: Array.isArray(res) ? res : res === null ? null : data,
    };
  }

  private getErrorMessage(exception: any, status: number): string {
    const i18nMessage = I18nContext.current().t(`status-code.${status}`);
    const isBadRequest = status === HttpStatus.BAD_REQUEST;
    let responseMessage = '';

    // Check if the exception has a getResponse method
    if (exception instanceof HttpException) {
      responseMessage = (exception.getResponse() as any)?.message;
    } else {
      responseMessage = exception?.message || null;
    }

    return isBadRequest && typeof responseMessage !== 'string'
      ? i18nMessage
      : (I18nContext.current().t(
          typeof responseMessage === 'string' && responseMessage
            ? responseMessage
            : 'common.ERROR',
        ) as string);
  }

  private extractErrorData(exception: any, status: number) {
    if (status !== HttpStatus.BAD_REQUEST) return null;

    let response;
    if (exception instanceof HttpException) {
      response = (exception.getResponse() as any)?.message;
    } else {
      response = exception?.message || null;
    }

    return typeof response === 'string' ? null : response || null;
  }

  private getSuccessMessage(context: ExecutionContext): string {
    // const message = this.reflector.get<I18nPath>(
    const message = this.reflector.get<string>(
      RESPONSE_MESSAGE_METADATA,
      context.getHandler(),
    );

    return I18nContext.current().t(
      message ? message : 'common.SUCCESS',
    ) as string;
  }
}
