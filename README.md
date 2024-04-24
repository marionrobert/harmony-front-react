(english below)

# Bienvenue sur *Harmony* : Apprenez à connaître vos voisins en échangeant des coups de main ! 🌳🌞🤝
<img src="/public/screenshots/bannerHarmony.png" alt="bannière de l'application web">

Harmony est né d'un constat simple. Les personnes bénéficiant d'une protection internationale ont vocation à s'installer durablement en France du fait de leur situation mais elles éprouvent souvent des difficultés à s'intégrer. Nous sommes convaincus que leur intégration peut être facilitée à l'échelle de la ville. Malheureusement, on constate en général un manque d’interactions sociales entre les habitants de longue date et les personnes protégées nouvellement arrivées. Cela est la conséquence directe d’une méconnaissance de l’autre et d’idées préconçues. Le but de notre projet est de favoriser l’inclusion des personnes protégées en développant les échanges et la solidarité entre les habitants d'une même ville. Cette solidarité naîtra de l’échange de coups de main entre voisins. Sur notre site, vous pouvez proposer et/ou réserver une activité pour donner et/ou recevoir un coup de main de la part de vos voisins. En réalisant un coup de main pour quelqu'un, vous gagnez des points que vous pourrez ensuite utiliser pour obtenir de l'aide auprès d'autres utilisateurs.

L'application est disponible en français uniquement. Ce dépôt est consacré à la partie frontend du projet.


<br/>

## Contexte de développement 💻
Il s'agit d'un projet éducatif développé en tant que projet final de la formation "Développeur web FullStack Javascript" à la 3w Academy.

<br/>

## Installation et Configuration ⚙️🛠️

### Prérequis système :
L'application tourne actuellement sur :
- Node.js (version 16.15.1)
- Npm (version 8.11.0)

Voici la list des packages et eur leur verion utilisés dans ce projet :
```
dependencies": {
    "@fortawesome/fontawesome-svg-core": "^6.4.2",
    "@fortawesome/free-brands-svg-icons": "^6.4.2",
    "@fortawesome/free-regular-svg-icons": "^6.4.2",
    "@fortawesome/free-solid-svg-icons": "^6.4.2",
    "@fortawesome/react-fontawesome": "^0.2.0",
    "@reduxjs/toolkit": "^1.9.5",
    "axios": "^1.4.0",
    "cloudinary-react": "^1.8.1",
    "leaflet": "^1.9.4",
    "moment": "^2.29.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-leaflet": "^4.2.1",
    "react-range-slider-input": "^3.0.7",
    "react-redux": "^8.1.2",
    "react-router-dom": "^6.15.0",
    "redux": "^4.2.1",
    "redux-thunk": "^2.4.2",
    "sass": "^1.66.1",
    "yup": "^1.3.0"
  }
```
<br/>

### Étapes d'installation :

1. Clonez le dépôt Git : `git clone https://github.com/marionrobert/harmony-front-react.git`.
2. Assurez-vous d'avoir les bonnes versions de la stack technologique installées.
3. Exécutez la commande `npm install` pour installer les dépendances.
4. Suivez les étapes d'installation et de configuration du backend, puis lancez le serveur de l'API backend avec la commande `npm run dev`. Toutes les instructions sont disponibles sur le dépôt du backend de l'application [ici](https://github.com/marionrobert/finalProjet-api-back).
5. Ensuite, lancez le serveur de l'interface utilisateur avec la commande `npm run dev`.

<br/>

## Contenu des fichiers 📁🗃️

