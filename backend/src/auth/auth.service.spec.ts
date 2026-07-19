import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';

import { User } from '../users/models/user.model';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    // J'injecte le modèle User afin de rechercher et créer
    // les utilisateurs dans la base de données.
    @InjectModel(User)
    private readonly userModel: typeof User,

    // J'utilise JwtService afin de générer le token
    // après la création ou la connexion de l'utilisateur.
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const email = registerDto.email.trim().toLowerCase();
    const emailConfirmation = registerDto.emailConfirmation
      .trim()
      .toLowerCase();

    // Je vérifie les deux emails afin d'éviter
    // la création d'un compte avec une adresse mal saisie.
    if (email !== emailConfirmation) {
      throw new BadRequestException(
        'Les deux adresses email ne correspondent pas.',
      );
    }

    // Je vérifie également que les deux mots de passe sont identiques.
    if (registerDto.password !== registerDto.passwordConfirmation) {
      throw new BadRequestException(
        'Les deux mots de passe ne correspondent pas.',
      );
    }

    const existingUser = await this.userModel.findOne({
      where: { email },
    });

    // Je refuse l'inscription si cette adresse email
    // appartient déjà à un compte existant.
    if (existingUser) {
      throw new ConflictException(
        'Un compte existe déjà avec cette adresse email.',
      );
    }

    // Je hache le mot de passe avant son enregistrement
    // afin de ne jamais le conserver en clair dans MySQL.
    const passwordHash = await bcrypt.hash(registerDto.password, 12);

    const user = await this.userModel.create({
      firstName: registerDto.firstName.trim(),
      lastName: registerDto.lastName.trim(),
      email,
      passwordHash,
    });

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    // Je sélectionne uniquement les informations publiques
    // afin de ne jamais retourner le mot de passe haché.
    return {
      accessToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }
}