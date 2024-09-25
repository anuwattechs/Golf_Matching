import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private cache: Map<string, any> = new Map();

  constructor(private readonly ttl: number) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const key = request.originalUrl;

    const cachedResponse = this.cache.get(key);
    if (cachedResponse) {
      return of(cachedResponse);
    }

    return next.handle().pipe(
      tap((response) => {
        this.cache.set(key, response);
        setTimeout(() => this.cache.delete(key), this.ttl);
      }),
    );
  }
}
