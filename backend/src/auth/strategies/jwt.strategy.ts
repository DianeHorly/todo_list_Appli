// importation des décorateurs et classes nécessaires à la création d'une stratégie Passport.
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// Définition de l'interface représentant le payload du JWT.
interface JwtPayload {
  sub: number;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // Je récupère le JWT dans l'en-tête Authorization de la requête HTTP.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // Je refuse automatiquement les tokens dont la durée est expirée.
      ignoreExpiration: false,

      // J'utilise la même clé secrète que celle ayant signé le token.
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  // Cette méthode permet de récupérer
  // les informations contenues dans le payload du JWT. 
  validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}