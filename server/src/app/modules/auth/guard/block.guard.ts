// jwt-auth.guard.ts
import {
  CanActivate,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class BlockGuard implements CanActivate {
  // constructor(private readonly authService: AuthService) {}

  // async canActivate(context: ExecutionContext): Promise<boolean> {
  async canActivate(): Promise<boolean> {
    throw new HttpException(
      {
        status: false,
        statusCode: HttpStatus.NOT_FOUND,
        message: I18nContext.current().t('guard.BLOCK_API') as string,
        data: [],
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
