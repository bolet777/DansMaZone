import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lire package.json
const pkg = JSON.parse(readFileSync(path.join(__dirname, '../../package.json')));

// CSP est géré différemment dans V3
const developmentCSP = {
  extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'",
};

const productionCSP = {
  extension_pages: "script-src 'self'; object-src 'self'",
};

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

  background: {
    service_worker: 'background.js'
  },

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