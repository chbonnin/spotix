# Spotix

## Description

Application mobile permettant de localiser les commerçants acceptant le Stück, la monnaie locale et citoyenne de Strasbourg, Spotix permet en fait de situer n'importe quelle liste de lieux.
Etant écrit en Javascript, le projet peut être compilé via [Cordova](https://cordova.apache.org) sur les plateformes Android ou iOS (ou autres...).
Il est également possible de le faire fonctionner dans un navigateur (testé sous Safari et Firefox) même si dans ce cas la [carte sous OpenStreetMap](https://umap.openstreetmap.fr/fr/map/professionnels-du-stuck_53852) disponible sur le site du Stück offre les mêmes fonctionnalités.
Sur un smartphone, les données mobiles ne sont utilisées que pour afficher les fonds de carte ou pour télécharger une nouvelle liste de lieux.

## Fonctionnalités

### Carte
La carte permet de se localiser ainsi que le lieux de la liste dans le voisinage. Le bouton en haut à droite recentre la carte sur la position courante indiquée par un cercle rouge.
![Carte](doc/screenshots/carte.jpg)

Toucher une des icônes affiche une bulle contenant le nom du lieu ainsi qu'une description, l'adresse et un lien permettant de consulter les autres informations.
![Carte avec bulle](doc/screenshots/carteBulle.jpg)

### Liste des lieux
![Liste des lieux](doc/screenshots/liste.jpg)
Cette liste contient les lieux des catégories sélectionnées (toutes par défaut).
En haut de la liste se trouve une zone de recherche permettant de chercher un texte dans les champs nom, description, observation (défi).
Une ligne supplémentaire en bas de la liste donne le nombre d'éléments affichés.

### Catégories
![Catégories](doc/screenshots/categories.jpg)
Cette liste permet de filtrer les éléments présents dans la liste précédente et sur la carte.
La ligne supplémentaires "Toutes" en première position permet de (dé)sélectionner toute la liste d'un coup.
