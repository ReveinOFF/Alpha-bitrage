import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: ['http://localhost:5000', 'http://localhost:3000'],
    credentials: true,
  });
  app.setGlobalPrefix('api');

  const port = process.env.APP_PORT || 5000;
  await app.listen(port, () => console.log('Server started on port ' + port));
}

bootstrap();
