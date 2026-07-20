import { IsEnum, IsOptional } from 'class-validator';

export enum TaskStatusFilter {
    ALL = 'all',
    TODO = 'todo',
    COMPLETED = 'completed',
}

export class TaskFilterDto {
    // Je rends le filtre facultatif afin d'afficher toutes les tâches
    // lorsqu'aucune valeur n'est envoyée dans l'URL.
    @IsOptional()
    @IsEnum(TaskStatusFilter, {
        message: 'Le filtre doit être all, todo ou completed.',
    })
    status: TaskStatusFilter = TaskStatusFilter.ALL;
}