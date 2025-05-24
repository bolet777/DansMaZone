// tests/run-tests.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';
import './setup-node.js';

// Importer DIRECTEMENT depuis le fichier de PRODUCTION
import { 
  preprocessText, 
  categoryKeywords,
  classifyPage,
  extractProductText,
  detectLanguage
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

// Fonction pour fetcher et parser une vraie page Amazon (sauvée localement)
async function fetchAmazonPage(testCase) {
  try {
    const asin = testCase.asin;
    if (!asin) {
      console.error(`❌ ASIN manquant dans le cas de test: ${testCase.name}`);
      return null;
    }

    // Construire le chemin vers le fichier HTML local
    const htmlPath = path.join(__dirname, 'html-cache', `${asin}.html`);
    
    // Vérifier si le fichier existe
    if (!fs.existsSync(htmlPath)) {
      console.error(`❌ Fichier HTML local non trouvé: ${htmlPath}`);
      return null;
    }

    return fs.readFileSync(htmlPath, 'utf8');
  } catch (error) {
    console.error(`❌ Erreur lors de la lecture du fichier local: ${error.message}`);
    return null;
  }
}

// Fonction pour configurer le DOM avec la vraie page Amazon
async function setupRealAmazonDOM(htmlPath, asin) {
  const url = `https://www.amazon.ca/-/fr/dp/${asin}/`;
  
  // Supprimer les erreurs CSS bruyantes de JSDOM
  const originalError = console.error;
  console.error = (msg, ...args) => {
    if (typeof msg === 'string' && msg.includes('Could not parse CSS stylesheet')) return;
    originalError(msg, ...args);
  };
  const dom = await JSDOM.fromFile(htmlPath, { url });
  global.document = dom.window.document;
  global.window = dom.window;
  console.log(`✅ DOM configuré avec le fichier local: ${htmlPath}`);
}

// Fonction qui utilise DIRECTEMENT classifyPage() avec la vraie page Amazon
async function classifyRealAmazonPage(testCase) {
  try {
    const html = await fetchAmazonPage(testCase);
    const asin = testCase.asin;
    const htmlPath = path.join(__dirname, 'html-cache', `${asin}.html`);
    await setupRealAmazonDOM(htmlPath, asin);
    const result = await classifyPage();
    return result;
  } catch (error) {
    console.error('❌ Erreur lors de la classification:', error);
    return 'default';
  }
}

// Tests utilisant DIRECTEMENT les fonctions de production
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
  console.log("\n🧪 TESTS DE LA FONCTION preprocessText DE PRODUCTION");
  console.log("===================================================");
  
  let passed = 0;
  let total = testCases.preprocessText.length;
  
  for (const testCase of testCases.preprocessText) {
    // Utiliser DIRECTEMENT la fonction de production
    const result = preprocessText(testCase.input);
    if (runTest(testCase.name, result, testCase.expected)) {
      passed++;
    }
  }
  
  console.log(`\n✨ Résultat: ${passed}/${total} tests réussis ✨`);
  return { passed, total };
}

async function runCategoryTests() {
  console.log("\n🧪 TESTS DE CLASSIFICATION AVEC VRAIES PAGES AMAZON");
  console.log("===================================================");
  
  let passed = 0;
  let total = testCases.productCategories.length;
  
  for (const testCase of testCases.productCategories) {
    console.log(`\n==================================================`);
    console.log(`🔍 Test: ${testCase.name}`);
    console.log(`🔗 ASIN: ${testCase.asin}`);
    
    // Utiliser DIRECTEMENT classifyPage() avec la vraie page Amazon
    const detectedCategory = await classifyRealAmazonPage(testCase);
    
    console.log(`🎯 Catégorie attendue: ${testCase.expectedCategory}`);
    console.log(`🤖 Catégorie détectée: ${detectedCategory}`);
    
    if (detectedCategory === testCase.expectedCategory) {
      console.log('✅ Classification correcte!');
      passed++;
    } else {
      console.log('❌ Classification incorrecte!');
      
      // Debug: afficher les données extraites
      try {
        const extractedText = extractProductText();
        console.log('📊 Données extraites:');
        console.log(`   Titre: ${extractedText.title.substring(0, 100)}...`);
        console.log(`   Breadcrumbs: ${extractedText.breadcrumbs}`);
        console.log(`   Marque: ${extractedText.brand}`);
      } catch (e) {
        console.log('❌ Erreur lors de l\'extraction des données de debug');
      }
    }
    
    // Pause entre les requêtes pour éviter le rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n✨ Résultat: ${passed}/${total} classifications correctes ✨`);
  return { passed, total };
}

async function runAllTests() {
  console.log("🔍 TESTS AVEC VRAIES PAGES AMAZON ET FONCTIONS DE PRODUCTION");
  console.log("=============================================================");
  
  const preprocessResults = await runPreprocessTests();
  const categoryResults = await runCategoryTests();
  
  const totalPassed = preprocessResults.passed + categoryResults.passed;
  const totalTests = preprocessResults.total + categoryResults.total;
  
  console.log("\n📊 RÉSUMÉ DES TESTS");
  console.log("=================");
  console.log(`Tests preprocessText: ${preprocessResults.passed}/${preprocessResults.total}`);
  console.log(`Tests classification: ${categoryResults.passed}/${categoryResults.total}`);
  console.log(`Total: ${totalPassed}/${totalTests} (${Math.round(totalPassed/totalTests*100)}%)`);
  
  process.exit(totalPassed === totalTests ? 0 : 1);
}

runAllTests().catch(error => {
  console.error('❌ Erreur lors de l\'exécution des tests:', error);
  process.exit(1);
});