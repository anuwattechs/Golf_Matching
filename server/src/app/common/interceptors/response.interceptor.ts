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
import { format } from 'date-fns';
import { Reflector } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { RESPONSE_MESSAGE_METADATA } from '../decorator/response-message.decorator';

export interface Response<T> {
  status: boolean;
  statusCode: number;
  path: string;
  message: string;
  data: T | null;
  timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((res) => this.createSuccessResponse(res as T, context)),
      catchError((err) =>
        throwError(() => this.createErrorResponse(err, context)),
      ),
    );
  }

  private createErrorResponse(
    exception: HttpException,
    context: ExecutionContext,
  ) {
    const { request, response } = this.getContextData(context);
    const status = this.getExceptionStatus(exception);

    const errorResponse: Response<null | string[]> = {
      status: false,
      statusCode: status,
      path: request.url,
      message: this.getExceptionMessage(exception),
      data: this.getValidationErrors(exception),
      timestamp: this.getCurrentTimestamp(),
    };
    response.status(status).json(errorResponse);
  }

  private createSuccessResponse(
    data: T,
    context: ExecutionContext,
  ): Response<T> {
    const { request, response } = this.getContextData(context);
    const message = this.getResponseMessage(context) || 'success';

    return {
      status: true,
      statusCode: response.statusCode,
      path: request.url,
      message,
      data,
      timestamp: this.getCurrentTimestamp(),
    };
  }

  private getContextData(context: ExecutionContext) {
    const httpContext = context.switchToHttp();
    return {
      request: httpContext.getRequest(),
      response: httpContext.getResponse(),
    };
  }

  private getExceptionStatus(exception: HttpException): number {
    return exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getExceptionMessage(exception: HttpException): string {
    const res = exception.getResponse();
    return typeof res === 'object' && res.hasOwnProperty('message')
      ? Array.isArray(res['message'])
        ? res['message'].join(', ')
        : res['message']
      : exception.message;
  }

  /**
   * Extract validation errors and move them to the `data` field.
   * If not a validation error, return `null`.
   */
  private getValidationErrors(exception: HttpException): string[] | null {
    const res = exception.getResponse();

    if (typeof res === 'object' && res.hasOwnProperty('message')) {
      const messages = res['message'];
      if (Array.isArray(messages) && messages[0] instanceof ValidationError) {
        return messages.map((error: ValidationError) =>
          Object.values(error.constraints).join(', '),
        );
      }
    }

    return null;
  }

  private getResponseMessage(context: ExecutionContext): string | undefined {
    return this.reflector.get<string>(
      RESPONSE_MESSAGE_METADATA,
      context.getHandler(),
    );
  }

  private getCurrentTimestamp(): string {
    return format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  }
}
