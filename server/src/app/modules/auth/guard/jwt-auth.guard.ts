// jwt-auth.guard.ts
/*
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      return false;
    }
    return user;
  }
}
*/

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

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
            message: 'Please provide token',
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