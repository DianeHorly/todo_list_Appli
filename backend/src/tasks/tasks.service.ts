import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './models/task.model';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFilterDto, TaskStatusFilter } from './dto/task-filter.dto';

@Injectable()
export class TasksService {
    constructor(
        // J'injecte le modèle Task afin de pouvoir enregistrer
        // et consulter les tâches dans la base de données.
        @InjectModel(Task)
        private readonly taskModel: typeof Task,
    ) { }

    async create(userId: number, createTaskDto: CreateTaskDto) {
        // J'associe directement la nouvelle tâche à l'utilisateur connecté
        // afin qu'elle ne puisse pas appartenir à un autre utilisateur.
        const task = await this.taskModel.create({
            title: createTaskDto.title,
            completed: false,
            userId,
        });

        return task;
    }

    async findAll(userId: number, filterDto: TaskFilterDto) {
        // Recherche de toutes les tâches appartenant à l'utilisateur connecté
        const where: {
            userId: number;
            completed?: boolean;
        } = {
            userId,
        };

        // Ajout du statut seulement lorsqu'un filtre précis est demandé.
        if (filterDto.status === TaskStatusFilter.TODO) {
            where.completed = false;
        }

        if (filterDto.status === TaskStatusFilter.COMPLETED) {
            where.completed = true;
        }

        return this.taskModel.findAll({
            where,

            //  Je trie les tâches par date de création afin que les plus récentes apparaissent en premier.
            order: [['createdAt', 'DESC']],
        });
    }

    async update(
        userId: number,
        taskId: number,
        updateTaskDto: UpdateTaskDto,
    ) {
        // Recherche de la tâche avec son identifiant et celui de l'utilisateur
        // afin d'empêcher la modification d'une tâche appartenant à une autre personne.
        const task = await this.taskModel.findOne({
            where: {
                id: taskId,
                userId,
            },
        });

        if (!task) {
            throw new NotFoundException('Tâche introuvable.');
        }

        // modification du titre uniquement lorsqu'il est présent dans la requête.
        if (updateTaskDto.title !== undefined) {
            task.title = updateTaskDto.title;
        }

        // modification du statut uniquement lorsqu'il est présent dans la requête.
        if (updateTaskDto.completed !== undefined) {
            task.completed = updateTaskDto.completed;
        }

        await task.save();

        return task;
    }

    async remove(userId: number, taskId: number) {
        // recherche d'une tâche avec son identifiant et celui de l'utilisateur
        // afin d'empêcher la suppression de la tâche d'une autre personne.
        const task = await this.taskModel.findOne({
            where: {
                id: taskId,
                userId,
            },
        });

        if (!task) {
            throw new NotFoundException('Tâche introuvable.');
        }

        // Suppression uniquement de la tâche qui appartient
        // à l'utilisateur actuellement connecté.
        await task.destroy();

        return {
            message: 'La tâche a été supprimée avec succès.',
        };
    }
}