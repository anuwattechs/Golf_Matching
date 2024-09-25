import {
  Module,
  RequestMethod,
  MiddlewareConsumer,
  NestModule,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './services/users/users.module';
import { JwtMiddleware } from './common/middlewares/jwt.middleware';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://anuwattechs:X9oXgn48msewFdBz@cluster0.zbjcl.mongodb.net/GolfMatchingV1_DEV',
    ),
    CacheModule.register({ isGlobal: true }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).exclude('/users/login').forRoutes({
      path: '/users*',
      method: RequestMethod.ALL,
    });
  }
}
