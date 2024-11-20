import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import { MyLoggerService } from './logger/logger.service';
import { dynamicImport } from './common/tools';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(MyLoggerService));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // any fields not in list will be stripped
      forbidNonWhitelisted: true, // any fields not in list will cause 400
      transform: true, // transform the payload to expected type or custom class(dto)
    }),
  );
  app.use(helmet());
  app.use(compression());

  const adminJSModule = await dynamicImport('adminjs');
  const AdminJS = adminJSModule.default;
  const AdminJSTypeorm = await dynamicImport('@adminjs/typeorm');

  AdminJS.registerAdapter({
    Resource: AdminJSTypeorm.Resource,
    Database: AdminJSTypeorm.Database,
  });
  await app.listen(3000);
}
bootstrap();
