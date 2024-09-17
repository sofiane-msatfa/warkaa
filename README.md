# Warkaa

### Projet de Développement d'une Application Web de Recherche et Consultation d'Entreprises Belges ### 

#### Contexte et Objectif ####

L'objectif de ce projet est de développer une application web inspirée de **pappers.be**, utilisant les données ouvertes de la Banque-Carrefour des Entreprises (BCE/KBO) de Belgique au format CSV. L'application permettra aux utilisateurs de téléverser des fichiers CSV, de rechercher et consulter des informations sur les entreprises belges, avec des filtres de recherche avancés.

#### Fonctionnalités Principales ####

1. **Écran d'Accueil et Téléversement de CSV**
   - **Téléversement de fichiers CSV** : Permettre aux utilisateurs de téléverser des fichiers CSV contenant des informations sur les entreprises. Ces fichiers seront utilisés pour mettre à jour la base de données de l'application avec les données d'entreprises belges les plus récentes.

2. **Recherche Avancée**
   - **Par numéro d'entreprise** : Permettre aux utilisateurs de rechercher une entreprise spécifique en utilisant son numéro d'identification.
   - **Par nom d'entreprise** : Fournir une recherche basée sur le nom de l'entreprise.
   - **Par activité** : Offrir la possibilité de rechercher des entreprises en fonction de leur secteur d'activité (ActivityGroup et définition de NaceCode).
   - **Par adresse** : Permettre la recherche d'entreprises situées à une adresse spécifique ou dans une région donnée (deux premiers chiffres du code postal).

3. **Gestion des Profils et Listes de Souhaits**
   - **Création de Profil** : Permettre aux utilisateurs de créer et gérer leurs profils, en stockant leurs préférences et historiques de recherche.
   - **Liste de Souhaits et Grattage Automatisé** : Offrir une fonctionnalité où les utilisateurs peuvent sélectionner et sauvegarder plusieurs entrées des résultats de recherche dans une liste de souhaits pour une requête de scrapping via les sites de KBO et Companyweb. L'utilisateur sera ensuite notifié dans son espace profil avec des cartes "avancées" d'entreprises contenant les différents éléments scrappés (https://www.companyweb.be/fr // kbopub.economie.fgov.be/kbopub/toonondernemingps.html?ondernemingsnummer=418144729).

#### Exigences Techniques

- **Base de données** : MongoDB.
- **Backend** : Node.js / Express.js ou Nest.js.
- **Frontend** : React Native + Expo.
- **API de données ouvertes** : Swagger.
- **Sécurité** : JWT avec refresh token et auth token, utilisation d'un AuthProvider et d'un AuthContext.
