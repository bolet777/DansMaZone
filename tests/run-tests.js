// tests/run-tests.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import './setup-node.js'; // Configuration de l'environnement de test

// Importer directement depuis le fichier source
import { 
  preprocessText, 
  categoryKeywords, 
  categoryMapping 
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

// Classification simple pour les tests (version synchrone)
function classifyProduct(productData, lang = 'fr') {
  const keywords = {};
  
  Object.entries(categoryKeywords).forEach(([category, keywordsByLang]) => {
    keywords[category] = keywordsByLang[lang] || [];
  });
  
  const productText = {
    title: productData.title || '',
    breadcrumbs: Array.isArray(productData.breadcrumbs) ? 
      productData.breadcrumbs.join(' ') : 
      (productData.breadcrumbs || ''),
    brand: productData.brand || '',
    features: productData.features || '',
    details: productData.details || '',
    description: productData.description || ''
  };
  
  const allText = Object.values(productText).join(' ').toLowerCase();
  const textTerms = preprocessText(allText);
  
  let bestCategory = 'default';
  let bestScore = 0;
  
  for (const [category, categoryKeywords] of Object.entries(keywords)) {
    let score = 0;
    
    for (const keyword of categoryKeywords) {
      const keywordTerms = preprocessText(keyword);
      for (const term of keywordTerms) {
        if (textTerms.includes(term)) {
          score += 1;
          // Bonus pour titre et breadcrumbs
          if (preprocessText(productText.title).includes(term)) score += 2;
          if (preprocessText(productText.breadcrumbs).includes(term)) score += 1.5;
        }
      }
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }
  
  return bestCategory;
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
    
    const detectedCategory = classifyProduct(testCase.mockData);
    
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