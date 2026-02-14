# Guide de Demo - Plateforme Gamifiee de Dynamique des Groupes

Ce guide vous accompagne pour realiser une demonstration complete de toutes les fonctionnalites de la plateforme.

---

## Prerequis

Assurez-vous que l'application est lancee (voir [guide-de-lancement.md](guide-de-lancement.md)).

- **Frontend** : `http://localhost:4200`
- **Backend** : `http://localhost:8080`
- **Base de donnees** : PostgreSQL sur le port `5432`

---

## Donnees initiales (Seed Data)

La base de donnees est pre-remplie avec :

| Contenu | Details |
|---------|---------|
| **4 Cours** | Introduction a la dynamique des groupes (DEBUTANT), Communication et interactions (INTERMEDIAIRE), Leadership et prise de decision (INTERMEDIAIRE), Gestion des conflits (AVANCE) |
| **9 Chapitres** | Repartis sur les 4 cours |
| **10 Lecons** | Contenu textuel complet sur la dynamique des groupes |
| **2 Quiz** | Quiz "Definition d'un groupe" (3 questions), Quiz "Styles de leadership" (2 questions) |
| **6 Badges** | Premier pas, Etudiant assidu, Expert en herbe, Quiz master, Niveau 5, Explorateur |

> **Note** : Aucun compte utilisateur n'est pre-cree. Tous les comptes doivent etre crees via la page d'inscription.

---

## Scenario de Demo Complet

### Etape 1 : Inscription d'un premier etudiant

1. Ouvrir `http://localhost:4200`
2. Vous etes automatiquement redirige vers `/auth/login`
3. Cliquer sur **"Creer un compte"**
4. Remplir le formulaire :
   - **Prenom** : `Ahmed`
   - **Nom** : `Ben Ali`
   - **Email** : `ahmed@test.com`
   - **Mot de passe** : `password123`
5. Cliquer sur **"Creer mon compte"**
6. Vous etes redirige vers le **Tableau de bord**

**Points a observer :**
- XP Total : 0
- Niveau : 1
- Aucun cours inscrit
- Aucun badge

---

### Etape 2 : Explorer le Tableau de bord

Le tableau de bord affiche :
- **4 cartes statistiques** : XP Total, Niveau, Cours inscrits, Lecons terminees
- **Mes cours en cours** : vide au depart ("Aucun cours en cours")
- **Mes badges** : vide au depart ("Completez des lecons pour gagner des badges !")

---

### Etape 3 : Parcourir le catalogue des cours

1. Cliquer sur **"Cours"** dans le menu lateral
2. La page affiche les **4 cours disponibles** sous forme de cartes
3. Chaque carte montre :
   - Le titre du cours
   - La description
   - La difficulte (badge couleur : vert = DEBUTANT, orange = INTERMEDIAIRE, rouge = AVANCE)
   - Le nombre de chapitres et lecons
   - La duree estimee
4. Optionnel : utiliser la **barre de recherche** pour filtrer par nom
5. Optionnel : utiliser le **filtre par difficulte** (Tous, Debutant, Intermediaire, Avance)

---

### Etape 4 : S'inscrire a un cours

1. Cliquer sur **"Voir le cours"** sur la carte "Introduction a la dynamique des groupes"
2. La page de detail affiche :
   - Informations du cours (titre, description, difficulte, duree, nombre de chapitres/lecons)
   - Le bouton vert **"S'inscrire a ce cours"**
   - La liste des chapitres et leurs lecons (non cliquables tant que non inscrit)
3. Cliquer sur **"S'inscrire a ce cours"**
4. Un message de succes apparait : "Inscription reussie !"
5. Le bouton d'inscription est remplace par une **barre de progression** (0%)
6. Les lecons deviennent **cliquables** (curseur pointer, fleche visible)

**Points a observer :**
- La barre de progression passe de 0% au fur et a mesure de la completion des lecons
- Chaque lecon affiche une icone de statut : cercle gris (non terminee) ou coche verte (terminee)

---

### Etape 5 : Lire une lecon

1. Cliquer sur la premiere lecon : **"Definition d'un groupe restreint"**
2. La page de lecon affiche :
   - Le titre et les metadonnees (cours associe, type de contenu, XP a gagner)
   - Le contenu de la lecon
   - Le bouton **"Marquer comme terminee"**
3. Lire le contenu
4. Cliquer sur **"Marquer comme terminee"**
5. Un message de succes apparait : "Lecon terminee ! Vous avez gagne 15 XP."
6. Le badge **"Terminee"** apparait en haut a droite
7. Le bouton "Marquer comme terminee" disparait

**Points a observer :**
- Le gain de XP est affiche
- Le badge "Premier pas" devrait etre attribue automatiquement (premiere lecon completee)

---

### Etape 6 : Passer un quiz

1. Retourner au detail du cours (bouton "Retour au cours")
2. Remarquer que la premiere lecon est maintenant marquee comme terminee (coche verte)
3. La barre de progression a avance
4. Cliquer sur la lecon **"Kurt Lewin et les fondements"** (chapitre 2)
5. Marquer cette lecon comme terminee (+20 XP)
6. Retourner a la liste des cours > "Introduction a la dynamique des groupes"
7. Cliquer sur la premiere lecon puis chercher le quiz associe dans les liens
   > **Note** : Les quiz sont accessibles via la route `/quiz/:id`. Acceder a `http://localhost:4200/quiz/1`
