'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Je crée d'abord la table users, car chaque tâche devra
    // obligatoirement appartenir à un utilisateur.
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      first_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      last_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      // Je rends l'email unique afin d'empêcher la création
      // de plusieurs comptes avec la même adresse.
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },

      // Je stocke uniquement le mot de passe haché.
      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Je crée ensuite la table tasks qui dépend de la table users.
    await queryInterface.createTable('tasks', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      // Une nouvelle tâche est considérée comme non terminée par défaut.
      completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      // Cette clé étrangère permet d'associer chaque tâche
      // à son propriétaire et de séparer les données des utilisateurs.
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // index permettant de retrouver plus rapidement
    // toutes les tâches appartenant à un utilisateur.
    await queryInterface.addIndex('tasks', ['user_id'], {
      name: 'tasks_user_id_index',
    });
  },

  async down(queryInterface) {
    // Je supprime d'abord tasks car cette table dépend de users.
    await queryInterface.removeIndex('tasks', 'tasks_user_id_index');
    await queryInterface.dropTable('tasks');
    await queryInterface.dropTable('users');
  },
};