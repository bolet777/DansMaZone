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




------------------------------------------------------------
Tests unitaires uniquement:

npm test

------------------------------------------------------------

## Optimisation

# Analyse approfondie des performances et scalabilité pour DansMaZone

## Problématique actuelle

D'après les métriques partagées, l'extension prend environ 8 secondes pour s'exécuter, ce qui est excessif et nuit à l'expérience utilisateur. En considérant que vous prévoyez d'augmenter significativement le volume de données (sites et mots-clés), la situation risque de s'aggraver sans une refonte des mécanismes sous-jacents.

## Analyse détaillée des goulots d'étranglement

### 1. Algorithme TF-IDF (43.7% du temps)

Le classificateur TF-IDF est extrêmement coûteux en termes de calcul. Pour chaque page produit, l'extension:
- Traite tous les mots-clés de toutes les catégories
- Calcule les scores IDF pour chaque terme unique
- Effectue de multiples parcours sur les mêmes données

Ce processus est particulièrement inefficace à mesure que le nombre de catégories et de mots-clés augmente.

### 2. Manipulation du DOM et MutationObserver (39.7% + 40%)

Le code actuel:
- Utilise des MutationObserver avec une portée trop large
- Effectue de nombreuses insertions/manipulations DOM séquentielles
- Recrée entièrement des éléments DOM à chaque exécution

### 3. Traitement répétitif des textes

La fonction `preprocessText()` est appelée de nombreuses fois sur les mêmes données sans mise en cache, ce qui multiplie les opérations coûteuses comme la normalisation et les expressions régulières.

### 4. Initialisation synchrone et chargement des données

L'approche actuelle charge et traite toutes les données de manière synchrone, bloquant le thread principal pendant plusieurs secondes.

## Solutions stratégiques pour la scalabilité

### 1. Refonte complète de l'approche de classification

Au lieu du TF-IDF complet à chaque fois:

```
Approche actuelle (coûteuse):
1. Extraire le texte du produit
2. Traiter tous les mots-clés de toutes les catégories
3. Calculer les scores pour chaque catégorie
```

**Proposition: Classification hiérarchique et progressive**

```
Nouvelle approche (efficace):
1. Classification grossière rapide basée sur les fils d'Ariane et le titre (regroupement en méta-catégories)
2. Analyse approfondie uniquement sur les catégories potentiellement pertinentes
3. Mise en cache des résultats par modèle d'URL
```

**Implémentation technique**:
- Créer un index inversé prétraité (mots-clés → catégories) au chargement de l'extension
- N'effectuer l'analyse approfondie que sur un sous-ensemble de catégories pertinentes
- Introduire un système de scores par "signaux forts" (ex: correspondance exacte dans le titre)

Cette approche réduirait considérablement le nombre de comparaisons nécessaires.

### 2. Architecture découplée et asynchrone

**Problème actuel**: Tout le traitement est fait d'un seul bloc, bloquant le thread principal.

**Solution**: Découpler les étapes du pipeline et utiliser un traitement asynchrone:

```javascript
// Architecture découplée proposée
class DansMaZoneProcessor {
  constructor() {
    this.phases = [
      this.loadBasicData,        // Charge les données essentielles (priorité haute)
      this.detectProductType,    // Détermine rapidement si livre/produit (priorité haute)
      this.initialRender,        // Affiche une interface utilisateur minimale (priorité haute)
      this.loadExtendedData,     // Charge les données supplémentaires (priorité moyenne)
      this.improveClassification, // Raffine la classification (priorité basse)
      this.enhanceUI             // Améliore l'interface utilisateur (priorité basse)
    ];
  }
  
  async process() {
    // Exécuter les phases de priorité haute immédiatement
    for (let i = 0; i < 3; i++) {
      await this.phases[i].call(this);
    }
    
    // Exécuter les phases de priorité moyenne/basse de manière non-bloquante
    setTimeout(() => {
      (async () => {
        for (let i = 3; i < this.phases.length; i++) {
          await this.phases[i].call(this);
        }
      })();
    }, 0);
  }
}
```

Cette architecture permettrait:
- Un affichage rapide d'une interface minimale 
- Un raffinement progressif sans bloquer l'interaction utilisateur
- Une meilleure répartition de la charge

### 3. Système de mise en cache à plusieurs niveaux

**Mise en cache des données transformées**:
- Prétraiter et stocker les mots-clés transformés 
- Utiliser IndexedDB pour conserver les données volumineuses entre les sessions

**Mise en cache des résultats de classification**:
- Stocker les résultats de classification par modèle d'URL et ASIN
- Réutiliser les résultats pour des produits similaires