8. Le quiz affiche :
   - Le titre et la description
   - L'XP a gagner
   - Une barre de progression (question X sur Y)
   - La question courante avec les choix
9. Repondre aux 3 questions :
   - Question 1 : "3 a 15 personnes" (bonne reponse)
   - Question 2 : "Kurt Lewin" (bonne reponse)
   - Question 3 : "B = f(P, E)" (bonne reponse)
10. Cliquer sur **"Soumettre"**
11. L'ecran de resultats affiche :
    - Score : 3/3
    - XP gagnes : +30 XP
    - Message de felicitations

**Points a observer :**
- Navigation entre questions (Precedent / Suivant)
- Le bouton "Soumettre" n'apparait qu'a la derniere question
- Il faut repondre a toutes les questions pour pouvoir soumettre
- Si on repasse le quiz, le message "Vous aviez deja repondu" s'affiche et aucun XP supplementaire n'est attribue

---

### Etape 7 : Verifier la progression

1. Retourner au **Tableau de bord** (cliquer sur "Tableau de bord" dans le menu)
2. Observer les changements :
   - **XP Total** : augmente (15 + 20 + 30 = 65 XP)
   - **Niveau** : reste 1 (il faut 100 XP pour passer au niveau 2)
   - **Cours inscrits** : 1
   - **Lecons terminees** : 2
   - **Mes cours en cours** : le cours "Introduction a la dynamique des groupes" apparait avec sa progression
   - **Mes badges** : le badge "Premier pas" devrait etre visible

---

### Etape 8 : S'inscrire a d'autres cours

1. Aller dans **Cours** > cliquer sur "Communication et interactions dans le groupe"
2. S'inscrire
3. Terminer quelques lecons pour accumuler de l'XP
4. Repeter pour "Leadership et prise de decision collective"
5. Apres inscription a 3 cours, le badge **"Explorateur"** devrait etre obtenu

---

### Etape 9 : Consulter le classement

1. Cliquer sur **"Classement"** dans le menu lateral
2. La page affiche :
   - Le **podium** (top 3) avec des avatars et des badges de position
   - La **liste complete** des apprenants classes par XP
   - Votre position est mise en surbrillance avec la mention "(vous)"

