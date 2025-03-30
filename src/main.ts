import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './module/common/filters/http-exception/http-exception.filter';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { Server } from 'http';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3001;
  const apiUrl = configService.get<string>('API_URL');

  const config = new DocumentBuilder()
    .setTitle('Social Media Metrics API')
    .setDescription('API for managing Facebook and Instagram comments')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(apiUrl)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
}
bootstrap();

export default server;