Le projet est organisé en plusieurs dossiers et fihciers présents dans le dossier principal **src** (présent à la racine) :
- dossier **api** : contient des fichiers qui gèrent les requêtes HTTP vers l'API de l'application. Par exemple, dans le fichier activity.jsx, plusieurs fonctions sont définies pour interagir avec les ressources liées aux activités. Ces fonctions utilisent Axios pour effectuer des requêtes HTTP vers l'API, en récupérant, en créant, en mettant à jour ou en supprimant des activités, ainsi que d'autres opérations telles que la gestion des filtres ou des images. Les fonctions prennent en charge l'ajout de jetons d'authentification pour les requêtes sécurisées et manipulent les réponses et les erreurs renvoyées par l'API.
- dossier **components** : contient des fichiers qui définissent des composants réutilisables à travers l'application. Il y a 4 composants : ActivityCard.jsx, CommentCard.jsx, Footer.jsx, Header.jsx
- dossier **containers** : contrairement aux composants réutilisables dans le dossier "components", les composants dans le dossier "containers" sont souvent spécifiques à des vues de l'application.
- dossier **fonts** : contient des fichiers de police au format TrueType Font (.ttf), utilisés pour définir les styles de texte dans l'application web.
- dossier **helpers** : contient le fichier require-data-auth.jsx qui définit un composant React qui agit en tant que Higher-Order Component (HOC) pour contrôler les données et la sécurité des routes. Il gère la récupération des paramètres de la route, l'extraction des états depuis le store Redux, la gestion de la redirection en fonction de l'authentification de l'utilisateur, et effectue des appels API pour vérifier l'authenticité du token d'utilisateur. En fonction de l'état de l'authentification et des rôles de l'utilisateur, il redirige vers les pages appropriées ou affiche le composant enfant avec les paramètres transmis.
- dossier **slices** : contient plusieurs fichiers associés à la gestion de l'état global de l'application à l'aide de Redux, un gestionnaire d'état pour les applications JavaScript.
  - **store.jsx** : contient la configuration du magasin Redux de l'application, qui combine tous les "slices" définis dans l'application pour créer un seul et unique "store" gérant l'état global de l'application.
  - **activitySlice.jsx**: définit un "slice" pour gérer l'état lié aux activités dans l'application. Il contient des actions, des reducers et des sélecteurs pour manipuler et récupérer des données liées aux activités.
  - **basketSlice.jsx** : définit un "slice" pour gérer l'état du panier dans l'application, stockant les produits ou articles sélectionnés par l'utilisateur. Il inclut des actions pour mettre à jour et nettoyer le panier, ainsi que des fonctions pour calculer le montant total du panier.
  - **userSlice.jsx** : définit un "slice" pour gérer l'état de l'utilisateur dans l'application, stockant les informations de connexion telles que l'identifiant de l'utilisateur et le token d'authentification. Il contient des actions pour définir l'utilisateur et le déconnecter, ainsi que des sélecteurs pour récupérer les informations de l'utilisateur.
