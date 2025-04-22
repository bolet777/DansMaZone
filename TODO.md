## Robustesse et gestion des erreurs

**Améliorer la résistance aux changements d'Amazon**
   - Rendre les sélecteurs CSS plus robustes en utilisant des attributs plus stables ou des combinaisons de sélecteurs.

**Implémenter un système de gestion d'erreurs complet**
   - Ajouter des messages d'erreur significatifs et des mécanismes de récupération pour les cas comme le stockage local corrompu.

**Vérifier les permissions utilisateur**
   - Ajouter des tests pour confirmer que les permissions nécessaires ont été accordées par l'extension.


## Performance et optimisation

**Améliorations de la recherche des sites locaux**

- url de recherche FR et EN
- ajouter des specialités et des marque par category-sites

Phase préparatoire

Créer le fichier brands.json avec quelques marques majeures
Générer les identifiants uniques selon l'approche choisie
Ajouter quelques références dans default-sites.json pour tester


Implémentation du chargement

Adapter la fonction initSites() pour charger brands.json
Créer une fonction de mapping entre identifiants et objets marques
Tester le chargement et le mapping


Amélioration de l'algorithme de détection

Enrichir getProductDetails() pour mieux extraire le fabricant
Ajouter une logique de correspondance entre fabricant et marques


Adaptation de l'interface d'options

Ajouter des composants UI pour la gestion des marques
Mettre en place l'autocomplétion ou la sélection dans des listes


Finalisation

Tests et débogage
Enrichissement du fichier brands.json avec plus de marques
Documentation des nouveaux mécanismes

**Améliorer l'algorithme de classification**
   - L'algorithme pourrait bénéficier d'une approche d'apprentissage automatique supervisée
   - Considérer l'utilisation de modèles pré-entraînés ou d'APIs d'IA pour la classification

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

```
// Base de données des marques
const brandWebsites = {
  'Sony': {
    url: 'https://www.sony.ca/fr/search?q=##QUERY##',
    categories: ['Électronique', 'Photo']
  },
  'Samsung': {
    url: 'https://www.samsung.com/ca_fr/search/?searchvalue=##QUERY##',
    categories: ['Électronique', 'Électroménager']
  }
  // etc.
};

// Dans le code qui génère la barre latérale
function addOfficialSiteSection(manufacturer, searchTerm) {
  if (manufacturer && brandWebsites[manufacturer]) {
    const brandSection = document.createElement('div');
    brandSection.className = 'dmz-brand-section';
    
    const header = document.createElement('h3');
    header.textContent = 'Site officiel';
    
    const link = document.createElement('a');
    link.href = brandWebsites[manufacturer].url.replace('##QUERY##', searchTerm);
    link.textContent = manufacturer;
    link.target = '_blank';
    
    brandSection.appendChild(header);
    brandSection.appendChild(link);
    sidebarEl.insertBefore(brandSection, contentContainer);
  }
}
```

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

