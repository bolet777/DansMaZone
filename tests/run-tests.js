// tests/run-tests.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import './setup-node.js'; // Configuration de l'environnement de test

// Importer directement depuis le fichier source
import { 
  preprocessText, 
  categoryKeywords,
  classifyPage,
  extractProductText
} from '../src/datas/category-classifier.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("✅ Environnement Node.js configuré pour les tests");

// Charger les cas de test
const testCasesPath = path.join(__dirname, 'test-cases.json');
let testCases;

try {
  testCases = JSON.parse(fs.readFileSync(testCasesPath, 'utf8'));
} catch (error) {
  console.error(`❌ Erreur lors du chargement des cas de test: ${error.message}`);
  process.exit(1);
}

// Fonction pour mocker le DOM avec les données de test
function setupMockDOM(productData) {
  // Mock querySelector pour les éléments principaux
  global.document.querySelector = (selector) => {
    switch(selector) {
      case '#productTitle':
        return productData.title ? { textContent: productData.title } : null;
      case '#productDescription':
        return productData.description ? { textContent: productData.description } : null;
      case '#feature-bullets':
        return productData.features ? { textContent: productData.features } : null;
      case '#detailBullets_feature_div':
        return productData.details ? { textContent: productData.details } : null;
      case '.po-brand .po-break-word, #bylineInfo, [id*="brand"]':
        return productData.brand ? { textContent: productData.brand } : null;
      default:
        return null;
    }
  };
  
  // Mock querySelectorAll pour les breadcrumbs
  global.document.querySelectorAll = (selector) => {
    if (selector.includes('breadcrumb')) {
      if (!productData.breadcrumbs) return [];
      
      const breadcrumbs = Array.isArray(productData.breadcrumbs) ? 
        productData.breadcrumbs : 
        productData.breadcrumbs.split(' ').filter(x => x.trim());
      
      return breadcrumbs.map(text => ({ textContent: text.trim() }));
    }
    return [];
  };
  
  // Mock window.location pour éviter les erreurs de cache
  global.window.location = { 
    pathname: '/test-' + Math.random(),
    href: 'https://www.amazon.ca/test'
  };
}

// Nouvelle fonction classifyProduct qui utilise le vrai code de production
async function classifyProduct(testCase, lang = 'fr') {
  // Simuler la page avec l'URL
  global.window.location = { 
    pathname: new URL(testCase.url).pathname,
    href: testCase.url
  };
  
  // Mock minimal du DOM avec juste le titre
  global.document.querySelector = (selector) => {
    if (selector === '#productTitle') {
      return { textContent: testCase.name };
    }
    return null;
  };
  global.document.querySelectorAll = () => [];
  
  // Utiliser les vraies fonctions
  const combinedKeywords = {}; // ... comme avant
  const result = await classifyPage(combinedKeywords);
  return result;
}



async function classifyProduct_OLD(productData, lang = 'fr') {
  // Configurer le DOM mock avec les données de test
  setupMockDOM(productData);
  
  // Construire les mots-clés comme le fait getCombinedKeywords dans l'extension
  const combinedKeywords = {};
  Object.entries(categoryKeywords).forEach(([category, keywordsByLang]) => {
    combinedKeywords[category] = keywordsByLang[lang] || [];
  });
  
  // Remplacer temporairement getCombinedKeywords
  global.getCombinedKeywords = () => Promise.resolve(combinedKeywords);
  
  try {
    // Utiliser directement la vraie fonction classifyPage
    const result = await classifyPage(combinedKeywords);
    return result;
  } finally {
    // Restaurer le mock par défaut
    global.getCombinedKeywords = () => Promise.resolve({});
  }
}


// Tests
function runTest(name, actual, expected) {
  const areEqual = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${areEqual ? '✅' : '❌'} ${name}`);
  
  if (!areEqual) {
    console.log(`  Expected: ${JSON.stringify(expected)}`);
    console.log(`  Actual:   ${JSON.stringify(actual)}`);
  }
  
  return areEqual;
}

async function runPreprocessTests() {
  console.log("\n🧪 TESTS DE LA FONCTION preprocessText");
  console.log("=====================================");
  
  let passed = 0;
  let total = testCases.preprocessText.length;
  
  for (const testCase of testCases.preprocessText) {
    const result = preprocessText(testCase.input);
    if (runTest(testCase.name, result, testCase.expected)) {
      passed++;
    }
  }
  
  console.log(`\n✨ Résultat: ${passed}/${total} tests réussis ✨`);
  return { passed, total };
}

async function runCategoryTests() {
  console.log("\n🧪 TESTS DE CLASSIFICATION DE PRODUITS");
  console.log("=====================================");
  
  let passed = 0;
  let total = testCases.productCategories.length;
  
  for (const testCase of testCases.productCategories) {
    console.log(`\nTest: ${testCase.name}`);
    console.log(`URL: ${testCase.url}`);
    
    const detectedCategory = await classifyProduct(testCase);
    
    console.log(`Catégorie attendue: ${testCase.expectedCategory}`);
    console.log(`Catégorie détectée: ${detectedCategory}`);
    
    if (detectedCategory === testCase.expectedCategory) {
      console.log('✅ Classification correcte!');
      passed++;
    } else {
      console.log('❌ Classification incorrecte!');
    }
  }
  
  console.log(`\n✨ Résultat: ${passed}/${total} classifications correctes ✨`);
  return { passed, total };
}

async function runAllTests() {
  console.log("🔍 EXÉCUTION DES TESTS DANSMAZONE");
  console.log("================================");
  
  const preprocessResults = await runPreprocessTests();
  const categoryResults = await runCategoryTests();
  
  const totalPassed = preprocessResults.passed + categoryResults.passed;
  const totalTests = preprocessResults.total + categoryResults.total;
  
  console.log("\n📊 RÉSUMÉ DES TESTS");
  console.log("=================");
  console.log(`Tests de preprocessText: ${preprocessResults.passed}/${preprocessResults.total}`);
  console.log(`Tests de classification: ${categoryResults.passed}/${categoryResults.total}`);
  console.log(`Total: ${totalPassed}/${totalTests} (${Math.round(totalPassed/totalTests*100)}%)`);
  
  process.exit(totalPassed === totalTests ? 0 : 1);
}

runAllTests().catch(error => {
  console.error('❌ Erreur lors de l\'exécution des tests:', error);
  process.exit(1);
});