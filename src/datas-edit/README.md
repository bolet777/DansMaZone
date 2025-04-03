# DansMaZone URL Checker

Ce mini-serveur Node.js permet de tester la validité des URLs pour l'outil d'édition de sites de DansMaZone.

## Fonctionnalités

- Vérification fiable des URLs avec de vrais tests HTTP
- Détection des erreurs DNS et des connexions refusées
- Gestion des redirections et analyse des codes de statut HTTP
- API REST simple pour l'intégration avec l'interface utilisateur
- Mode batch pour tester plusieurs URLs simultanément

## Prérequis

- Node.js 14.0 ou supérieur
- npm

## Installation

Depuis la racine du projet DansMaZone, exécutez:

```bash
npm run edit-sites:install
```

Cette commande installera toutes les dépendances nécessaires dans le dossier `src/datas-edit/url-checker`.

## Utilisation

### Démarrer le serveur

Depuis la racine du projet DansMaZone, exécutez:

```bash
npm run edit-sites
```

Le serveur démarrera sur le port 3000 (par défaut) et vous verrez un message de confirmation dans la console.

### Accéder à l'outil d'édition

Ouvrez votre navigateur et accédez à:

```
http://localhost:3000/editSites.html
```

L'outil d'édition se connectera automatiquement au serveur pour effectuer des tests d'URL fiables.

## Notes techniques

Le serveur expose les API REST suivantes:

- `POST /check-url`: Vérifie une URL individuelle
- `POST /check-urls-batch`: Vérifie un lot d'URLs en parallèle
- `GET /load-default-sites`: Charge le fichier default-sites.json
- `POST /save-sites`: Sauvegarde les sites dans default-sites-generated.json

## Résolution des problèmes

Si vous rencontrez des erreurs:

1. Vérifiez que le serveur est bien démarré avant d'ouvrir l'interface web
2. Assurez-vous que le port 3000 est disponible
3. Consultez les logs du serveur dans la console pour plus de détails

Pour toute assistance supplémentaire, merci de créer une issue sur le dépôt GitHub du projet.