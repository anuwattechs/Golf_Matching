import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './app/common/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix(process.env.API_PREFIX || '/api');
  app.useGlobalInterceptors(new ResponseInterceptor(new Reflector()));
  await app.listen(3000);
}
bootstrap();
