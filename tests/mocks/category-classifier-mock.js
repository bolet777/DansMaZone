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
export // Dans src/datas/category-classifier.js
const TfIdfClassifier = {
  // Préparation des données (calculer les IDF une seule fois)
  prepare(categoryKeywords) {
    // Utiliser un Map pour améliorer la performance
    const idf = new Map();
    const allTerms = new Set();
    const totalCategories = Object.keys(categoryKeywords).length;
    
    // Premièrement, collecter tous les termes
    for (const keywords of Object.values(categoryKeywords)) {
      for (const keyword of keywords) {
        const terms = preprocessText(keyword);
        for (const term of terms) {
          allTerms.add(term);
        }
      }
    }
    
    // Ensuite, calculer l'IDF pour chaque terme
    for (const term of allTerms) {
      let categoryCount = 0;
      
      // Compter dans combien de catégories le terme apparaît
      for (const [_, keywords] of Object.entries(categoryKeywords)) {
        // Optimisation: éviter de réprocesser les mots-clés à chaque fois
        const containsTerm = keywords.some(keyword => 
          preprocessText(keyword).includes(term)
        );
        
        if (containsTerm) {
          categoryCount++;
        }
      }
      
      // Calculer IDF
      if (categoryCount > 0) {
        idf.set(term, Math.log(totalCategories / categoryCount));
      }
    }
    
    return { idf, allTerms: [...allTerms] };
  },
  
  // Classification d'un produit (optimisée)
  classify(productText, categoryKeywords, preparedData) {
    const { idf } = preparedData;
    const scores = {};
    
    // Prétraiter tout le texte du produit une seule fois
    const productTerms = preprocessText(Object.values(productText).join(' '));
    
    // Calculer TF pour le texte du produit
    const tf = new Map();
    for (const term of productTerms) {
      tf.set(term, (tf.get(term) || 0) + 1);
    }
    
    // Normaliser TF
    const maxTf = Math.max(...tf.values(), 1);
    for (const [term, count] of tf.entries()) {
      tf.set(term, count / maxTf);
    }
    
    // Poids simplifiés pour chaque source de texte
    const sourceWeights = {
      title: 3,
      breadcrumbs: 2.5,
      brand: 1.5,
      features: 1.2,
      details: 1,
      description: 0.8
    };
    
    // Calculer les scores par catégorie
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      let score = 0;
      
      // Créer un ensemble des termes uniques pour cette catégorie (une seule fois)
      const categoryTerms = new Set();
      for (const keyword of keywords) {
        preprocessText(keyword).forEach(term => categoryTerms.add(term));
      }
      
      // Score basé sur TF-IDF global
      for (const term of categoryTerms) {
        if (tf.has(term) && idf.has(term)) {
          score += tf.get(term) * idf.get(term);
        }
      }
      
      // Limiter le nombre de catégories traitées pour de meilleures performances
      if (score > 0) {
        scores[category] = score;
      }
    }
    
    // Trouver la meilleure catégorie
    let bestCategory = 'default';
    let bestScore = 0;
    
    for (const [category, score] of Object.entries(scores)) {
      if (score > bestScore) {
        bestScore = score;
        bestCategory = category;
      }
    }
    
    return bestCategory;
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