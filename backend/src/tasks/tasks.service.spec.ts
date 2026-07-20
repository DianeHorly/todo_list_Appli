import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';

import { Task } from './models/task.model';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;

  // Je simule le modèle Task afin de tester le service
  // sans utiliser la véritable base de données MySQL.
  const taskModelMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken(Task),
          useValue: taskModelMock,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('doit être défini', () => {
    expect(service).toBeDefined();
  });
});