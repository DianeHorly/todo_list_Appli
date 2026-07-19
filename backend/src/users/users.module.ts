import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize/dist/sequelize.module';
import { User } from './models/user.model';

@Module({
   imports: [
    // Enregistrement du modèle User dans ce module afin que
    // Sequelize puisse l'utiliser pour accéder à la table users.
    SequelizeModule.forFeature([User]),
   ],
   exports: [SequelizeModule], 
})
export class UsersModule {}
