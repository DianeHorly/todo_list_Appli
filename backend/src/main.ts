import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // J'active la validation globale afin que toutes les données reçues
  // soient contrôlées à partir des règles définies dans les DTO.
  app.useGlobalPipes(
    new ValidationPipe({
      // Je refuse les propriétés qui ne sont pas prévues dans le DTO.
      whitelist: true,
      forbidNonWhitelisted: true,

      // Je transforme les données reçues en instances des classes DTO.
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();