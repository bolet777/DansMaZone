// tests/mocks/category-data-extractor.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin vers le fichier source
const classifierPath = path.join(__dirname, '../../src/datas/category-classifier.js');

// Lire le fichier en tant que texte
const fileContent = fs.readFileSync(classifierPath, 'utf8');

// Fonction pour extraire le contenu de l'objet sans la déclaration export
function extractObjectContentFromText(text, objectName) {
  // Rechercher la définition de l'objet
  const startPattern = `export const ${objectName} = {`;
  const startIndex = text.indexOf(startPattern);
  
  if (startIndex === -1) return null;
  
  // Début du contenu (juste après l'accolade ouvrante)
  const contentStartIndex = startIndex + startPattern.length;
  
  // Trouver la fin de l'objet (compte les accolades ouvrantes et fermantes)
  let bracketCount = 1;
  let endIndex = contentStartIndex;
  
  while (bracketCount > 0 && endIndex < text.length) {
    if (text[endIndex] === '{') bracketCount++;
    if (text[endIndex] === '}') bracketCount--;
    endIndex++;
  }
  
  // Extraire le contenu de l'objet (sans la dernière accolade)
  return text.substring(contentStartIndex, endIndex - 1);
}

// Extraire le contenu des objets
const categoryKeywordsContent = extractObjectContentFromText(fileContent, 'categoryKeywords');
const categoryMappingContent = extractObjectContentFromText(fileContent, 'categoryMapping');

// Écrire les données dans un nouveau fichier
const outputPath = path.join(__dirname, 'extracted-category-data.js');
const outputContent = `
// Fichier généré automatiquement - Ne pas modifier

// categoryKeywords extrait de src/datas/category-classifier.js
export const categoryKeywords = {${categoryKeywordsContent}};

// categoryMapping extrait de src/datas/category-classifier.js
export const categoryMapping = {${categoryMappingContent}};
`;

// Écrire le fichier de sortie
fs.writeFileSync(outputPath, outputContent);

console.log(`✅ Données de catégories extraites vers ${outputPath}`);