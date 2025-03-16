## Robustesse et gestion des erreurs

**Améliorer la résistance aux changements d'Amazon**
   - Rendre les sélecteurs CSS plus robustes en utilisant des attributs plus stables ou des combinaisons de sélecteurs.

**Implémenter un système de gestion d'erreurs complet**
   - Ajouter des messages d'erreur significatifs et des mécanismes de récupération pour les cas comme le stockage local corrompu.

**Vérifier les permissions utilisateur**
   - Ajouter des tests pour confirmer que les permissions nécessaires ont été accordées par l'extension.


## Performance et optimisation

**Améliorer l'algorithme de classification**
   - Remplacer l'approche actuelle par une méthode plus sophistiquée comme TF-IDF pour le matching de mots-clés.

**Implémenter le caching des sites**
   - Utiliser l'API LRU-Cache pour stocker les sites fréquemment consultés.

**Optimiser le bundle webpack**
   - Ajouter la minification CSS et la compression des images.

**Implémenter un chargement paresseux des catégories**
   - Charger à la demande les catégories moins fréquemment utilisées.

## Expérience utilisateur

**Améliorer l'accessibilité du bandeau**
   - Rendre l'interface plus réactive et conforme aux normes d'accessibilité.

**Ajouter le support du mode sombre**
   - Détecter les préférences de l'utilisateur et adapter le thème de l'extension.

**Valider les entrées utilisateur**
   - Ajouter une validation pour les noms de catégories personnalisées (longueur, caractères spéciaux).

## Nouvelles fonctionnalités

**Ajouter des recherches spécifiques par marque**
   - Implémenter une logique pour rediriger directement vers les sites officiels des marques (ex: https://epson.ca/search/?text=EcoTank).

**Collecter des métriques d'utilisation anonymes**
   - Ajouter une option pour les utilisateurs d'accepter la collecte de données anonymes sur les fonctionnalités utilisées.

## Tests et qualité

**Ajouter des tests unitaires**
   - Mettre en place des tests pour les fonctions cruciales d'extraction de données et de classification.

**Corriger les bugs d'extraction de catégories**
   - Revoir les sélecteurs dans `category-classifier.js` pour qu'ils fonctionnent avec la structure actuelle d'Amazon.


## Compatibilité

**Uniformiser la configuration du manifeste**
   - Choisir une source unique de vérité pour le manifeste de l'extension.

**Vérifier la normalisation pour le Google Store**
   - S'assurer que l'extension respecte les directives de publication du Chrome Web Store.