- fichier **App.jsx** : définit le composant racine de l'application. Il organise les routes et les composants de l'application en utilisant React Router pour la navigation. Il inclut également les en-têtes et pieds de page de l'application, ainsi que des routes pour différentes fonctionnalités telles que la gestion des activités, les réservations, l'authentification des utilisateurs et les fonctionnalités administratives.
- fichier **App.scss** : contient le CSS applicable à l'ensemble de l'application. Il suit la méthode "mobile first", ce qui signifie que le CSS pour les formats mobiles est défini en premier, suivi des adaptations pour les formats tablette et ordinateur. Le CSS est structuré par containers et composants.
- fichier **config.js** : contient un objet config qui stocke les informations nécessaires à l'application, telles que les URL de l'API et les URL des images. Actuellement, il est configuré pour utiliser des URL locales (http://localhost:9000), mais il existe également une configuration en commentaire pour une utilisation avec un environnement de développement IDE (http://marionrobert.ide.3wa.io:9000).
- fichier **main.jsx** : c'est le point d'entrée de l'application React. Il importe les modules nécessaires, tels que React, ReactDOM, et les composants App, BrowserRouter, Provider, et store. Ensuite, il rend l'application en encapsulant le composant App dans un contexte de Redux fourni par Provider et un routeur fourni par BrowserRouter, le tout enveloppé dans un mode strict de React.


A la racine du projet, il existe également:
- un dossier **public** qui contient l'image servant de favicon à cette application et les captures d'écran utilisées dans ce README.
- un fichier **index.html** qui définit la structure de base de la page web de l'application React, incluant des métadonnées telles que le titre, la description, des liens vers des ressources externes comme des feuilles de style et des scripts, ainsi que le conteneur principal où l'application sera rendue.
- un **fichier vite.config.js** quiconfigure Vite pour prendre en charge React en utilisant le plugin @vitejs/plugin-react. Il exporte une configuration par défaut qui spécifie l'utilisation du plugin React et il contient des commentaires expliquant comment ajuster les paramètres du serveur pour un environnement de développement IDE.

<br/>

## Responsive design et méthode "mobile first"
Le responsive design consiste à créer des sites Web et des applications qui s'adaptent automatiquement à différentes tailles d'écran et types d'appareils, offrant ainsi une expérience utilisateur optimale sur ordinateurs de bureau, tablettes et smartphones. La méthode mobile first est une approche de conception qui commence par concevoir pour les appareils mobiles, puis étend progressivement la mise en page et les fonctionnalités pour les écrans plus grands, ce qui permet de prioriser l'expérience utilisateur sur les appareils mobiles et de simplifier la conception.

### Exemple de responsive design sur la page de présentation d'une activité
<br/>
<div style="display: flex; justify-content: center;">
<img src="/public/screenshots/activityDetails.png" alt="présentation d'une activité en format mobile" width="300">
<img src="/public/screenshots/activityDetailsTabletAndComputer.png" alt="présentation d'une activité en format tablette et ordinateur" width="600">
</div>
<br/>

## Fonctionnalités et parcours utilisateur

**Utilisateur sans rôle spécifique:**

Un utilisateur qui n’a pas de compte pourra uniquement :
- Accéder à la page d’accueil et découvrir des exemples d’activités proposées.
- Se créer un compte

L’utilisateur qui a un compte peut :
- Se connecter, consulter son profil et modifier ses informations personnelles
- S’il souhaite réserver une activité/annonce, l’utilisateur connecté peut :
    - Consulter toutes les annonces en ligne et la page de détails de chacune d’entre elles
    - Filter les annonces en choisissant des critères de sélection:
        - Réserver une activité
        - Valider la réalisation d’une activité
        - Commenter une activité qu’il avait réservée et qui a été réalisée
        - Consulter les activités qu’il a réservées
- En tant que créateur d’une annonce, l’utilisateur connecté peut :
    - Créer une annonce pour proposer une activité en tant que fournisseur (« je propose mon aide ») ou bénéficiaire (« j’ai besoin d’un coup de main »)
    - Consulter, modifier, supprimer les annonces qu’il a rédigées
    - Accepter une réservation
<br/>

**Utilisateur avec le rôle d’administrateur:**

- L’administrateur a un rôle de modérateur : il peut valider ou non la publication des annonces et commentaires créés par les utilisateurs pour éviter que tous propos ou images inappropriés soient présents sur la plateforme.
- L'administrateur peut créer, modifier ou supprimer des catégories.

<br/>
<br/>

## Un apperçu de l'interface

### Dashboard de l'utilisateur
<img src="/public/screenshots/dashboard.png" alt="dashboard de l'utilisateur" width="800">

<br/>

### Visionnage et filtre des activités
<img src="/public/screenshots/filter-activities.png" alt="visionnage et filtre des activités" width="800">

<br/>

<br/>

### Accepter, Confirmer et Commenter une réservation
<div style="display: flex; justify-content: center;">
    <img src="/public/screenshots/bookingCompleted.png" alt="visualiser une réservation terminée" width="500">
    <img src="/public/screenshots/acceptBooking.png" alt="accepter une réservation" width="300">
    <img src="/public/screenshots/confirmCompletion.png" alt="confirmer la réalisation de l'activité" width="300">
    <img src="/public/screenshots/commentBooking.png" alt="commenter une réservation terminée" width="500">

</div>
<br/>

### Dashboard de l'administrateur
<img src="/public/screenshots/dashboardAdmin.png" alt="dahsboard administrateur" width="800">

<br/>

### Modération des activités et commentaires par l'administrateur
<div style="display: flex; justify-content: center;">
    <img src="/public/screenshots/moderateActivity.png" alt="modération de l'activité par l'administateur" width="600">
    <img src="/public/screenshots/moderateComment.png" alt="modération du commentaire par l'administateur" width="300">
</div>
<br/>

## Dossier lié 🔗
La partie backend de l'application est accessible [ici](https://github.com/marionrobert/finalProjet-api-back)

---
---

# Welcome to *Harmony*: Get to Know Your Neighbors by Helping Each Other! 🌳🌞🤝
<img src="/public/screenshots/bannerHarmony.png" alt="application web banner">

Harmony was born from a simple observation. People benefiting from international protection are meant to settle permanently in France due to their situation, but they often face difficulties in integration. We are convinced that their integration can be facilitated at the city level. Unfortunately, there is generally a lack of social interaction between long-standing residents and newly arrived protected persons. This is a direct result of unfamiliarity and preconceived ideas. The goal of our project is to promote the inclusion of protected persons by developing exchanges and solidarity among residents of the same city. This solidarity will arise from helping each other. On our site, you can offer and/or book an activity to give and/or receive help from your neighbors. By helping someone, you earn points that you can later use to get help from other users.

The application is available only in French. This repository is dedicated to the frontend part of the project.

<br/>

## Development Context 💻
This is an educational project developed as the final project of the "FullStack Javascript Web Developer" training at 3w Academy.

<br/>

## Installation and Configuration ⚙️🛠️

### System Requirements:
The application currently runs on:
- Node.js (version 16.15.1)
- Npm (version 8.11.0)

Here is the list of packages and their versions used in this project:
```javascript
dependencies": {
    "@fortawesome/fontawesome-svg-core": "^6.4.2",
    "@fortawesome/free-brands-svg-icons": "^6.4.2",
    "@fortawesome/free-regular-svg-icons": "^6.4.2",
    "@fortawesome/free-solid-svg-icons": "^6.4.2",
    "@fortawesome/react-fontawesome": "^0.2.0",
    "@reduxjs/toolkit": "^1.9.5",
    "axios": "^1.4.0",
    "cloudinary-react": "^1.8.1",
    "leaflet": "^1.9.4",
    "moment": "^2.29.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-leaflet": "^4.2.1",
    "react-range-slider-input": "^3.0.7",
    "react-redux": "^8.1.2",
    "react-router-dom": "^6.15.0",
    "redux": "^4.2.1",
    "redux-thunk": "^2.4.2",
    "sass": "^1.66.1",
    "yup": "^1.3.0"
  }
```
<br/>

### Installation Steps:

1. Clone the Git repository: `git clone https://github.com/marionrobert/harmony-front-react.git`.
2. Make sure you have the correct versions of the technological stack installed.
3. Run the command `npm install` to install dependencies.
4. Follow the installation and configuration steps for the backend, then start the backend API server with the command `npm run dev`. All instructions are available on the backend application repository [here](https://github.com/marionrobert/finalProjet-api-back).
5. Next, start the user interface server with the command `npm run dev`.

<br/>

## File Contents 📁🗃️

The project is organized into several folders and files located in the main **src** folder (present at the root):
- **api** folder: contains files that manage HTTP requests to the application's API. For example, in the activity.jsx file, several functions are defined to interact with activity-related resources. These functions use Axios to perform HTTP requests to the API, fetching, creating, updating, or deleting activities, as well as other operations such as handling filters or images. The functions support adding authentication tokens for secure requests and handle responses and errors returned by the API.
- **components** folder: contains files that define reusable components throughout the application. There are 4 components: ActivityCard.jsx, CommentCard.jsx, Footer.jsx, Header.jsx
- **containers** folder: unlike reusable components in the "components" folder, components in the "containers" folder are often specific to views of the application.
- **fonts** folder: contains font files in TrueType Font (.ttf) format, used to define text styles in the web application.
- **helpers** folder: contains the require-data-auth.jsx file that defines a React component acting as a Higher-Order Component (HOC) to control route data and security. It manages route parameter retrieval, state extraction from the Redux store, redirection handling based on user authentication, and makes API calls to verify the user token authenticity. Based on authentication status and user roles, it redirects to appropriate pages or displays the child component with transmitted parameters.
- **slices** folder: contains several files associated with managing the global state of the application using Redux, a state manager for JavaScript applications.
  - **store.jsx**: contains the configuration of the application's Redux store, which combines all defined "slices" in the application to create a single store managing the global application state.
  - **activitySlice.jsx**: defines a "slice" to manage activity-related state in the application. It includes actions, reducers, and selectors to manipulate and fetch activity-related data.
  - **basketSlice.jsx**: defines a "slice" to manage the basket state in the application, storing products or items selected by the user. It includes actions to update and clear the basket, as well as functions to calculate the total basket amount.
  - **userSlice.jsx**: defines a "slice" to manage user state in the application, storing user login information such as the user ID and authentication token. It includes actions to set and log out the user, as well as selectors to fetch user information.
- **App.jsx** file: defines the root component of the application. It organizes routes and components of the application using React Router for navigation. It also includes application headers and footers, as well as routes for different features such as activity management, reservations, user authentication, and administrative features.
- **App.scss** file: contains CSS applicable to the entire application. It follows the "mobile-first" method, meaning CSS for mobile formats is defined first, followed by adaptations for tablet and desktop formats. CSS is structured by containers and components.
- **config.js** file: contains a config object that stores necessary information for the application, such as API URLs and image URLs. Currently, it is configured to use local URLs (http://localhost:9000), but there is also a configuration commented out for use with an IDE development environment (http://marionrobert.ide.3wa.io:9000).
- **main.jsx** file: this is the entry point of the React application. It imports necessary modules like React, ReactDOM, App, BrowserRouter, Provider, and store components. Then, it renders the application by encapsulating the App component in a Redux context provided by Provider and a router provided by BrowserRouter, all wrapped in React's strict mode.

At the root of the project, there are also:
- a **public** folder containing the favicon image for this application and screenshots used in this README.
- an **index.html** file defining the basic structure of the React web application page, including metadata such as title, description, links to external resources like stylesheets and scripts, and the main container where the application will be rendered.
- a **vite.config.js** file configuring Vite to support React using the @vitejs/plugin-react plugin. It exports a default configuration specifying the use of the React plugin and contains comments explaining how to adjust server settings for an IDE development environment.

<br/>

## Responsive Design and "Mobile First" Method
Responsive design involves creating websites and applications that automatically adapt to different screen sizes and device types, providing an optimal user experience on desktop computers, tablets, and smartphones. The mobile-first method is a design approach that starts with designing for mobile devices and gradually extends the layout and features for larger screens, prioritizing user experience on mobile devices and simplifying design.

### Example of responsive design on the activity presentation page
<br/>
<div style="display: flex; justify-content: center;">
<img src="/public/screenshots/activityDetails.png" alt="activity presentation in mobile format" width="300">
<img src="/public/screenshots/activityDetailsTabletAndComputer.png" alt="activity presentation in tablet and computer format" width="600">
</div>
<br/>

## Features and User Journey

**User without a specific role:**

A user without an account can only:
- Access the homepage and discover examples of offered activities.
- Create an account.

A logged-in user can:
- Log in, view their profile, and edit their personal information.
- If they want to book an activity/listing, the logged-in user can:
    - View all online listings and the details page of each listing.
    - Filter listings by selecting filter criteria:
        - Book an activity
        - Confirm completing an activity
        - Comment on a completed activity that they had booked
        - View activities they have booked.
- As a creator of a listing, the logged-in user can:
    - Create a listing to offer an activity as a provider ("I offer my help") or recipient ("I need a hand").
    - View, edit, delete listings they have created.
    - Accept a booking.

<br/>

**User with an administrator role:**

- The administrator has a moderator role: they can approve or disapprove the publication of listings and comments created by users to avoid inappropriate content on the platform.
- The administrator can create, edit, or delete categories.

<br/>
<br/>

## Interface Overview

### User Dashboard
<img src="/public/screenshots/dashboard.png" alt="user dashboard" width="800">

<br/>

### Viewing and Filtering Activities
<img src="/public/screenshots/filter-activities.png" alt="viewing and filtering activities" width="800">

<br/>

<br/>

### Accepting, Confirming, and Commenting on a Booking
<div style="display: flex; justify-content: center;">
    <img src="/public/screenshots/bookingCompleted.png" alt="viewing a completed booking" width="500">
    <img src="/public/screenshots/acceptBooking.png" alt="accepting a booking" width="300">
    <img src="/public/screenshots/confirmCompletion.png" alt="confirming activity completion" width="300">
    <img src="/public/screenshots/commentBooking.png" alt="commenting on a completed booking" width="500">

</div>
<br/>

### Administrator Dashboard
<img src="/public/screenshots/dashboardAdmin.png" alt="administrator dashboard" width="800">

<br/>

### Moderation of Activities and Comments by the Administrator
<div style="display: flex; justify-content: center;">
    <img src="/public/screenshots/moderateActivity.png" alt="moderating activity by admin" width="600">
    <img src="/public/screenshots/moderateComment.png" alt="moderating comment by admin
