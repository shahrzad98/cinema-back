import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Define allowed origins
  const allowedOrigins = [
    'https://cinema-front-8c81b73c37-cinema-app.apps.ir-central1.arvancaas.ir',
    'http://localhost:3000',
  ];

  // Add origins from environment variable if present
  const envOrigins = (process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  app.enableCors({
    origin: [...allowedOrigins, ...envOrigins],
    credentials: true,
  });

  const port = Number(process.env.PORT || 4000);
  await app.listen(port, '0.0.0.0');
}
bootstrap();
