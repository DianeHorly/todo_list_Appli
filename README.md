# Todo List App - Test technique Libheros

Ce projet consiste à développer une application web full-stack de gestion de tâches personnelles. Elle permet à chaque utilisateur de créer un compte, de se connecter et de gérer ses propres tâches tels que l'ajout, modification, changement de statut, suppression, recherche, filtrage et tri par date.

Pour réaliser cette application, j'ai utilisé Nuxt 4, Vue 3, TypeScript et Tailwind CSS pour le frontend, ainsi que NestJS, Sequelize et MySQL pour le backend. L'authentification est sécurisée avec JWT, Passport et bcrypt. Docker est utilisé pour la base de données, tandis que les tests sont réalisés avec Jest, Vitest et Vue Test Utils. Le projet est versionné avec Git et GitHub.

# 1. Fonctionnalités

## 1.1- Authentification

- Création de compte
- Confirmation de l'adresse e-mail
- Confirmation du mot de passe
- Connexion avec e-mail et mot de passe
- Authentification sécurisée avec JWT
- Hachage des mots de passe avec bcrypt
- Déconnexion
- Protection des pages avec des middlewares Nuxt

## 1.2- Gestion des tâches

- Création d'une tâche
- Affichage des tâches personnelles
- Modification du titre
- Marquage d'une tâche comme terminée
- Remise d'une tâche dans l'état << À faire >>
- Suppression avec demande de confirmation
- Affichage du statut et de la date de création
- Séparation des tâches par utilisateur

## 1.3- Filtres et recherche

- Affichage de toutes les tâches
- Affichage des tâches à faire
- Affichage des tâches terminées
- Recherche par titre
- Tri par date :
  - plus récentes ;
  - plus anciennes.

## 1.4- Interface

- Interface responsive
- Adaptation aux ordinateurs, tablettes et téléphones
- États de chargement
- Messages d'erreur et de succès
- Boutons désactivés pendant les traitements
- Composants Vue réutilisables

# 2. Technologies utilisées

## 2.1. Frontend

- Nuxt 4
- Vue 3
- TypeScript
- Tailwind CSS
- Vitest
- Vue Test Utils
- Nuxt Test Utils
- Happy DOM

## 2.2. Backend

- NestJS
- TypeScript
- Sequelize
- Sequelize TypeScript
- MySQL
- JWT
- Passport
- bcrypt
- class-validator

## 2.3. Environnement

- Docker
- Docker Compose
- Git
- GitHub

# 3. Prérequis

- installer Node.js 22
- installer npm
- installer Docker Desktop
- Installer Git

# 4. Installation

## 4.1. Cloner le dépôt

```bash
git clone https://github.com/DianeHorly/todo_list_Appli.git
cd todo_list_Appli
```

## 4.2. Configurer Docker et MySQL

Créer le fichier `.env`
à la racine à partir de .env.example et modifier le avec vos propres données.
Puis Démarrer MySQL avec

```bash
docker compose up -d
```

Ensuite vérifier le conteneur avec `docker ps`

# 5. Configuration du backend

- Placez-vous dans le dossier: `cd backend`

- Installez les dépendances: `npm install`

- Créez le fichier `.env`
  à partir de backend/.env.example et modifiez le avec vos données
- Exécutez les migrations: `npx sequelize-cli db:migrate`

- Démarrez le backend: placez vous dans le dossier du backend puis executez la commande suivante `npm run start:dev`

- Une fois le backend demarré, vous pouvez accéder à l'API sur [http://localhost:3000](http://localhost:3000)

# 6. Configuration du frontend

- Ouvrez un autre terminal, puis executez cette commande `cd frontend`

- Installez les dépendances avec `npm install`

- Créez le fichier .env à partir de frontend/.env.example et modifiez le.
- Démarrez le frontend: `npm run dev`

- Une fois le frontend démarré, vous pouvez accéder à l'application via un navigateur avec [http://localhost:3001](http://localhost:3001)
- Effectuez les differents tests (inscription, connexion, ajout tache , ....)

# 7. Routes principales de l'API

## 7.1. Pour l'authentification

| Méthode | Route          | Description                  |
| ------- | -------------- | ---------------------------- |
| POST    | /auth/register | Créer un compte              |
| POST    | /auth/login    | Se connecter                 |
| GET     | /auth/profile  | Consulter le profil connecté |

## 7.2. Pour les Taches

| Méthode | Route                   | Description                   |
| ------- | ----------------------- | ----------------------------- |
| POST    | /tasks                  | Créer une tâche               |
| GET     | /tasks                  | Afficher les tâches           |
| GET     | /tasks?status=todo      | Afficher les tâches à faire   |
| GET     | /tasks?status=completed | Afficher les tâches terminées |
| PATCH   | /tasks/:id              | Modifier une tâche            |
| DELETE  | /tasks/:id              | Supprimer une tâche           |

# 8. Test de l'application

## 8.1. Tests du Backend

Saisissez les commandes suivantes:

```bash
cd backend
npm test -- --runInBand
```

## 8.2. Tests du frontend

Saisissez les commandes suivantes:

```bash
cd frontend
npm test
```

# 9. Compilation de production

## Backend

```bash
cd backend
npm run build
```

## Frondend

```bash
cd frontend
npm run build
```
