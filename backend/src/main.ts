import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Autorise le frontend Nuxt à communiquer avec l'API NestJS
    // lorsqu'ils fonctionnent sur deux ports différents.
    app.enableCors({
        origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

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