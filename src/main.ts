import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // any fields not in list will be stripped
      forbidNonWhitelisted: true, // any fields not in list will cause 400
      transform: true, // transform the payload to expected type or custom class
    }),
  );
  await app.listen(3000);
}
bootstrap();
