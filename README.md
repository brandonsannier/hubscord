# Hubscord

**Hubscord** est une application de bureau cross-platform développée avec **Electron**, qui permet aux joueurs de **suivre leur progression** dans leurs jeux vidéo favoris. Elle fonctionne en arrière-plan, détecte automatiquement les jeux en cours et enregistre le temps de jeu, les succès, et bien plus encore.

## Fonctionnalités principales

- **Détection automatique** des jeux en cours d’exécution
- **Suivi du temps de jeu** précis, jeu par jeu
- **Raccourcis clavier globaux** personnalisables
- **Overlay léger** (en cours de développement) pour afficher votre progression en temps réel pendant le jeu
- **Gestion de collection de jeux multi-plateformes**, anciennes comme nouvelles générations
- **Succès communautaires** : défiez et partagez des objectifs avec la communauté, même pour les jeux qui n'ont pas de succès intégrés

## Ambitions communautaires

Hubscord a pour ambition d’aller au-delà du simple suivi individuel. Un **aspect communautaire** est en développement pour permettre :

- **Organisation d'événements et de tournois** entre utilisateurs
- **Création et partage de "succès communautaires"** dans vos jeux préférés :
  > Exemple : si vous jouez à *League of Legends*, qui ne dispose pas de succès classiques, vous pourrez proposer des challenges à la communauté ("Remporter une partie sans mourir une seule fois", etc.) et voir qui relève le défi.

L’objectif est de **rendre chaque jeu plus vivant**, même ceux sans système de succès officiel.


## Gestion de collection complète

Dans une époque où l’accès aux jeux vidéo est massif, entre Steam, Epic Games, consoles anciennes et modernes, nous avons souvent une **énorme bibliothèque**… sans toujours savoir :

- Quels jeux nous avons réellement ?
- Lesquels sont entamés, non terminés, ou jamais lancés ?
- Où en est notre progression ?

Hubscord vous aide à **centraliser et suivre votre collection de jeux**, toutes plateformes confondues, pour mieux organiser vos sessions et **reprendre en main les pépites oubliées**.

## Intégration des plateformes et ajout manuel

Afin de proposer une expérience utilisateur riche dès le lancement de l’application, **Hubscord** s’appuie sur plusieurs **API officielles de plateformes de jeux** pour récupérer automatiquement les informations liées à vos jeux et à votre progression, notamment :

- **Steam Web API** : récupération de votre bibliothèque, du temps de jeu, des succès, etc.
- **Riot Games API** : intégration spécifique pour *League of Legends*, *Valorant*, etc.
- **(À venir)** : support progressif d'autres plateformes majeures comme **Epic Games**, **PlayStation**, **Xbox**, **Battle.net**, et autres via leurs APIs ou SDKs.

Ces intégrations permettent de **pré-remplir automatiquement votre bibliothèque virtuelle**, afin que vous puissiez suivre votre activité sans saisie manuelle.

Cependant, certains jeux — notamment ceux joués sur des plateformes sans API publique ou des jeux indépendants — pourraient ne pas être détectés automatiquement. **Hubscord vous permettra alors de :**

- **Ajouter des jeux manuellement** dans votre collection
- **Définir des objectifs personnalisés**, comme des succès ou des temps à atteindre
- **Suivre leur progression** comme n’importe quel autre jeu

L’objectif est de garantir une **prise en charge universelle**, que vous jouiez à un AAA récent ou à un jeu rétro sur un émulateur.

## Installation

1. Rendez-vous dans la section [Releases](https://github.com/brandonsannier/hubscord/releases)
2. Téléchargez le fichier d'installation `Hubscord Setup X.X.X.exe`
3. Lancez-le : l'application démarrera automatiquement après installation

## Développement

### Prérequis

- [Node.js](https://nodejs.org/) (version 18.x ou supérieure recommandée)
- `npm` ou `yarn` (gestionnaire de paquets)

### Installation

```bash
npm install
```

### Lancement en mode développement

```bash
npm run start
```

### Build de l'application

```bash
npm run build
```
### Variables d'environnement

Le projet utilise un fichier `.env` pour stocker les **clés API sensibles** (Steam, Riot Games, etc.).

> ⚠️ Ce fichier n’est **pas versionné** pour des raisons de sécurité (`.gitignore`), mais un **exemple** est disponible dans le projet.

Vous pouvez ensuite :

- **Fournir vos propres clés API**
- Ou laisser les champs vides pour lancer l’application sans connexion aux services externes  
  (certaines fonctionnalités seront alors désactivées automatiquement)

Cela permet aux contributeurs de **travailler sans contrainte**, tout en **protégeant les clés personnelles** du créateur du projet.

## Contribuer

Les contributions sont **les bienvenues** ! Que ce soit pour corriger un bug, proposer une fonctionnalité ou améliorer la doc :

1. **Fork** le dépôt
2. Crée une branche : `git checkout -b feature/MaFeatureGeniale`
3. Commit tes modifications : `git commit -m 'Ajout de ma fonctionnalité géniale'`
4. Push vers ton dépôt : `git push origin feature/MaFeatureGeniale`
5. Ouvre une **Pull Request** ✨

Merci d'utiliser Hubscord ❤️
Suivez le projet, étoilez le repo ⭐ si vous aimez !

