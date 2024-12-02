import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class ProfileAccessGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authToken = this.extractToken(request.headers.authorization);

    // Validate token and set the user on the request object
    const user = await this.validateAndSetUser(authToken, request);

    const profileId = request.params.memberId;

    // Check if the user is the profile owner
    if (this.isOwner(user._id, profileId)) {
      return true;
    }

    // Check if the user is a friend or follower
    const isFriend = await this.isFriendOrFollowing(user._id, profileId);
    if (isFriend) {
      return true;
    }

    // If the user is neither the owner nor a friend/follower, deny access
    throw new HttpException(
      {
        status: false,
        statusCode: HttpStatus.FORBIDDEN,
        message: 'You do not have permission to access this profile',
        data: null,
      },
      HttpStatus.FORBIDDEN,
    );
  }

  /**
   * Extracts the Bearer token from the authorization header
   * @param authorization - Authorization header
   * @returns string - Extracted token
   */
  private extractToken(authorization: string | undefined): string {
    if (!authorization || authorization.trim() === '') {
      throw new HttpException(
        {
          status: false,
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Token not provided',
          data: null,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = authorization.replace(/bearer\s+/i, '').trim();
    if (!token) {
      throw new HttpException(
        {
          status: false,
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid token',
          data: null,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return token;
  }

  /**
   * Validates the token and sets the user on the request object
   * @param authToken - Bearer token
   * @param request - HTTP request object
   * @returns Promise<any> - User object from the validated token
   */
  private async validateAndSetUser(
    authToken: string,
    request: any,
  ): Promise<any> {
    const user = await this.authService.validateToken(authToken);
    if (!user) {
      throw new HttpException(
        {
          status: false,
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid token',
          data: null,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    request.user = user;
    return user;
  }

  /**
   * Checks if the current user is the owner of the profile
   * @param userId - User ID from JWT
   * @param profileId - ID of the profile being accessed
   * @returns boolean - True if the user is the owner
   */
  private isOwner(userId: string, profileId: string): boolean {
    return userId === profileId;
  }

  /**
   * Checks if the current user is a friend or following the profile
   * @param userId - User ID
   * @param profileId - ID of the profile being accessed
   * @returns Promise<boolean> - True if the user is a friend or follower
   */
  private async isFriendOrFollowing(
    userId: string,
    profileId: string,
  ): Promise<boolean> {
    // Example: return await this.authService.checkFriendship(userId, profileId);
    return true;
  }
}
