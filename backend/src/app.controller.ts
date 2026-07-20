import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }
  // Route de test pour vérifier que le serveur fonctionne correctement.
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
