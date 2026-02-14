# Documentation Fonctionnelle - Plateforme de Gamification de l'Education

## Table des matieres

1. [Presentation du projet](#presentation-du-projet)
2. [Objectifs pedagogiques](#objectifs-pedagogiques)
3. [Utilisateurs et roles](#utilisateurs-et-roles)
4. [Parcours utilisateur](#parcours-utilisateur)
5. [Fonctionnalites detaillees](#fonctionnalites-detaillees)
6. [Systeme de gamification](#systeme-de-gamification)
7. [Contenu pedagogique](#contenu-pedagogique)
8. [Captures d'ecran et navigation](#captures-decran-et-navigation)

---

## Presentation du projet

La plateforme de gamification de l'education est une application web concue pour rendre l'apprentissage de la **Dynamique des Groupes** plus engageant et motivant. En integrant des mecanismes de jeu dans un environnement educatif, elle vise a augmenter la motivation, la participation et la retention des connaissances chez les apprenants.

Le domaine de la Dynamique des Groupes etudie les phenomenes psychosociaux qui se produisent dans les groupes restreints. Ce champ couvre notamment :
- La definition et les caracteristiques des groupes
- L'histoire et les fondements theoriques (Kurt Lewin, Jacob L. Moreno)
- Les reseaux de communication au sein des groupes
- Le leadership et ses differents styles
- La gestion des conflits dans les groupes

---

## Objectifs pedagogiques

### Objectifs principaux

1. **Faciliter l'apprentissage** : Structurer le contenu en cours, chapitres et lecons progressives
2. **Motiver les apprenants** : Utiliser des mecanismes de gamification (XP, niveaux, badges)
3. **Evaluer les connaissances** : Proposer des quiz interactifs avec retour immediat
4. **Encourager la competition saine** : Classement des apprenants par XP accumule
5. **Suivre la progression** : Tableau de bord personnalise avec statistiques detaillees

### Approche pedagogique

L'application suit une progression structuree :
1. L'apprenant s'inscrit a un cours
2. Il parcourt les chapitres et lecons dans l'ordre propose
3. Il complete chaque lecon pour gagner de l'XP
4. Il passe des quiz pour valider ses acquis
5. Il suit sa progression et son classement

---

## Utilisateurs et roles

### Roles disponibles

| Role | Description | Acces |
|------|-------------|-------|
| **Etudiant** | Apprenant inscrit sur la plateforme | Consulter les cours, suivre les lecons, passer les quiz, voir son profil et le classement |
| **Enseignant** | Formateur ou professeur | Memes acces que l'etudiant (extension possible pour la gestion de contenu) |
| **Administrateur** | Gestionnaire de la plateforme | Acces complet a toutes les fonctionnalites |

### Inscription et connexion

- L'inscription requiert : nom, prenom, adresse email et mot de passe
- Le role par defaut est **Etudiant**
- La connexion se fait par email et mot de passe
- La session est maintenue via un token JWT stocke localement

---

## Parcours utilisateur

### Parcours type d'un etudiant

```
Inscription ──> Connexion ──> Tableau de bord
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
             Catalogue       Classement         Profil
             des cours                       (statistiques)
                    │
                    ▼
          Detail du cours
          (chapitres & lecons)
                    │
            ┌───────┴───────┐
            ▼               ▼
         Lecon            Quiz
     (lecture +        (evaluation)
      completion)
```

### Etapes detaillees

1. **Inscription** : L'utilisateur cree son compte avec ses informations personnelles
2. **Tableau de bord** : Vue d'ensemble avec XP, niveau, cours en cours et badges
3. **Catalogue** : Parcours de la liste des cours disponibles avec filtres
4. **Inscription a un cours** : Choix d'un cours et inscription en un clic
5. **Apprentissage** : Lecture des lecons, chapitre par chapitre
6. **Completion** : Marquage de chaque lecon comme terminee (gain d'XP)
7. **Evaluation** : Passage des quiz avec questions a choix unique ou multiple
8. **Progression** : Suivi de la progression globale et par cours
9. **Classement** : Comparaison avec les autres apprenants

---

## Fonctionnalites detaillees

### 1. Tableau de bord

Le tableau de bord est la page d'accueil de l'application une fois connecte. Il affiche :

- **XP total** : Points d'experience accumules
- **Niveau actuel** : Calcule en fonction de l'XP (100 XP par niveau)
- **Barre de progression** : Progression vers le niveau suivant
- **Nombre de cours inscrits et termines**
- **Nombre de lecons terminees** sur le total
- **Cours recents** : Liste des cours en cours avec leur progression
- **Badges obtenus** : Collection des badges gagnes

### 2. Catalogue des cours

Le catalogue presente tous les cours disponibles sous forme de cartes visuelles :

- **Titre et description** du cours
- **Niveau de difficulte** : Debutant, Intermediaire, Avance (code couleur)
- **Duree estimee** en heures
- **Nombre de chapitres et lecons**
- **Progression** si l'utilisateur est inscrit
- **Filtres** : Recherche par texte et filtre par difficulte

### 3. Detail d'un cours

La page de detail d'un cours affiche :

- **Informations generales** : Titre, description, difficulte, duree
- **Bouton d'inscription** si l'utilisateur n'est pas encore inscrit
- **Barre de progression globale** si inscrit
- **Liste des chapitres** en accordeon
- **Lecons de chaque chapitre** : Titre, type de contenu, XP a gagner, statut de completion
- Navigation vers chaque lecon (si inscrit)

### 4. Vue d'une lecon

L'affichage d'une lecon comprend :

- **Titre et meta-informations** : Cours parent, type de contenu, XP a gagner
- **Contenu pedagogique** : Texte structure de la lecon
- **Bouton de completion** : Marquer la lecon comme terminee
- **Navigation** : Boutons "lecon precedente" et "lecon suivante"
- **Retour au cours** : Lien vers la page de detail du cours
- **Indicateur de statut** : Marque visuelle si la lecon est deja terminee

### 5. Quiz interactif

L'interface de quiz propose :

- **Barre de progression** : Question actuelle sur le total
- **Types de questions** :
  - **Choix unique** : Selection d'une seule reponse via boutons radio
  - **Choix multiple** : Selection de plusieurs reponses via cases a cocher
- **Navigation** : Boutons "Precedent" et "Suivant"
- **Soumission** : Bouton "Soumettre" actif uniquement quand toutes les questions sont repondues
- **Resultats** : Score obtenu, XP gagnes, indicateur de reussite
- **Protection** : Indication si le quiz a deja ete passe (pas de double XP)

### 6. Classement

Le classement affiche les meilleurs apprenants :

- **Podium** : Top 3 mis en avant avec des medailles visuelles (or, argent, bronze)
- **Liste complete** : Classement du 4e au 20e avec rang, nom, niveau et XP
- **Identification** : L'utilisateur connecte est mis en evidence dans la liste
- **XP et niveau** affiches pour chaque participant

### 7. Profil utilisateur

La page de profil personnelle affiche :

- **Informations personnelles** : Nom, prenom, email, role
- **Cadran de progression** : Progression visuelle vers le prochain niveau
- **Statistiques** : Cours inscrits, cours termines, lecons terminees, badges
- **Collection de badges** : Liste de tous les badges obtenus avec descriptions

### 8. Panneau lateral de profil

Accessible depuis l'icone de profil dans la barre superieure :

- **Accueil personnalise** avec nom de l'utilisateur
- **Barre de progression XP** compacte
- **Liens rapides** : Profil, Classement, Cours, Deconnexion

---

## Systeme de gamification

### Points d'experience (XP)

| Action | XP gagnes |
|--------|-----------|
| Completer une lecon | Variable (defini par lecon, generalement 10-20 XP) |
| Quiz reussi | Proportionnel au score (maximum = XP du quiz) |
| Quiz parfait (100%) | XP complet du quiz + badge potentiel |

### Niveaux

Le systeme de niveaux est lineaire :
- **Niveau 1** : 0-99 XP
- **Niveau 2** : 100-199 XP
- **Niveau 3** : 200-299 XP
- Et ainsi de suite (100 XP par niveau)

### Badges

Les badges sont attribues automatiquement lorsque certaines conditions sont remplies :

| Badge | Condition | Description |
|-------|-----------|-------------|
| Premiere Lecon | 1 lecon completee | Recompense pour le premier pas |
| Etudiant Assidu | 5 lecons completees | Perseverance dans l'apprentissage |
| Expert | 10 lecons completees | Maitrise du contenu |
| Niveau 5 | Atteindre le niveau 5 | Progression significative |
| Quiz Parfait | Score de 100% a un quiz | Excellence dans l'evaluation |
| Explorateur | 3 cours | Curiosite et diversite |

### Classement

Le classement est base sur le total d'XP accumule. Il affiche les 20 meilleurs apprenants de la plateforme, avec un podium visuel pour les 3 premiers.

---

## Contenu pedagogique

### Cours disponibles (donnees initiales)

#### 1. Introduction a la Dynamique des Groupes
- **Difficulte** : Debutant
- **Duree** : 8 heures
- **Contenu** : Definition des groupes, histoire (Lewin, Moreno), reseaux de communication
- **Quiz** : 3 questions sur les fondamentaux

#### 2. Communication et Leadership dans les Groupes
- **Difficulte** : Intermediaire
- **Duree** : 10 heures
- **Contenu** : Types de communication, styles de leadership (Lewin, Likert, Blake/Mouton)
- **Quiz** : 2 questions sur le leadership

#### 3. Gestion des Conflits de Groupe
- **Difficulte** : Avance
- **Duree** : 12 heures
- **Contenu** : Resolution de conflits, methodes de negociation

#### 4. Techniques d'Animation de Groupe
- **Difficulte** : Intermediaire
- **Duree** : 6 heures
- **Contenu** : Methodes d'animation, facilitation de groupe

### Structure type d'un cours

Chaque cours est organise en :
1. **Chapitres** : Regroupements thematiques ordonnes
2. **Lecons** : Unites d'apprentissage avec contenu textuel
3. **Quiz** : Evaluations avec questions a choix unique ou multiple

---

## Captures d'ecran et navigation

### Menu de navigation

Le menu lateral propose les elements suivants :

**Navigation**
- Tableau de bord (accueil)
- Catalogue des cours
- Classement

**Mon espace**
- Mon profil

### Theme visuel

L'application utilise le theme **Aura** de PrimeNG avec :
- **Couleur principale** : Teal (vert-bleu)
- **Mode sombre** : Support complet via le selecteur `.app-dark`
- **Responsive** : Interface adaptee aux mobiles, tablettes et desktops
- **Composants** : Utilisation coherente des composants PrimeNG (cartes, barres de progression, badges, tags, boutons)
