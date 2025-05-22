/**
 * @file src/background/background.js
 * @license GPL-3.0
 * @copyright DansMaZone.ca
 * 
 * Script d'arrière-plan pour l'extension DansMaZone
 * 
 * Ce module s'exécute en arrière-plan et gère la communication entre
 * les différentes parties de l'extension. Il intercepte les messages
 * envoyés par le script de contenu et exécute les actions appropriées,
 * comme l'ouverture de la page d'options.
 * 
 * Dans l'architecture WebExtension, ce script fonctionne comme un "service worker"
 * sous Manifest V3 pour Chrome, ou comme un script d'arrière-plan traditionnel
 * sous Firefox (avec Manifest V2/V3).
 */

import browser from 'webextension-polyfill';

/**
 * Écouteur d'événements pour les messages envoyés par le script de contenu
 * Traite les différentes actions demandées comme l'ouverture de la page d'options
 * @param {Object} message - Message reçu du script de contenu
 */
browser.runtime.onMessage.addListener((message) => {
  // Ouvrir la page d'options lorsque l'action correspondante est demandée
  if (message.action === 'openOptions') {
    browser.runtime.openOptionsPage();
  }
});