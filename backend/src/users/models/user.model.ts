import { 
  Column, 
  DataType,
  HasMany,
  Model, 
  Table 
} from 'sequelize-typescript';

import { Task } from '../../tasks/models/task.model';

@Table({
  tableName: 'users',

  /* activation du timestamps afin que Sequelize enregistre automatiquement
   les dates de création et de dernière modification de l'utilisateur.
  */
  timestamps: true,

  // J'utilise le format snake_case dans la base de données.
  underscored: true,
})
export class User extends Model {
  // définition d'un identifiant unique pour distinguer chaque utilisateur dans la base de données.
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  // Je rends le prénom obligatoire lors de la création de compte.
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare firstName: string;

  // Je rends également le nom obligatoire lors de la création de compte.
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare lastName: string;

  // Je rends l'adresse email unique afin d'empêcher
  // la création de plusieurs comptes avec le même email.
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
  })
  declare email: string;

  // Je stocke uniquement le mot de passe haché.
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare passwordHash: string;

  // permet d'indiquer qu'un utilisateur peut posséder plusieurs tâche.
  @HasMany(() => Task)
  declare tasks: Task[];
  
  // dates générées automatiquement grâce à l'option timestamps.
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}