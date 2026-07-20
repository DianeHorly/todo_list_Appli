// importation des décorateurs et des classes nécessaires pour créer un contrôleur dans NestJS.
import {
    Body,
    Controller,
    Get,
    Post,
    Param,
    ParseIntPipe,
    Patch,
    Delete,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';

interface AuthenticatedRequest extends Request {
    user: {
        id: number;
        email: string;
    };
}

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    // Je protège cette route afin que seule une personne connectée
    // puisse créer une tâche.
    @Post()
    create(
        @Req() request: AuthenticatedRequest,
        @Body() createTaskDto: CreateTaskDto,
    ) {
        // Je récupère l'identifiant contenu dans le JWT afin
        // d'associer automatiquement la tâche à son propriétaire.
        return this.tasksService.create(request.user.id, createTaskDto);
    }

    // Je protège cette route afin que seule une personne connectée
    // puisse consulter ses propres tâches.
    @Get()
    findAll(
        @Req() request: AuthenticatedRequest,
        @Query() filterDto: TaskFilterDto,
    ) {
        return this.tasksService.findAll(request.user.id, filterDto);
    }

    // Recupération de l'identifiant de la tâche dans l'URL 
    // et de l'identifiant de l'utilisateur dans le JWT afin securiser la modification de la tâche.   
    @Patch(':id')
    update(
        @Req() request: AuthenticatedRequest,
        @Param('id', ParseIntPipe) taskId: number,
        @Body() updateTaskDto: UpdateTaskDto,
    ) {
        return this.tasksService.update(
            request.user.id,
            taskId,
            updateTaskDto,
        );
    }

    // Recupération de l'identifiant de la tâche dans l'URL  et de l'identifiant de l'utilisateur dans le JWT 
    // afin de supprimer uniquement la tâche qui lui appartient.
    @Delete(':id')
    remove(
        @Req() request: AuthenticatedRequest,
        @Param('id', ParseIntPipe) taskId: number,
    ) {
        return this.tasksService.remove(request.user.id, taskId);
    }
}