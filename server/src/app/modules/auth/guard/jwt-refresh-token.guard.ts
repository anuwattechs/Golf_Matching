// jwt-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshTokenGuard implements CanActivate {
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
            message: 'Please provide token',
            data: null,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      const authToken = authorization.replace(/bearer/gim, '').trim();
      const resp = await this.authService.validateRefreshToken(authToken);
      request.decoded = resp;
      return true;
    } catch (error) {
      //  console.log('auth error - ', error.message);
      //  throw new ForbiddenException(
      //    error.message || 'session expired! Please sign In',
      //  );

      throw new HttpException(
        {
          status: false,
          statusCode: HttpStatus.FORBIDDEN,
          message: error.message || 'session expired! Please sign In',
          data: null,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
