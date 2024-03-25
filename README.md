# Bienvenue sur *Harmony* : Apprenez à connaître vos voisins en échangeant des coups de main ! 🌳🌞🤝
Harmony est né d'un constat simple. Les personnes bénéficiant d'une protection internationale ont vocation à s'installer durablement en France du fait de leur situation mais elles éprouvent souvent des difficultés à s'intégrer. Nous sommes convaincus que leur intégration peut être facilitée à l'échelle de la ville. Malheureusement, on constate en général un manque d’interactions sociales entre les habitants de longue date et les personnes protégées nouvellement arrivées. Cela est la conséquence directe d’une méconnaissance de l’autre et d’idées préconçues. Le but de notre projet est de favoriser l’inclusion des personnes protégées en développant les échanges et la solidarité entre les habitants d'une même ville. Cette solidarité naîtra de l’échange de coups de main entre voisins. Sur notre site, vous pouvez proposer et/ou réserver une activité pour donner et/ou recevoir un coup de main de la part de vos voisins. En réalisant un coup de main pour quelqu'un, vous gagnez des points que vous pourrez ensuite utiliser pour obtenir de l'aide auprès d'autres utilisateurs.

Bienvenue dans la partie frontend de ce projet !

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
1. Clonez le dépôt Git : `git clone https://github.com/marionrobert/harmony-front-react.git`
2. Assurez-vous d'avoir la stack technologique installée avec les bonnes versions.
3. Lancer la commande `npm install` pour installer les dépendences.
(description à venir)
<br/>

## Contenu des fichiers 📁🗃️

Le projet est organisé en plusieurs dossiers et fihciers présents dans le dossier principal **src** (présent à la racine) : 
- dossier **api** : contient des fichiers qui gèrent les requêtes HTTP vers l'API de l'application. Par exemple, dans le fichier activity.jsx, plusieurs fonctions sont définies pour interagir avec les ressources liées aux activités. Ces fonctions utilisent Axios pour effectuer des requêtes HTTP vers l'API, en récupérant, en créant, en mettant à jour ou en supprimant des activités, ainsi que d'autres opérations telles que la gestion des filtres ou des images. Les fonctions prennent en charge l'ajout de jetons d'authentification pour les requêtes sécurisées et manipulent les réponses et les erreurs renvoyées par l'API.
- dossier **components** : contient des fichiers qui définissent des composants réutilisables à travers l'application. Il y a 4 composants : ActivityCard.jsx, CommentCard.jsx, Footer.jsx, Header.jsx
- dossier **containers** : contrairement aux composants réutilisables dans le dossier "components", les composants dans le dossier "containers" sont souvent spécifiques à des vues de l'application.
- dossier **fonts** : contient des fichiers de police au format TrueType Font (.ttf), utilisés pour définir les styles de texte dans l'application web.
- dossier **helpers** : contient le fichier require-data-auth.jsx qui définit un composant React qui agit en tant que Higher-Order Component (HOC) pour contrôler les données et la sécurité des routes. Il gère la récupération des paramètres de la route, l'extraction des états depuis le store Redux, la gestion de la redirection en fonction de l'authentification de l'utilisateur, et effectue des appels API pour vérifier l'authenticité du token d'utilisateur. En fonction de l'état de l'authentification et des rôles de l'utilisateur, il redirige vers les pages appropriées ou affiche le composant enfant avec les paramètres transmis.
- dossier **slices** : contient plusieurs fichiers associés à la gestion de l'état global de l'application à l'aide de Redux, un gestionnaire d'état pour les applications JavaScript.
  - **store.jsx** : contient la configuration du magasin Redux de votre application, qui combine tous les "slices" définis dans votre application pour créer un seul et unique "store" gérant l'état global de l'application.
  - **activitySlice.jsx**: définit un "slice" pour gérer l'état lié aux activités dans votre application. Il contient des actions, des reducers et des sélecteurs pour manipuler et récupérer des données liées aux activités.
  - **basketSlice.jsx** : définit un "slice" pour gérer l'état du panier dans votre application, stockant les produits ou articles sélectionnés par l'utilisateur. Il inclut des actions pour mettre à jour et nettoyer le panier, ainsi que des fonctions pour calculer le montant total du panier.
  - **userSlice.jsx** : définit un "slice" pour gérer l'état de l'utilisateur dans votre application, stockant les informations de connexion telles que l'identifiant de l'utilisateur et le token d'authentification. Il contient des actions pour définir l'utilisateur et le déconnecter, ainsi que des sélecteurs pour récupérer les informations de l'utilisateur.
- fichier **App.jsx** : définit le composant racine de l'application. Il organise les routes et les composants de l'application en utilisant React Router pour la navigation. Il inclut également les en-têtes et pieds de page de l'application, ainsi que des routes pour différentes fonctionnalités telles que la gestion des activités, les réservations, l'authentification des utilisateurs et les fonctionnalités administratives.
- fichier **App.scss** : contient le CSS applicable à l'ensemble de l'application. Il suit la méthode "mobile first", ce qui signifie que le CSS pour les formats mobiles est défini en premier, suivi des adaptations pour les formats tablette et ordinateur. Le CSS est structuré par containers et composants.
- fichier **config.js** : contient un objet config qui stocke les informations nécessaires à l'application, telles que les URL de l'API et les URL des images. Actuellement, il est configuré pour utiliser des URL locales (http://localhost:9000), mais il existe également une configuration en commentaire pour une utilisation avec un environnement de développement IDE (http://marionrobert.ide.3wa.io:9000).
- fichier **main.jsx** : c'est le point d'entrée de l'application React. Il importe les modules nécessaires, tels que React, ReactDOM, et les composants App, BrowserRouter, Provider, et store. Ensuite, il rend l'application en encapsulant le composant App dans un contexte de Redux fourni par Provider et un routeur fourni par BrowserRouter, le tout enveloppé dans un mode strict de React.


A la racine du projet, il existe également:
- un dossier **public** qui contient uniquement l'image servant de favicon.
- un fichier **index.html** qui définit la structure de base de la page web de l'application React, incluant des métadonnées telles que le titre, la description, des liens vers des ressources externes comme des feuilles de style et des scripts, ainsi que le conteneur principal où l'application sera rendue.
- un **fichier vite.config.js** quiconfigure Vite pour prendre en charge React en utilisant le plugin @vitejs/plugin-react. Il exporte une configuration par défaut qui spécifie l'utilisation du plugin React et il contient des commentaires expliquant comment ajuster les paramètres du serveur pour un environnement de développement IDE.

<br/>

## Fonctionnalités
(description à venir)

<br/>

## Responsive design

<br/>

## Dossier lié 🔗
La partie backend de l'application est accessible [ici](https://github.com/marionrobert/finalProjet-api-back)