**Mise en cache du DOM**:
- Créer des templates HTML réutilisables
- Utiliser `DocumentFragment` pour minimiser les reflows

### 4. Prétraitement des données et indexation

Pour gérer l'augmentation prévue du volume de données:

**Index inversé pour les mots-clés**:
```javascript
// Créer un index inversé mot → catégories
function buildKeywordIndex(categoryKeywords) {
  const index = new Map();
  
  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    keywords.forEach(keyword => {
      const terms = preprocessText(keyword);
      terms.forEach(term => {
        if (!index.has(term)) {
          index.set(term, new Set());
        }
        index.get(term).add(category);
      });
    });
  });
  
  return index;
}

// Utiliser l'index pour une classification rapide
function quickClassify(productText, keywordIndex) {
  const terms = preprocessText(productText);
  const categoryCounts = new Map();
  
  terms.forEach(term => {
    if (keywordIndex.has(term)) {
      keywordIndex.get(term).forEach(category => {
        categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
      });
    }
  });
  
  // Retourner les N catégories les plus probables
  return Array.from(categoryCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category]) => category);
}
```

Cette approche permet d'identifier rapidement un sous-ensemble de catégories candidates, réduisant considérablement la charge de calcul.

### 5. Réduction de la fréquence du travail complet

**Approche actuelle**: L'extension exécute le pipeline complet sur chaque page produit.

**Proposition**: Introduire une logique de "court-circuit" pour les cas simples:

```javascript
async function process() {
  // 1. Vérifier si c'est une page produit
  if (!isProductPage()) return;
  
  // 2. Vérifier si on a déjà traité cette page/ASIN
  const asin = extractASIN();
  const cachedResult = await getCachedResult(asin);
  if (cachedResult) {
    renderFromCache(cachedResult);
    return;
  }
  
  // 3. Vérifier les signaux évidents (ex: "Livres" dans le fil d'Ariane)
  const obviousCategory = checkForObviousCategory();
  if (obviousCategory) {
    renderForCategory(obviousCategory);
    // Continuer le traitement en arrière-plan pour améliorer
    backgroundProcess();
    return;
  }
  
  // 4. Si nécessaire, exécuter le traitement complet
  fullProcess();
}
```

## Recommandations pour l'implémentation

### Phase 1: Optimisations immédiates (réduire de 8s à ~1-2s)

1. **Optimiser le traitement du texte**: 
   - Implémenter un système de cache pour `preprocessText`
   - Limiter la quantité de texte traitée (ex: max 200 premiers caractères)

2. **Simplifier l'algorithme de classification**:
   - Implémenter une classification en deux étapes (grossière puis affinée)
   - Limiter le nombre de catégories analysées en profondeur

3. **Améliorer les manipulations DOM**:
   - Utiliser `DocumentFragment` pour les constructions complexes
   - Réduire la portée des MutationObservers
   - Implémenter un système de templates HTML

4. **Décaler le chargement des données**:
   - Charger initialement uniquement les données essentielles
   - Charger progressivement les données supplémentaires

### Phase 2: Architecture pour la scalabilité (support de grandes quantités de données)

1. **Restructurer les données**:
   - Organiser les catégories de manière hiérarchique
   - Introduire des "méta-catégories" pour un premier filtrage rapide
   - Ajouter des poids aux mots-clés pour différencier leur importance

2. **Mettre en œuvre un système de cache persistant**:
   - Utiliser IndexedDB pour les données volumineuses
   - Mettre en cache les résultats de classification par ASIN
   - Prétraiter les index lors de l'installation/mise à jour

3. **Implémentation du traitement progressif**:
   - Interface utilisateur disponible rapidement
   - Amélioration progressive des résultats
   - Prioritisation des opérations critiques

4. **Système d'analyse d'usage**:
   - Collecter (avec opt-in) des métriques sur les catégories les plus utilisées
   - Adapter la stratégie de chargement en fonction de l'usage réel

## Conclusion et premiers pas

La refonte proposée conservera toutes les fonctionnalités actuelles tout en permettant une scalabilité significative. Les optimisations immédiates réduiront considérablement le temps de chargement, tandis que les changements architecturaux permettront d'absorber l'augmentation prévue du volume de données.

**Actions prioritaires**:
1. Réimplémenter la classification avec l'approche hiérarchique et l'index inversé
2. Restructurer le chargement pour afficher l'interface rapidement
3. Ajouter un système de cache pour les résultats de classification
4. Découpler le pipeline de traitement en opérations asynchrones

Ces changements permettront d'obtenir des performances acceptables tout en préparant le terrain pour une extension capable de gérer un volume beaucoup plus important de données.
