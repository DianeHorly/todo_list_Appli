import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';

type JwtExpiration = '1h';

@Module({
  imports: [
    UsersModule,

    // Je configure Passport afin de pouvoir protéger ensuite
    // les routes avec une stratégie d'authentification JWT.
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    // Je configure JWT avec la clé privée présente dans le fichier .env.
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),

        signOptions: {
          expiresIn:
            configService.getOrThrow<JwtExpiration>('JWT_EXPIRES_IN'),
        },
      }),
    }),
  ],
  controllers: [AuthController],

  //J'enregistre JwtStrategy afin que Passport puisse
  // vérifier les tokens envoyés dans les futures routes protégées.
  providers: [AuthService, JwtStrategy],

  // J'exporte JwtModule afin de pouvoir l'utiliser
  // plus tard dans les autres parties de l'application.
  exports: [JwtModule, AuthService],
})
export class AuthModule { }