import {
  Module,
  RequestMethod,
  MiddlewareConsumer,
  NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
// import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './services/users/users.module';
import { JwtMiddleware } from './common/middlewares/jwt.middleware';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    // CacheModule.register({ isGlobal: true }),
    MongooseModule.forRoot(configuration().mongoUri),
    UsersModule,
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
        '/users/register/indentity-verify',
        '/users/register/confirm-indentity-verify',
        '/users/forgot-password/indentity-verify',
        '/users/forgot-password/confirm-indentity-verify',
        '/users/forgot-password/reset',
      )
      .forRoutes({
        path: '/users*',
        method: RequestMethod.ALL,
      });
  }
}
