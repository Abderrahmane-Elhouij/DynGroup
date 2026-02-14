# Documentation Technique - Plateforme de Gamification de l'Education

## Table des matieres

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture du systeme](#architecture-du-systeme)
3. [Backend - Spring Boot](#backend---spring-boot)
4. [Frontend - Angular](#frontend---angular)
5. [Base de donnees](#base-de-donnees)
6. [Securite et authentification](#securite-et-authentification)
7. [API REST](#api-rest)
8. [Docker et deploiement](#docker-et-deploiement)
9. [Structure des fichiers](#structure-des-fichiers)

---

## Vue d'ensemble

La plateforme de gamification de l'education est une application web dediee a l'apprentissage de la **Dynamique des Groupes**. Elle combine des mecanismes de jeu (XP, niveaux, badges, classement) avec du contenu pedagogique structure pour motiver les apprenants.

### Technologies principales

| Composant | Technologie | Version |
|-----------|-------------|---------|
| Backend | Spring Boot | 3.3.0 |
| Frontend | Angular | 19 |
| UI | PrimeNG (Apollo Template) | 19 |
| CSS | Tailwind CSS | 3 |
| Base de donnees | PostgreSQL | 16 |
| Migrations | Liquibase | - |
| Authentification | JWT (JJWT) | 0.12.5 |
| Conteneurisation | Docker / Docker Compose | - |
| Build Backend | Maven | - |
| Build Frontend | Node.js | 20 |
| Serveur Web | Nginx | Alpine |
| Java | OpenJDK | 17 |

---

## Architecture du systeme

L'application suit une architecture client-serveur classique a trois niveaux :

```
┌─────────────────┐     ┌──────────────────┐     ┌───────────────┐
│   Frontend      │────>│    Backend       │────>│  PostgreSQL   │
│   Angular 19    │     │  Spring Boot 3.3 │     │      16       │
│   (Nginx)       │<────│  (REST API)      │<────│               │
│   Port 4200     │     │  Port 8080       │     │  Port 5432    │
└─────────────────┘     └──────────────────┘     └───────────────┘
```

### Communication

- Le frontend communique avec le backend via des appels HTTP REST au prefixe `/api/`
- Nginx sert les fichiers statiques Angular et fait du reverse proxy vers le backend pour les requetes `/api/`
- L'authentification utilise des tokens JWT transmis dans le header `Authorization: Bearer <token>`

---

## Backend - Spring Boot

### Structure des packages

```
backend.project.backend_project/
├── BackendProjectApplication.java       # Point d'entree
├── config/
│   └── SecurityConfig.java              # Configuration Spring Security
├── controller/                          # Controleurs REST
│   ├── AuthController.java              # /api/auth/**
│   ├── CourseController.java            # /api/courses/**
│   ├── DashboardController.java         # /api/dashboard, /api/leaderboard
│   ├── LessonController.java            # /api/lessons/**
│   └── QuizController.java             # /api/quizzes/**
├── dto/                                 # Objets de transfert
│   ├── AuthResponse.java
│   ├── BadgeDTO.java
│   ├── ChapterDTO.java
│   ├── CourseDTO.java / CourseDetailDTO.java
│   ├── DashboardDTO.java
│   ├── LeaderboardEntryDTO.java
│   ├── LessonDTO.java / LessonSummaryDTO.java
│   ├── LoginRequest.java / RegisterRequest.java
│   ├── QuizDTO.java / QuestionDTO.java / OptionDTO.java
│   ├── QuizSubmission.java / QuizResultDTO.java
│   ├── QuizSummaryDTO.java
│   └── UserDTO.java
├── entity/                              # Entites JPA
│   ├── User.java, Course.java, Chapter.java, Lesson.java
│   ├── Quiz.java, QuizQuestion.java, QuizOption.java
│   ├── UserProgress.java, UserQuizAttempt.java, UserCourseEnrollment.java
│   ├── Badge.java, UserBadge.java
│   └── Enums: Role, Difficulte, TypeContenu, TypeQuestion, StatutProgression
├── exception/
│   └── GlobalExceptionHandler.java      # Gestion centralisee des erreurs
├── repository/                          # Repositories JPA
│   ├── 11 interfaces Repository
├── security/
│   ├── JwtTokenProvider.java            # Generation/validation JWT
│   ├── JwtAuthenticationFilter.java     # Filtre d'authentification
│   └── CustomUserDetailsService.java    # Chargement utilisateur
└── service/                             # Logique metier
    ├── AuthService.java                 # Inscription, connexion, profil
    ├── CourseService.java               # Catalogue, detail, inscription
    ├── LessonService.java              # Contenu, completion
    ├── QuizService.java                 # Questions, soumission
    ├── GamificationService.java        # XP, niveaux, badges
    └── DashboardService.java            # Tableau de bord, classement
```

### Configuration (application.yaml)

| Propriete | Description | Valeur par defaut |
|-----------|-------------|-------------------|
| `spring.datasource.url` | URL PostgreSQL | `jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}` |
| `spring.jpa.hibernate.ddl-auto` | Mode DDL | `validate` |
| `spring.liquibase.change-log` | Chemin changelog | `classpath:db/changelog/db.changelog-master.yaml` |
| `jwt.secret` | Cle secrete JWT | Variable d'environnement `JWT_SECRET` |
| `jwt.expiration` | Duree token | 86400000 ms (24h) |
| `server.port` | Port serveur | 8080 |

### Logique de gamification

Le service `GamificationService` gere les mecanismes de jeu :

- **XP** : Chaque lecon completee rapporte un montant d'XP defini. Les quiz rapportent un XP proportionnel au score.
- **Niveaux** : 100 XP par niveau. Le niveau est calcule comme `xpTotal / 100 + 1`.
- **Badges** : Attribues automatiquement lors de certaines etapes (nombre de lecons, niveau atteint, quiz parfait, nombre d'inscriptions).
- **Progression** : Calculee par cours en fonction des lecons terminees.

---

## Frontend - Angular

### Structure des composants

```
src/app/
├── layout/
│   ├── components/
│   │   ├── app.layout.ts          # Layout principal (sidebar + topbar + content)
│   │   ├── app.topbar.ts          # Barre superieure
│   │   ├── app.menu.ts            # Menu de navigation lateral
│   │   ├── app.profilesidebar.ts  # Panneau profil utilisateur
│   │   └── app.configurator.ts    # Configurateur de theme
│   └── service/
│       └── layout.service.ts      # Service de gestion du layout
├── pages/
│   ├── auth/
│   │   ├── auth.service.ts        # Service d'authentification
│   │   ├── auth.guard.ts          # Guard de protection des routes
│   │   ├── auth.interceptor.ts    # Intercepteur HTTP pour JWT
│   │   ├── auth.routes.ts         # Routes d'authentification
│   │   ├── login.ts               # Page de connexion
│   │   └── register.ts            # Page d'inscription
│   ├── dashboards/
│   │   └── gamification-dashboard.ts  # Tableau de bord principal
│   ├── cours/
│   │   ├── cours-list.ts          # Catalogue des cours
│   │   └── cours-detail.ts        # Detail d'un cours
│   ├── lecons/
│   │   └── lecon-view.ts          # Vue d'une lecon
│   ├── quiz/
│   │   └── quiz-play.ts           # Interface de quiz
│   ├── classement/
│   │   └── classement.ts          # Classement des apprenants
│   └── profil/
│       └── profil.ts              # Page de profil utilisateur
└── services/
    ├── course.service.ts           # Service API des cours
    ├── lesson.service.ts           # Service API des lecons
    ├── quiz.service.ts             # Service API des quiz
    └── dashboard.service.ts        # Service API tableau de bord
```

### Routing

| Route | Composant | Protection |
|-------|-----------|------------|
| `/` | `GamificationDashboard` | `authGuard` |
| `/cours` | `CoursList` | `authGuard` |
| `/cours/:id` | `CoursDetail` | `authGuard` |
| `/lecons/:id` | `LeconView` | `authGuard` |
| `/quiz/:id` | `QuizPlay` | `authGuard` |
| `/classement` | `Classement` | `authGuard` |
| `/profil` | `Profil` | `authGuard` |
| `/auth/login` | `Login` | Public |
| `/auth/register` | `Register` | Public |

### Alias de chemin

Le `tsconfig.json` definit l'alias `@/*` qui pointe vers `src/app/*`, permettant des imports propres comme `import { AuthService } from '@/pages/auth/auth.service'`.

---

## Base de donnees

### Schema relationnel

Les migrations Liquibase definissent 12 tables :

| Table | Description |
|-------|-------------|
| `users` | Utilisateurs (etudiants, enseignants, admins) |
| `courses` | Cours disponibles |
| `chapters` | Chapitres d'un cours |
| `lessons` | Lecons d'un chapitre |
| `quizzes` | Quiz lies a un cours |
| `quiz_questions` | Questions d'un quiz |
| `quiz_options` | Options de reponse d'une question |
| `user_progress` | Progression par lecon |
| `user_quiz_attempts` | Tentatives de quiz |
| `user_course_enrollments` | Inscriptions aux cours |
| `badges` | Badges disponibles |
| `user_badges` | Badges obtenus par utilisateur |

### Migrations Liquibase

| Fichier | Contenu |
|---------|---------|
| `001-create-users-table.yaml` | Table utilisateurs avec roles et XP |
| `002-create-courses-table.yaml` | Table des cours |
| `003-create-chapters-table.yaml` | Table des chapitres |
| `004-create-lessons-table.yaml` | Table des lecons |
| `005-create-quizzes-tables.yaml` | Tables quiz, questions, options |
| `006-create-progress-tables.yaml` | Tables progression, tentatives, inscriptions |
| `007-create-badges-tables.yaml` | Tables badges |
| `008-insert-initial-data.yaml` | Donnees initiales (4 cours, 10 lecons, 2 quiz, 6 badges) |

---

## Securite et authentification

### Flux d'authentification

1. L'utilisateur s'inscrit ou se connecte via `/api/auth/register` ou `/api/auth/login`
2. Le serveur genere un token JWT signe avec une cle HMAC-SHA
3. Le token est stocke cote client dans `localStorage`
4. Chaque requete subsequente inclut le token dans le header `Authorization: Bearer <token>`
5. Le filtre `JwtAuthenticationFilter` valide le token et charge l'utilisateur
6. Le guard Angular `authGuard` verifie la presence du token avant d'autoriser l'acces aux routes protegees

### Endpoints publics

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/courses` - Liste des cours
- `GET /api/courses/{id}` - Detail d'un cours
- `GET /api/leaderboard` - Classement

### Configuration CORS

Le backend autorise les requetes depuis `http://localhost:4200` avec les methodes GET, POST, PUT, DELETE et le header Authorization.

---

## API REST

### Authentification

| Methode | Endpoint | Description | Corps |
|---------|----------|-------------|-------|
| POST | `/api/auth/register` | Inscription | `{ nom, prenom, email, motDePasse }` |
| POST | `/api/auth/login` | Connexion | `{ email, motDePasse }` |
| GET | `/api/auth/profile` | Profil utilisateur | - |

### Cours

| Methode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/courses` | Liste de tous les cours |
| GET | `/api/courses/{id}` | Detail d'un cours avec chapitres et lecons |
| POST | `/api/courses/{id}/enroll` | S'inscrire a un cours |

### Lecons

| Methode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/lessons/{id}` | Contenu d'une lecon |
| POST | `/api/lessons/{id}/complete` | Marquer une lecon comme terminee |

### Quiz

| Methode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/quizzes/{id}` | Questions d'un quiz |
| POST | `/api/quizzes/{id}/submit` | Soumettre les reponses |

### Tableau de bord

| Methode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/dashboard` | Statistiques de l'utilisateur |
| GET | `/api/leaderboard` | Classement (top 20) |

---

## Docker et deploiement

### Services Docker Compose

| Service | Image | Port | Description |
|---------|-------|------|-------------|
| `db` | `postgres:16-alpine` | 5432 | Base de donnees PostgreSQL |
| `backend` | Build personnalise | 8080 | API Spring Boot |
| `frontend` | Build personnalise | 4200 | Angular via Nginx |

### Dockerfiles

**Backend** : Build multi-etapes avec `eclipse-temurin:17-jdk-alpine` (compilation Maven) et `eclipse-temurin:17-jre-alpine` (execution).

**Frontend** : Build multi-etapes avec `node:20-alpine` (compilation Angular) et `nginx:alpine` (serveur web).

### Nginx

Le fichier `nginx.conf` configure :
- Le service des fichiers statiques Angular
- Le routing SPA (redirection vers `index.html`)
- Le reverse proxy `/api/` vers `backend:8080`

### Variables d'environnement

| Variable | Service | Description |
|----------|---------|-------------|
| `DB_HOST` | Backend | Hote PostgreSQL |
| `DB_PORT` | Backend | Port PostgreSQL |
| `DB_NAME` | Backend | Nom de la base |
| `DB_USERNAME` | Backend | Utilisateur PostgreSQL |
| `DB_PASSWORD` | Backend | Mot de passe PostgreSQL |
| `JWT_SECRET` | Backend | Cle secrete JWT |
| `POSTGRES_DB` | DB | Nom de la base a creer |
| `POSTGRES_USER` | DB | Utilisateur admin |
| `POSTGRES_PASSWORD` | DB | Mot de passe admin |

---

## Structure des fichiers

```
group_project/
├── docker-compose.yml
├── backend_project/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── pom.xml
│   └── src/main/
│       ├── java/backend/project/backend_project/
│       │   ├── config/         # SecurityConfig
│       │   ├── controller/     # 5 controleurs REST
│       │   ├── dto/            # 18 DTOs
│       │   ├── entity/         # 12 entites + 5 enums
│       │   ├── exception/      # GlobalExceptionHandler
│       │   ├── repository/     # 11 repositories
│       │   ├── security/       # JWT + UserDetailsService
│       │   └── service/        # 6 services metier
│       └── resources/
│           ├── application.yaml
│           └── db/changelog/   # 8 fichiers migration + master
├── frontend_project/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── nginx.conf
│   ├── package.json
│   └── src/app/
│       ├── layout/             # Composants et service de layout
│       ├── pages/              # Pages de l'application
│       └── services/           # Services API
└── docs/
    ├── documentation-technique.md
    ├── documentation-fonctionnelle.md
    └── guide-de-lancement.md
```