> Si un seul utilisateur existe, le classement affiche ce seul utilisateur. Pour une demo plus parlante, creer 2-3 comptes supplementaires (voir l'etape 10).

---

### Etape 10 : Creer d'autres comptes etudiants

Pour une demo du classement plus interessante :

**Compte 2 :**
1. Se deconnecter (cliquer sur votre profil dans la sidebar > "Se deconnecter")
2. Creer un nouveau compte :
   - **Prenom** : `Sara`
   - **Nom** : `Benali`
   - **Email** : `sara@test.com`
   - **Mot de passe** : `password123`
3. S'inscrire a des cours et terminer des lecons pour accumuler de l'XP

**Compte 3 :**
1. Se deconnecter
2. Creer un compte :
   - **Prenom** : `Karim`
   - **Nom** : `Meziane`
   - **Email** : `karim@test.com`
   - **Mot de passe** : `password123`
3. Faire de meme

Ensuite, retourner sur le premier compte et verifier le classement mis a jour.

---

### Etape 11 : Consulter le profil

1. Cliquer sur **"Mon profil"** dans le menu lateral (ou cliquer sur le nom dans la sidebar)
2. La page de profil affiche :
   - **Carte profil** : avatar, nom complet, email, role (Etudiant), XP, niveau, date d'inscription
   - **Jauge** : progression vers le prochain niveau
   - **Statistiques** : cours inscrits, cours termines, lecons terminees, badges
   - **Badges obtenus** : liste des badges avec icones et descriptions

---

### Etape 12 : Tester le quiz du leadership (Bonus)

1. Aller sur `http://localhost:4200/quiz/2` (Quiz sur les styles de leadership)
2. Repondre aux questions :
   - Question 1 : "Democratique" (bonne reponse)
   - Question 2 : "La pensee de groupe (groupthink)" (bonne reponse)
3. Observer le score et les XP gagnes

---

## Fonctionnalites a Demontrer (Checklist)

| # | Fonctionnalite | Page | Statut |
|---|---------------|------|--------|
| 1 | Inscription | `/auth/register` | ☐ |
| 2 | Connexion | `/auth/login` | ☐ |
| 3 | Deconnexion | Sidebar profil | ☐ |
| 4 | Tableau de bord | `/` | ☐ |
| 5 | Liste des cours | `/cours` | ☐ |
| 6 | Recherche de cours | `/cours` | ☐ |
| 7 | Filtre par difficulte | `/cours` | ☐ |
| 8 | Detail d'un cours | `/cours/:id` | ☐ |
| 9 | Inscription a un cours | `/cours/:id` | ☐ |
| 10 | Lecture d'une lecon | `/lecons/:id` | ☐ |
| 11 | Completion d'une lecon | `/lecons/:id` | ☐ |
| 12 | Passage d'un quiz | `/quiz/:id` | ☐ |
| 13 | Soumission du quiz | `/quiz/:id` | ☐ |
| 14 | Barre de progression du cours | `/cours/:id` | ☐ |
| 15 | Gain d'XP | Tout au long | ☐ |
| 16 | Montee en niveau | Tableau de bord | ☐ |
| 17 | Attribution de badges | Tableau de bord / Profil | ☐ |
| 18 | Classement | `/classement` | ☐ |
| 19 | Page de profil | `/profil` | ☐ |
| 20 | Theme sombre | Configurateur | ☐ |

---

## Systeme de Badges

| Badge | Condition | Comment l'obtenir |
|-------|-----------|-------------------|
| Premier pas | Terminer 1 lecon | Completer n'importe quelle lecon |
| Etudiant assidu | Terminer 5 lecons | Completer 5 lecons dans n'importe quel cours |
| Expert en herbe | Terminer 10 lecons | Completer les 10 lecons disponibles |
| Quiz master | Score parfait a un quiz | Repondre correctement a toutes les questions d'un quiz |
| Niveau 5 | Atteindre le niveau 5 | Accumuler 500 XP (100 XP = 1 niveau) |
| Explorateur | S'inscrire a 3 cours | S'inscrire a 3 cours differents |

---

## Systeme de Gamification

- **XP** : Chaque lecon completee et chaque quiz reussi rapporte des points d'experience
- **Niveaux** : 100 XP = 1 niveau. Le niveau se calcule automatiquement
- **Badges** : Attribues automatiquement lorsque les conditions sont remplies
- **Classement** : Classe les etudiants par XP total, mis a jour en temps reel

---

## Structure des Cours (Contenu de Demo)

### Cours 1 : Introduction a la dynamique des groupes (DEBUTANT - 8h)
- **Chapitre 1** : Qu'est-ce qu'un groupe ?
  - Lecon 1 : Definition d'un groupe restreint (15 XP) + Quiz (30 XP)
  - Lecon 2 : Distinction entre groupe et equipe (10 XP)
- **Chapitre 2** : Histoire de la dynamique des groupes
  - Lecon 3 : Kurt Lewin et les fondements (20 XP)
- **Chapitre 3** : Types et classifications des groupes
  - Lecon 4 : Groupes primaires et secondaires (15 XP)

### Cours 2 : Communication et interactions (INTERMEDIAIRE - 10h)
- **Chapitre 4** : Les reseaux de communication
  - Lecon 5 : Modeles de communication en groupe (20 XP)
- **Chapitre 5** : Roles et statuts dans le groupe
  - Lecon 6 : Les roles dans le groupe (15 XP)

### Cours 3 : Leadership et prise de decision (INTERMEDIAIRE - 12h)
- **Chapitre 6** : Les styles de leadership
  - Lecon 7 : Les trois styles de leadership de Lewin (25 XP) + Quiz (30 XP)
- **Chapitre 7** : Processus de decision en groupe
  - Lecon 8 : Methodes de prise de decision collective (20 XP)

### Cours 4 : Gestion des conflits et cohesion (AVANCE - 10h)
- **Chapitre 8** : Sources et types de conflits
  - Lecon 9 : Origines et nature des conflits (20 XP)
- **Chapitre 9** : Strategies de resolution
  - Lecon 10 : Techniques de resolution de conflits (25 XP)

**XP Total disponible** : 245 XP (lecons : 185 XP + quiz : 60 XP)

---

## Notes pour le presentateur

1. **Premiere connexion** : Toujours commencer par une inscription pour montrer le flow complet
2. **Temps recommande** : La demo complete prend environ 15-20 minutes
3. **Focus principal** : Insister sur le systeme de gamification (XP, niveaux, badges) qui motive l'apprentissage
4. **Navigation** : Le menu lateral permet d'acceder a toutes les sections rapidement
5. **Responsive** : La plateforme s'adapte aux ecrans mobiles - montrer en reduisant la fenetre
6. **Theme** : Utiliser le configurateur (icone engrenage) pour basculer entre theme clair et sombre
7. **Roles** : Tous les utilisateurs crees via l'inscription ont le role ETUDIANT. Les roles ENSEIGNANT et ADMIN peuvent etre attribues manuellement dans la base de donnees si necessaire pour des extensions futures

---

## Acces rapide aux pages

| Page | URL |
|------|-----|
| Connexion | `http://localhost:4200/auth/login` |
| Inscription | `http://localhost:4200/auth/register` |
| Tableau de bord | `http://localhost:4200/` |
| Liste des cours | `http://localhost:4200/cours` |
| Detail du cours 1 | `http://localhost:4200/cours/1` |
| Lecon 1 | `http://localhost:4200/lecons/1` |
| Quiz 1 | `http://localhost:4200/quiz/1` |
| Quiz 2 | `http://localhost:4200/quiz/2` |
| Classement | `http://localhost:4200/classement` |
| Profil | `http://localhost:4200/profil` |
