import {
    BadRequestException,
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';

import { User } from '../users/models/user.model';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    // J'injecte le modèle User pour pouvoir rechercher
    // et enregistrer les utilisateurs dans MySQL.
    @InjectModel(User)
    private readonly userModel: typeof User,

    // J'utilise JwtService pour générer un token
    // après la création du compte.
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const email = registerDto.email.trim().toLowerCase();
    const emailConfirmation = registerDto.emailConfirmation
      .trim()
      .toLowerCase();

    // Je compare les deux adresses afin d'éviter
    // une inscription avec une adresse mal saisie.
    if (email !== emailConfirmation) {
      throw new BadRequestException(
        'Les deux adresses email ne correspondent pas.',
      );
    }

    if (registerDto.password !== registerDto.passwordConfirmation) {
      throw new BadRequestException(
        'Les deux mots de passe ne correspondent pas.',
      );
    }

    const existingUser = await this.userModel.findOne({
      where: { email },
    });

    // Je refuse la création lorsqu'un compte utilise déjà cet email.
    if (existingUser) {
      throw new ConflictException(
        'Un compte existe déjà avec cette adresse email.',
      );
    }

    // Je hache le mot de passe avant de l'enregistrer dans la base de données.
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

  async login(loginDto: LoginDto) {
  const email = loginDto.email.trim().toLowerCase();

  // Je recherche le compte à partir de l'adresse email normalisée.
  const user = await this.userModel.findOne({
    where: { email },
  });

  
  // Vérifie si une adresse email existe dans la base de données.
  if (!user) {
    throw new UnauthorizedException(
      'Adresse email ou mot de passe incorrect.',
    );
  }

  // Je compare le mot de passe saisi avec le hash enregistré
  const passwordIsValid = await bcrypt.compare(
    loginDto.password,
    user.passwordHash,
  );

  if (!passwordIsValid) {
    throw new UnauthorizedException(
      'Adresse email ou mot de passe incorrect.',
    );
  }

  const accessToken = await this.jwtService.signAsync({
    sub: user.id,
    email: user.email,
  });

  // Je retourne uniquement les informations utiles au frontend
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