// import browser from 'webextension-polyfill';

// // Écouteur pour le démarrage de l'extension
// browser.runtime.onStartup.addListener(async () => {
//   await initialize();
// });

// // Écouteur pour l'installation ou la mise à jour
// browser.runtime.onInstalled.addListener(async (details) => {
//   await initialize();
// });

// async function initialize() {
//   // Initialiser les options par défaut si nécessaire
//   const options = await browser.storage.local.get('options');
//   if (!options.options) {
//     await browser.storage.local.set({
//       options: {
//         language: browser.i18n.getUILanguage(),
//         // Ajouter d'autres options par défaut si nécessaire
//       }
//     });
//   }

//   // Activer le script de contenu sur les pages Amazon
//   await browser.scripting.registerContentScripts([{
//     id: 'amazon-content',
//     matches: [
//       '*://*.amazon.fr/*',
//       '*://*.amazon.com/*',
//       '*://*.amazon.co.uk/*',
//       '*://*.amazon.com.mx/*',
//       '*://*.amazon.co.jp/*',
//       '*://*.amazon.it/*',
//       '*://*.amazon.in/*',
//       '*://*.amazon.es/*',
//       '*://*.amazon.cn/*',
//       '*://*.amazon.ca/*',
//       '*://*.amazon.com.br/*',
//       '*://*.amazon.de/*',
//       '*://*.amazon.com.au/*'
//     ],
//     js: ['content_script.js'],
//     css: ['content_script.css'],
//     runAt: 'document_start'
//   }]);
// }

// // Gérer les messages du content script si nécessaire
// browser.runtime.onMessage.addListener(async (message, sender) => {
//   switch (message.type) {
//     case 'getOptions':
//       const options = await browser.storage.local.get('options');
//       return options.options;
//     // Ajouter d'autres cas selon les besoins
//   }
// });