import {
  Module,
  RequestMethod,
  MiddlewareConsumer,
  NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './services/users/users.module';
import { JwtMiddleware } from './common/middlewares/jwt.middleware';
import { AuthGoogleModule } from './services/auth-google/auth-google.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRoot(configuration().mongoUri),
    UsersModule,
    AuthGoogleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        '/users/login',
        '/users/register',
        '/users/register/identity-verify',
        '/users/register/confirm-identity-verify',
        '/users/forgot-password/identity-verify',
        '/users/forgot-password/confirm-identity-verify',
        '/users/forgot-password/reset',
      )
      .forRoutes({
        path: '/users*',
        method: RequestMethod.ALL,
      });
  }
}
