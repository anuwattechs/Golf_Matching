// jwt-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  // UnauthorizedException,
  // ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const { authorization }: any = request.headers;
      if (!authorization || authorization.trim() === '') {
        //    throw new UnauthorizedException('Please provide token');
        throw new HttpException(
          {
            status: false,
            statusCode: HttpStatus.UNAUTHORIZED,
            message: I18nContext.current().t(
              'guard.TOKEN_NOT_PROVIDE',
            ) as string,
            data: null,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      const authToken = authorization.replace(/bearer/gim, '').trim();
      const resp = await this.authService.validateToken(authToken);
      request.decoded = resp;
      return true;
    } catch (error) {
      // console.log('auth error - ', error.message);
      //  throw new ForbiddenException(
      //    error.message || 'session expired! Please sign In',
      //  );

      throw new HttpException(
        {
          status: false,
          statusCode: HttpStatus.UNAUTHORIZED,
          message:
            error.message ||
            (I18nContext.current().t('guard.SESSION_EXPIRED') as string),
          data: null,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
