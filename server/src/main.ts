import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './app/common/interceptors';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix(process.env.API_PREFIX || '/api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // automatically transform payloads to DTO instances
      whitelist: true, // strips properties not defined in DTOs
      forbidNonWhitelisted: true, // throws an error if non-whitelisted properties are found
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor(new Reflector()));
  await app.listen(3000);
}
bootstrap();
