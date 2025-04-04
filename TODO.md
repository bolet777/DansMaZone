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

```
// Dans category-sites.js
{
  name: 'Boutique Planète Bébé',
  url: 'https://www.boutiqueplanetebebe.com/search?q=##QUERY##',
  specialties: ['bio', 'écologique', 'zéro déchet'],
  brands: ['Charlie Banana', 'AppleCheeks']
}

// Dans index.js, calculer un score de pertinence
function calculateSiteRelevance(site, searchTerm, productDetails) {
  let score = 1;
  
  // Booste le score si le site est spécialisé dans des termes pertinents
  if (site.specialties) {
    for (const specialty of site.specialties) {
      if (searchTerm.toLowerCase().includes(specialty.toLowerCase())) {
        score += 2;
      }
    }
  }
  
  // Booste si le site vend spécifiquement cette marque
  if (site.brands && productDetails.manufacturer) {
    if (site.brands.some(brand => 
        productDetails.manufacturer.toLowerCase().includes(brand.toLowerCase()))) {
      score += 3;
    }
  }
  
  // Booste les sites déjà utilisés (stockés dans préférences)
  const visitCount = getVisitCount(site.name);
  score += Math.min(visitCount * 0.5, 2); // Max +2 pour les sites fréquents
  
  return score;
}
```

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

