# MarketPlaceFood


## Lien vers le Projet

Vous pouvez accéder au projet en ligne à l'adresse suivante : [Snap&Shop](https://snapandshop.anthony-vouin.com/)


## Contributions

- **Anthony Vouin** : Développeur Full Stack 
- **Charline Royer** : Développeur Full Stack
- **Matthias Faucon** : Développeur Full Stack 


## Technologies Utilisées

- **Next.js** : Framework React pour le développement d'applications web.
- **Prisma** : ORM pour interagir avec la base de données.
- **Stripe** : Plateforme de paiement pour gérer les transactions.
- **TypeScript** : Superset de JavaScript qui ajoute des types statiques.
- **Jest** : Framework de test pour JavaScript.
- **OpenAI** : API pour l'intelligence artificielle.
- **Tailwind CSS** : Framework CSS pour le design.
- **NextAuth** : Authentification pour Next.js.

 

## Explication du Projet

Snap&Shop est une plateforme en ligne qui permet aux utilisateurs de commander des produits alimentaires. Le projet vise à simplifier le processus de commande et de paiement en ligne, tout en offrant une interface utilisateur intuitive et réactive. De plus, nous avons intégré un ensemble de fonctionnalités basées sur l'intelligence artificielle pour améliorer l'expérience utilisateur.


## Fonctionnalités

- **Parcourir les produits** : Les utilisateurs peuvent explorer une variété de produits alimentaires.
- **Système de paiement intégré** : Utilisation de Stripe pour des transactions sécurisées.
- **Gestion des utilisateurs** : Inscription, connexion et gestion des profils utilisateurs.
- **Interface réactive** : Conçue pour être utilisée sur tous les appareils.
- **Intelligence artificielle** : Génération de recettes en fonction des articles présents dans le panier de l'utilisateur.


## Comment Lancer le Projet

Avant de commencer, assurez-vous d'avoir les prérequis suivants :

- **Node.js 20** : Assurez-vous que Node.js version 20 est installé sur votre machine.
- **PostgreSQL** : Une instance de PostgreSQL doit être en cours d'exécution.
- **Fichier `.env`** : Configurez les variables d'environnement en suivant l'exemple fourni dans le fichier `.env`.

1. **Récupération du projet** :
   ```bash
   git clone <URL_DU_PROJET>
   ```

2. **Installation des dépendances** :
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```

4. **Lancer les migrations** :
   ```bash
   npx prisma migrate dev
   ```

5. **Remplir la base de données** :
   ```bash
   npx prisma db seed
   ```

6. **Se connecter à Stripe en local** :
   ```bash
   stripe login
   ```

7. **Lancer le serveur Stripe en local** :
   ```bash
   stripe listen --forward-to http://localhost:3000/api/webhook
   ```
