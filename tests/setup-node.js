// tests/setup-node.js
import { fileURLToPath } from 'url';
import path from 'path';
import browserMock from './mocks/browser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fonction pour configurer l'environnement de test Node.js
function setupNodeEnvironment() {
  // Définir l'environnement de test
  process.env.NODE_ENV = 'test';
  
  // Remplacer le module webextension-polyfill par notre mock
  global.browser = browserMock;
  
  // Mock minimal pour fetch si pas disponible
  if (typeof global.fetch === 'undefined') {
    global.fetch = async (url, options) => {
      // Import dynamique de node-fetch si nécessaire
      const { default: fetch } = await import('node-fetch');
      return fetch(url, options);
    };
  }
  
  // Mock pour TextEncoder/TextDecoder si nécessaire
  if (typeof global.TextEncoder === 'undefined') {
    global.TextEncoder = class TextEncoder {
      encode(str) {
        return Buffer.from(str, 'utf-8');
      }
    };
  }
  
  if (typeof global.TextDecoder === 'undefined') {
    global.TextDecoder = class TextDecoder {
      decode(buf) {
        return Buffer.from(buf).toString('utf-8');
      }
    };
  }
  
  console.log("✅ Environnement Node.js configuré pour utiliser les vraies pages Amazon");
}

// Exécuter la configuration
setupNodeEnvironment();

// Exporter l'environnement pour l'utiliser dans d'autres modules
export default {
  browser: browserMock,
  basePath: __dirname
};