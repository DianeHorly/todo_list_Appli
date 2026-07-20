import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';

import { User } from '../users/models/user.model';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  // Je simule le modèle User afin de ne pas utiliser
  // la véritable base de données pendant les tests.
  const userModelMock = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  // Je simule également la génération du token JWT.
  const jwtServiceMock = {
    sign: jest.fn(),
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User),
          useValue: userModelMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('doit être défini', () => {
    expect(service).toBeDefined();
  });
});