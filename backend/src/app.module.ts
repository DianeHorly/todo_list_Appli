import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    // Rend les variables d'environnement accessibles dans toute l'application.
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Configure la connexion entre NestJS, Sequelize et MySQL.
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        dialect: 'mysql',
        host: configService.getOrThrow<string>('DB_HOST'),
        port: Number(configService.getOrThrow<string>('DB_PORT')),
        username: configService.getOrThrow<string>('DB_USER'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
        database: configService.getOrThrow<string>('DB_NAME'),

        // Permet aux modèles d'être chargés automatiquement depuis les modules.
        autoLoadModels: true,

        // Les futures modifications de la base seront gérées avec des migrations.
        synchronize: false,

        logging: false,
        retryAttempts: 5,
        retryDelay: 3000,
      }),
    }),

    UsersModule,

    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}