import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';
import { I18nContext } from 'nestjs-i18n';
import { MembersService } from '../../modules/members/members.service';

@Injectable()
export class UserRegisteredGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly membersService: MembersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const { authorization }: any = request.headers;
      if (!authorization || authorization.trim() === '') {
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
      const resp = this.authService.validateToken(authToken);

      // Check if user is registered (additional logic for registration validation)
      const user = (await this.membersService.findOnePersonalInfo(resp)) as {
        isRegistered: boolean;
      };
      if (!user.isRegistered) {
        throw new HttpException(
          {
            status: false,
            statusCode: HttpStatus.FORBIDDEN,
            message: I18nContext.current().t(
              'guard.USER_NOT_REGISTERED',
            ) as string,
            data: null,
          },
          HttpStatus.FORBIDDEN,
        );
      }

      request.decoded = resp;
      return true;
    } catch (error) {
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
