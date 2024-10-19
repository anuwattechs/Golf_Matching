import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './app/common/interceptors';
import { ValidationPipe } from '@nestjs/common';
import { LoggingService } from './core/logging/logging.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: new LoggingService(),
  });

  const loggingService = new LoggingService(); // Create an instance of LoggingService
  app.setGlobalPrefix(process.env.API_PREFIX || '/api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new ResponseInterceptor(new Reflector(), loggingService),
  );
  await app.listen(3000);
}
bootstrap();
