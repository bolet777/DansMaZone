// tests/mocks/category-classifier-mock.js
import { categoryKeywords, categoryMapping } from './extracted-category-data.js';

// Fonction de préprocesseur de texte unifiée
export function preprocessText(text) {
  if (!text) return [];
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Enlève les accents
    .replace(/[^\w\s]/g, ' ')                         // Garde uniquement lettres, chiffres et espaces
    .replace(/\s+/g, ' ')                             // Normalise les espaces
    .trim()
    .split(' ')
    .filter(word => word.length > 2);  // Enlève les mots trop courts
}

// Module TF-IDF pour la classification
export const TfIdfClassifier = {
  // Préparation des données (calculer les IDF une seule fois)
  prepare(categoryKeywords) {
    // Ensemble de tous les mots-clés à travers toutes les catégories
    const allTerms = new Set();
    
    // Extraire tous les termes uniques
    Object.values(categoryKeywords).forEach(keywords => {
      keywords.forEach(keyword => {
        preprocessText(keyword).forEach(term => allTerms.add(term));
      });
    });
    
    // Calculer IDF pour chaque terme
    const idf = {};
    const totalCategories = Object.keys(categoryKeywords).length;
    
    allTerms.forEach(term => {
      // Compter dans combien de catégories le terme apparaît
      let categoryCount = 0;
      
      Object.values(categoryKeywords).forEach(keywords => {
        const keywordTexts = keywords.map(k => preprocessText(k).join(' '));
        if (keywordTexts.some(text => text.includes(term))) {
          categoryCount++;
        }
      });
      
      // Calculer IDF
      idf[term] = Math.log(totalCategories / Math.max(1, categoryCount));
    });
    
    return { idf, allTerms: [...allTerms] };
  },
  
  // Classification d'un produit
  classify(productText, categoryKeywords, preparedData) {
    const { idf } = preparedData;
    
    // Combiner tous les textes du produit
    const allProductText = Object.values(productText).join(' ');
    const productTerms = preprocessText(allProductText);
    
    // Calculer TF pour le texte du produit
    const tf = {};
    productTerms.forEach(term => {
      tf[term] = (tf[term] || 0) + 1;
    });
    
    // Normaliser TF (facultatif)
    const maxTf = Math.max(...Object.values(tf), 1);
    Object.keys(tf).forEach(term => {
      tf[term] = tf[term] / maxTf;
    });
    
    // Calculer le score pour chaque catégorie avec des pondérations différentes selon la source
    const scores = {};
    const sourceWeights = {
      title: 3,     // Le titre est très important
      breadcrumbs: 2.5, // Le fil d'Ariane est très fiable
      brand: 1.5,   // La marque peut être indicative
      features: 1.2,// Les caractéristiques sont assez importantes
      details: 1,   // Les détails sont modérément importants
      description: 0.8 // La description est moins spécifique
    };
    
    Object.entries(categoryKeywords).forEach(([category, keywords]) => {
      // Créer un ensemble des termes uniques pour cette catégorie
      const categoryTerms = new Set();
      keywords.forEach(keyword => {
        preprocessText(keyword).forEach(term => categoryTerms.add(term));
      });
      
      // Score de base pour la catégorie
      let score = 0;
      
      // 1. Score TF-IDF global
      categoryTerms.forEach(term => {
        if (tf[term] && idf[term]) {
          score += tf[term] * idf[term];
        }
      });
      
      // 2. Scores pondérés par source de texte
      Object.entries(productText).forEach(([source, text]) => {
        if (sourceWeights[source] && text) {
          const sourceTerms = preprocessText(text);
          const sourceWeight = sourceWeights[source];
          
          categoryTerms.forEach(term => {
            // Vérifier si le terme apparaît dans cette source spécifique
            if (sourceTerms.includes(term) && idf[term]) {
              score += sourceWeight * idf[term];
            }
          });
        }
      });
      
      scores[category] = score;
    });
    
    // Trouver la meilleure catégorie
    const sortedCategories = Object.entries(scores)
      .sort((a, b) => b[1] - a[1]);
    
    return sortedCategories[0][0]; // Retourne la catégorie avec le score le plus élevé
  }
};

// Fonction pour classifier un produit directement
export function classifyProduct(productData, lang = 'fr') {
  // Obtenir les mots-clés pour la langue spécifiée
  const testKeywords = {};
  
  // Extraire les mots-clés de l'objet par langue
  Object.entries(categoryKeywords).forEach(([category, keywordsByLang]) => {
    testKeywords[category] = keywordsByLang[lang] || [];
  });
  
  // Préparer les données TF-IDF
  const preparedData = TfIdfClassifier.prepare(testKeywords);
  
  // Construire un objet texte de produit à partir des données
  const productText = {
    title: productData.title || '',
    breadcrumbs: productData.breadcrumbs ? 
      (Array.isArray(productData.breadcrumbs) ? 
        productData.breadcrumbs.join(' ') : 
        productData.breadcrumbs) : '',
    brand: productData.brand || '',
    features: productData.features || '',
    details: productData.details || '',
    description: productData.description || ''
  };
  
  // Classifier le produit
  let category = TfIdfClassifier.classify(productText, testKeywords, preparedData);
  
  // Si aucune catégorie n'est trouvée, utiliser 'default'
  if (!category) {
    category = 'default';
  }
  
  return category;
}

// Exporter aussi les catégories pour les tests
export { categoryKeywords, categoryMapping };