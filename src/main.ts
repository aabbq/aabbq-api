import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST',
    preflightContinue: false,
    optionsSuccessStatus: 204
  });
  app.setGlobalPrefix('aabbq-api');
  await app.listen(3000);
}
bootstrap();
