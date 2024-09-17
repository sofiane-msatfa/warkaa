# Tableau descriptif des données :
| Fichier             | Clé principale       | Clés secondaires                                      | Description associée                                                                       |
|---------------------|----------------------|-------------------------------------------------------|--------------------------------------------------------------------------------------------|
| activity.csv        | EntityNumber          | ActivityGroup, NaceVersion, NaceCode, Classification   | Groupes d'activités des entités selon la classification NACE.                               |
| adress.csv          | EntityNumber          | Zipcode, MunicipalityNL, StreetNL, HouseNumber         | Adresses des entités, y compris la municipalité, le code postal et l'adresse.               |
| branch.csv          | Id                    | EnterpriseNumber, StartDate                            | Date de début et numéro d'entreprise associé à chaque branche d'entreprise.                 |
| code.csv            | ActivityGroup         | Language, Description                                  | Descriptions des groupes d'activités en plusieurs langues.                                  |
| contact.csv         | EntityNumber          | ContactType, Value                                     | Informations de contact (téléphone, email) des entités.                                     |
| denomination.csv    | EntityNumber          | Language, TypeOfDenomination, Denomination             | Dénominations officielles et abrégées des entités.                                          |
| entreprise.csv      | EnterpriseNumber      | Status, JuridicalSituation, TypeOfEnterprise, StartDate| Statut juridique, type d'entreprise, et forme juridique des entreprises.                    |
| establishement.csv  | EstablishmentNumber   | EnterpriseNumber, StartDate                            | Liste des établissements avec le numéro d'entreprise et la date de début d'activité.        |

## Liens existants :
- Le **EntityNumber** est la clé principale utilisée dans plusieurs fichiers pour relier les informations d'activités, d'adresses, de contacts et de dénominations.
- Le **EnterpriseNumber** est partagé entre les fichiers **branch.csv**, **entreprise.csv**, et **establishement.csv**, permettant de relier les branches et établissements à une entreprise spécifique.
