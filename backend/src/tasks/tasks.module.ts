import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { Task } from './models/task.model';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

@Module({
  imports: [
    // J'enregistre le modèle Task afin que Sequelize puisse
    // accéder à la table des tâches depuis ce module.
    SequelizeModule.forFeature([Task]),
  ],

  // J'exporte SequelizeModule pour permettre aux futurs services d'utiliser ce modèle.
  exports: [SequelizeModule],

  providers: [TasksService],

  controllers: [TasksController],
})
export class TasksModule { }
