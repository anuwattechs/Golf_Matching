import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: 'Request was successful',
        data,
      })),
      catchError((exception) => {
        let response;
        let statusCode;

        if (exception instanceof HttpException) {
          response = exception.getResponse();
          statusCode = exception.getStatus();
        } else {
          response = { message: 'Internal server error' };
          statusCode = 500;
        }

        return throwError(() => ({
          statusCode: statusCode,
          message:
            typeof response === 'string' ? response : response['message'],
          error: response['error'] || 'Error',
        }));
      }),
    );
  }
}
