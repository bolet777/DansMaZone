import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  preprocessText, 
  categoryKeywords, 
  classifyProduct 
} from './mocks/category-classifier-mock.js';

// Obtenir le chemin du répertoire actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Vérifier l'environnement
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

console.log("ℹ️ Utilisation des implémentations de secours pour les tests");

// Utilitaire pour les tests
function runTest(name, actual, expected) {
  const areEqual = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${areEqual ? '✅' : '❌'} ${name}`);
  
  if (!areEqual) {
    console.log(`  Expected: ${JSON.stringify(expected)}`);
    console.log(`  Actual:   ${JSON.stringify(actual)}`);
  }
  
  return areEqual;
}

// Exécuter les tests de preprocessText
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

// Exécuter les tests de classification
async function runCategoryTests() {
  console.log("\n🧪 TESTS DE CLASSIFICATION DE PRODUITS");
  console.log("=====================================");
  
  let passed = 0;
  let total = testCases.productCategories.length;
  
  for (const testCase of testCases.productCategories) {
    console.log(`\nTest: ${testCase.name}`);
    console.log(`URL: ${testCase.url}`);
    
    // Utiliser la fonction de classification
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

// Fonction principale d'exécution des tests
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
  
  // Code de sortie en fonction du résultat
  process.exit(totalPassed === totalTests ? 0 : 1);
}

// Exécuter tous les tests
runAllTests().catch(error => {
  console.error('❌ Erreur lors de l\'exécution des tests:', error);
  process.exit(1);
});