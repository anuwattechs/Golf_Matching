import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { config } from '../configs/config';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const authorizationHeader = request.headers['authorization'];
    if (!authorizationHeader) {
      return true; // No token provided, allow access
    }

    const token = request.headers['authorization'].split(' ')[1];

    if (!token) {
      return false; // No token provided
    }

    const decoded = jwt.verify(token, config.JWT_SECRET, {
      algorithms: ['HS256'],
    });
    const role = decoded['role'];

    const allowedRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!allowedRoles || allowedRoles.length === 0) {
      return true; // No roles specified for this route, allow access to everyone
    }

    // Check if the user role is in the allowed roles
    if (!allowedRoles.includes(role)) {
      throw new ForbiddenException({
        status: 'error',
        message: 'you cannot access this functionality',
        data: [],
      });
    }

    return true; // User role is allowed
  }
}
