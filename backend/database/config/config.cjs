const path = require('path');

// Je charge le fichier backend/.env afin que sequelize-cli
// utilise les mêmes paramètres de connexion que NestJS.
require('dotenv').config({
  path: path.resolve(__dirname, '..', '..', '.env'),
});

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'mysql',
  },
};