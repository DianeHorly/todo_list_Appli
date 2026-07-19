import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // J'utilise la stratégie JWT afin d'autoriser uniquement
  // les utilisateurs possédant un token valide.
}