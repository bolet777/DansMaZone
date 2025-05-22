/**
 * @file src/manifest/index.js
 * @license GPL-3.0
 * @copyright DansMaZone.ca
 * 
 * Générateur de manifeste multi-navigateurs pour l'extension DansMaZone
 * 
 * Ce module génère dynamiquement le fichier manifest.json en adaptant
 * les propriétés spécifiques à chaque navigateur cible (Chrome, Firefox, 
 * Edge, Opera). Il gère les différences entre les versions de manifeste,
 * les permissions, les scripts d'arrière-plan et les politiques de 
 * sécurité selon l'environnement de développement ou production.
 * 
 * Les principales adaptations incluent :
 * - Background scripts vs service workers (Firefox vs Chrome)
 * - Propriétés spécifiques aux navigateurs
 * - Versions minimales requises
 * - Content Security Policies adaptées
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

/**
 * Résolution du chemin du fichier actuel pour les modules ES6
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Lecture du package.json pour récupérer la version de l'extension
 */
const pkg = JSON.parse(readFileSync(path.join(__dirname, '../../package.json')));

/**
 * Content Security Policy pour l'environnement de développement
 * Autorise 'wasm-unsafe-eval' pour le hot-reload de Webpack
 */
const developmentCSP = {
  extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'",
};

/**
 * Content Security Policy pour l'environnement de production
 * Politique restrictive pour la sécurité maximale
 */
const productionCSP = {
  extension_pages: "script-src 'self'; object-src 'self'",
};

/**
 * Configuration de base du manifeste WebExtension
 * Adapté dynamiquement selon le navigateur cible via les variables d'environnement
 * 
 * @type {Object} Configuration du manifeste compatible Manifest V3
 */
const manifestInput = {
  manifest_version: 3,
  name: '__MSG_extensionName__',
  version: pkg.version,
  default_locale: 'fr',

  // Web Accessible Resources nécessite une structure différente en V3
  web_accessible_resources: [
    {
      resources: ['icons/*'],
      matches: [
        '*://*.amazon.ca/*'
      ],
    },
  ],

  icons: {
    16: 'icons/icon-16.png',
    32: 'icons/icon-32.png',
    48: 'icons/icon-48.png',
    96: 'icons/icon-96.png',
    128: 'icons/icon-128.png',
  },

  description: '__MSG_extensionDescription__',
  homepage_url: 'https://github.com/bolet777/DansMaZone',
  short_name: 'dansmazone',

  // Permissions séparées en V3
  permissions: ['storage', 'scripting'],

  // Host permissions doivent être déclarées séparément
  host_permissions: [
    '*://*.amazon.ca/*'
  ],

  // Background: doit être différent selon le navigateur cible
  ...(process.env.TARGET === 'firefox' ? {
    background: {
      scripts: ['background.js'],
      type: 'module'
    }
  } : {
    background: {
      service_worker: 'background.js'
    }
  }),

  // Content Security Policy V3
  content_security_policy: process.env.NODE_ENV === 'development' ? developmentCSP : productionCSP,

  // Action remplace browser_action en V3
  action: {
    default_title: 'DansMaZone',
    default_icon: {
      16: 'icons/icon-16.png',
      32: 'icons/icon-32.png',
      48: 'icons/icon-48.png',
      96: 'icons/icon-96.png',
      128: 'icons/icon-128.png',
    },
  },

  options_ui: {
    page: 'options.html', 
    open_in_tab: true // Définissez à false si vous préférez une fenêtre d'options plus petite
  },

  // Content scripts restent similaires
  content_scripts: [
    {
      matches: [
        '*://*.amazon.ca/*'
      ],
      js: ['content_script.js'],
      css: ['content_script.css'],
      run_at: 'document_start',
      all_frames: false,
    },
  ],

  // Déclaration conditionnelle des propriétés spécifiques aux navigateurs
  ...(process.env.TARGET === 'firefox' && {
    browser_specific_settings: {
      gecko: {
        id: 'info@dansmazone.ca',
      },
    },
  }),

  ...(process.env.TARGET === 'chrome' && {
    minimum_chrome_version: '88',
  }),

  ...(process.env.TARGET === 'opera' && {
    minimum_opera_version: '74',
    developer: {
      name: 'bolet',
    },
  }),
};

export default manifestInput;