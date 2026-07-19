import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { User } from '../../users/models/user.model';

@Table({
  tableName: 'tasks',

  // J'active les timestamps afin que Sequelize conserve automatiquement
  // la date de création et la date de modification de chaque tâche.
  timestamps: true,

  // J'utilise le format snake_case dans la base de données
  // pour obtenir notamment user_id et created_at.
  underscored: true,
})
export class Task extends Model {
  // Je définis un identifiant unique afin de pouvoir retrouver,
  // modifier ou supprimer précisément une tâche.
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  // Le titre est obligatoire afin que l'utilisateur puisse identifier rapidement
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare title: string;

  // Une nouvelle tâche est automatiquement considérée comme non terminée.
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare completed: boolean;

  // Je conserve l'identifiant du propriétaire afin que chaque utilisateur
  // puisse uniquement accéder à ses propres tâches.
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare userId: number;

  // Cette relation permet à Sequelize de savoir
  // qu'une tâche appartient à un utilisateur.
  @BelongsTo(() => User)
  declare user: User;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}