# Guide de Lancement - Plateforme de Gamification de l'Education

## Table des matieres

1. [Prerequis](#prerequis)
2. [Lancement avec Docker Compose](#lancement-avec-docker-compose)
3. [Lancement en mode developpement](#lancement-en-mode-developpement)
4. [Acces a l'application](#acces-a-lapplication)
5. [Donnees initiales](#donnees-initiales)
6. [Configuration avancee](#configuration-avancee)
7. [Depannage](#depannage)
8. [Arret des services](#arret-des-services)

---

## Prerequis

### Pour le lancement avec Docker (recommande)

| Logiciel | Version minimale | Verification |
|----------|-----------------|--------------|
| Docker | 20.10+ | `docker --version` |
| Docker Compose | 2.0+ | `docker compose version` |

### Pour le lancement en mode developpement

| Logiciel | Version minimale | Verification |
|----------|-----------------|--------------|
| Java JDK | 17 | `java -version` |
| Maven | 3.8+ | `mvn -version` |
| Node.js | 20+ | `node -v` |
| npm | 9+ | `npm -v` |
| PostgreSQL | 16 | `psql --version` |

---

## Lancement avec Docker Compose

### Etape 1 : Cloner le projet

```bash
git clone <url-du-depot> group_project
cd group_project
```

### Etape 2 : Lancer tous les services

Depuis la racine du projet :

```bash
docker compose up --build
```

Cette commande va :
1. Creer et demarrer une base de donnees PostgreSQL 16
2. Compiler et demarrer le backend Spring Boot
3. Compiler et demarrer le frontend Angular dans un conteneur Nginx

Le premier lancement peut prendre plusieurs minutes le temps de telecharger les images Docker et de compiler les projets.

### Etape 3 : Verifier le demarrage

Attendre que les logs affichent :
- Pour le backend : `Started BackendProjectApplication`
- Pour le frontend : Le conteneur Nginx demarre sans erreur

### Etape 4 : Acceder a l'application

Ouvrir un navigateur et aller sur : **http://localhost:4200**

---

## Lancement en mode developpement

### Etape 1 : Demarrer PostgreSQL

Si PostgreSQL est installe localement :

```bash
# Creer la base de donnees
createdb gamification_db
```

Ou avec Docker uniquement pour la base de donnees :

```bash
docker run -d \
  --name gamification-db \
  -p 5432:5432 \
  -e POSTGRES_DB=gamification_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  postgres:16-alpine
```

### Etape 2 : Demarrer le backend

```bash
cd backend_project

# Definir les variables d'environnement
# Sur Linux/Mac :
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=gamification_db
export DB_USERNAME=postgres
export DB_PASSWORD=postgres
export JWT_SECRET=ma_cle_secrete_tres_longue_pour_jwt_256_bits_minimum

# Sur Windows PowerShell :
$env:DB_HOST="localhost"
$env:DB_PORT="5432"
$env:DB_NAME="gamification_db"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="postgres"
$env:JWT_SECRET="ma_cle_secrete_tres_longue_pour_jwt_256_bits_minimum"

# Compiler et lancer
./mvnw spring-boot:run
```

Le backend demarre sur le port **8080**. Les migrations Liquibase s'executent automatiquement au demarrage et creent les tables et les donnees initiales.

### Etape 3 : Demarrer le frontend

Dans un nouveau terminal :

```bash
cd frontend_project

# Installer les dependances (uniquement la premiere fois)
npm install

# Demarrer le serveur de developpement
npm start
```

Le frontend demarre sur le port **4200** avec rechargement automatique.

**Note** : En mode developpement, le proxy Angular doit etre configure pour rediriger les requetes `/api/` vers le backend. Si necessaire, creer un fichier `proxy.conf.json` :

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false
  }
}
```

Puis modifier `angular.json` pour ajouter l'option proxy :

```json
"serve": {
  "options": {
    "proxyConfig": "proxy.conf.json"
  }
}
```

---

## Acces a l'application

### URLs

| Service | URL |
|---------|-----|
| Application (frontend) | http://localhost:4200 |
| API REST (backend) | http://localhost:8080/api |
| Base de donnees | localhost:5432 |

### Premiere utilisation

1. Ouvrir http://localhost:4200
2. Cliquer sur "Creer un compte" sur la page de connexion
3. Remplir le formulaire d'inscription (nom, prenom, email, mot de passe)
4. Vous serez redirige vers le tableau de bord

### Compte de test

Les donnees initiales incluent un utilisateur de test :

| Champ | Valeur |
|-------|--------|
| Email | `admin@example.com` |
| Mot de passe | `admin123` |
| Role | Administrateur |

---

## Donnees initiales

Au premier demarrage, Liquibase insere automatiquement les donnees suivantes :

### Cours

| Cours | Difficulte | Duree |
|-------|-----------|-------|
| Introduction a la Dynamique des Groupes | Debutant | 8h |
| Communication et Leadership dans les Groupes | Intermediaire | 10h |
| Gestion des Conflits de Groupe | Avance | 12h |
| Techniques d'Animation de Groupe | Intermediaire | 6h |

### Contenu

- **9 chapitres** repartis dans les cours
- **10 lecons** avec contenu detaille sur la Dynamique des Groupes
- **2 quiz** avec 5 questions au total (choix unique et multiple)
- **6 badges** a debloquer

### Badges disponibles

| Badge | Condition |
|-------|-----------|
| Premiere Lecon | Completer 1 lecon |
| Etudiant Assidu | Completer 5 lecons |
| Expert | Completer 10 lecons |
| Niveau 5 | Atteindre le niveau 5 |
| Quiz Parfait | Obtenir 100% a un quiz |
| Explorateur | S'inscrire a 3 cours |

---

## Configuration avancee

### Variables d'environnement du backend

| Variable | Description | Valeur par defaut |
|----------|-------------|-------------------|
| `DB_HOST` | Hote de la base de donnees | `localhost` |
| `DB_PORT` | Port PostgreSQL | `5432` |
| `DB_NAME` | Nom de la base | `gamification_db` |
| `DB_USERNAME` | Utilisateur PostgreSQL | `postgres` |
| `DB_PASSWORD` | Mot de passe PostgreSQL | `postgres` |
| `JWT_SECRET` | Cle de signature JWT (min. 256 bits) | Definie dans docker-compose |
| `JWT_EXPIRATION` | Duree de validite du token (ms) | `86400000` (24h) |

### Modifier le port du frontend

Dans `docker-compose.yml`, modifier le mapping de port :

```yaml
frontend:
  ports:
    - "3000:80"  # Changer 4200 par le port souhaite
```

### Modifier le port du backend

Dans `application.yaml` :

```yaml
server:
  port: 9090  # Changer le port
```

Ne pas oublier de mettre a jour la configuration nginx en consequence.

---

## Depannage

### La base de donnees ne demarre pas

**Symptome** : Erreur de connexion a PostgreSQL

**Solutions** :
1. Verifier que le port 5432 n'est pas deja utilise : `netstat -an | findstr 5432`
2. Verifier les logs Docker : `docker compose logs db`
3. Supprimer le volume et recommencer : `docker compose down -v && docker compose up --build`

### Le backend ne demarre pas

**Symptome** : Erreur au demarrage de Spring Boot

**Solutions** :
1. Verifier que PostgreSQL est accessible : `docker compose logs db`
2. Verifier les variables d'environnement
3. Verifier les logs du backend : `docker compose logs backend`
4. S'assurer que le JDK 17 est installe : `java -version`

### Le frontend affiche une page blanche

**Symptome** : La page ne se charge pas

**Solutions** :
1. Verifier la console du navigateur (F12) pour les erreurs JavaScript
2. Verifier que le backend est accessible : `curl http://localhost:8080/api/courses`
3. Verifier les logs Nginx : `docker compose logs frontend`

### Erreur CORS

**Symptome** : Requetes bloquees par le navigateur

**Solution** : Verifier que l'origine du frontend est bien autorisee dans `SecurityConfig.java`. Par defaut, `http://localhost:4200` est autorise.

### Erreur d'authentification

**Symptome** : Token invalide ou expire

**Solutions** :
1. Se deconnecter et se reconnecter
2. Vider le localStorage du navigateur
3. Verifier que la cle JWT est identique entre les redemarrages

### Les migrations Liquibase echouent

**Symptome** : Erreur lors de la creation des tables

**Solutions** :
1. Supprimer la base et la recreer : `docker compose down -v && docker compose up --build`
2. Verifier les checksums Liquibase : Les fichiers de migration ne doivent pas etre modifies apres execution

---

## Arret des services

### Avec Docker Compose

```bash
# Arreter les services (conserve les donnees)
docker compose down

# Arreter les services et supprimer les donnees
docker compose down -v

# Arreter les services, supprimer les donnees et les images
docker compose down -v --rmi all
```

### En mode developpement

1. Arreter le frontend : `Ctrl+C` dans le terminal du frontend
2. Arreter le backend : `Ctrl+C` dans le terminal du backend
3. Arreter PostgreSQL Docker : `docker stop gamification-db`
