/**
 * @file src/content_script/index.js
 * @license GPL-3.0
 * @copyright DansMaZone.ca
 * 
 * Script principal d'injection pour l'extension DansMaZone
 * 
 * Ce module est responsable de l'analyse des pages produit d'Amazon,
 * de la détection des catégories de produits et de l'affichage
 * d'alternatives locales dans un panneau latéral. Il gère également
 * la détection des ISBN pour les livres et charge les sites personnalisés
 * configurés par l'utilisateur.
 */

import browser from 'webextension-polyfill';
import '../styles/content_script.scss';
import defaultSites from '../datas/default-sites.json';
import { classifyPage, categoryMapping, detectLanguage } from '../datas/category-classifier.js';

// Stockage pour les sites combinés (par défaut + personnalisés)
let combinedSites = {};
// Stockage pour les chaînes de traduction
let i18nStrings = {};

/**
 * Charge les chaînes de traduction nécessaires pour l'interface utilisateur
 * @returns {Promise<boolean>} True si le chargement réussit, sinon False
 */
async function loadI18nStrings() {
  try {
    // Liste des clés de traduction nécessaires pour le content script
    const keys = [
      'sidebarTitle',
      'optionsText'
    ];
    
    // Récupérer toutes les traductions demandées
    const translations = {};
    for (const key of keys) {
      translations[key] = browser.i18n.getMessage(key);
    }
    
    // Si les traductions sont vides, utiliser les valeurs par défaut
    i18nStrings = {
      sidebarTitle: translations.sidebarTitle || 'Dans ma zone',
      optionsText: translations.optionsText || 'Options'
    };
    
    console.log('DansMaZone: Traductions chargées', i18nStrings);
    return true;
  } catch (error) {
    console.error('DansMaZone: Erreur lors du chargement des traductions', error);
    
    // Valeurs par défaut en cas d'erreur
    i18nStrings = {
      sidebarTitle: 'Dans Ma Zone',
      optionsText: 'Options'
    };
    
    return false;
  }
}

/**
 * Fusionne les sites par défaut avec les sites personnalisés de l'utilisateur
 * @returns {Promise<boolean>} True si l'initialisation réussit, sinon False
 */
async function initSites() {
  try {
    // Copier les sites par défaut
    combinedSites = structuredClone(defaultSites);
    
    // Récupérer les sites personnalisés depuis le stockage local
    const result = await browser.storage.local.get('userSites');
    const userSites = result.userSites || {};
    
    // Fusionner avec les sites par défaut
    Object.keys(userSites).forEach(category => {
      if (!combinedSites[category]) {
        combinedSites[category] = [];
      }
      
      // Ajouter les sites personnalisés
      userSites[category].forEach(site => {
        // Vérifier si le site n'existe pas déjà dans les sites par défaut
        const siteExists = combinedSites[category].some(defaultSite => 
          defaultSite.name === site.name
        );
        
        if (!siteExists) {
          combinedSites[category].push(site);
        }
      });
    });
    
    console.log('DansMaZone: Sites combinés chargés', combinedSites);
    return true;
  } catch (error) {
    // Gestion améliorée des erreurs
    console.error('DansMaZone: Erreur lors du chargement des sites personnalisés', error);
    
    // S'assurer que combinedSites est initialisé correctement même en cas d'erreur
    combinedSites = structuredClone(defaultSites);
    
    // Notification discrète en cas d'erreur
    const errorElement = document.createElement('div');
    errorElement.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      background-color: rgba(220, 53, 69, 0.9);
      color: white;
      padding: 10px 15px;
      border-radius: 5px;
      z-index: 10000;
      font-size: 14px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    errorElement.textContent = 'DansMaZone : Impossible de charger vos sites personnalisés. Les sites par défaut seront utilisés.';
    
    document.body.appendChild(errorElement);
    
    // Disparaît après 5 secondes
    setTimeout(() => {
      errorElement.style.opacity = '0';
      errorElement.style.transition = 'opacity 0.5s ease';
      setTimeout(() => errorElement.remove(), 500);
    }, 5000);
    
    return false;
  }
}

/**
 * Détecte et extrait l'ISBN d'un livre sur la page produit Amazon
 * @returns {string|null} L'ISBN détecté ou null si aucun ISBN n'est trouvé
 */
function getISBN() {
  // Définir un pattern plus strict pour l'ISBN
  const isbnRegex = /(?:ISBN(?:-13)?:?\s*)?(?=[0-9X]{13}|[0-9X]{10})([0-9]{9}[0-9X]|[0-9]{12}[0-9X])/i;
  
  // Vérifier la validité d'un ISBN trouvé
  const isValidISBN = (isbn) => {
    // Enlever les tirets et espaces
    const cleanIsbn = isbn.replace(/[-\s]/g, '');
    
    // Vérifier la longueur (ISBN-10 ou ISBN-13)
    if (cleanIsbn.length !== 10 && cleanIsbn.length !== 13) {
      return false;
    }
    
    // Exclure les valeurs suspectes
    if (cleanIsbn === '4294967295' || // 2^32-1, valeur limite
        cleanIsbn === '0000000000' ||
        cleanIsbn === '1111111111' ||
        cleanIsbn === '9999999999' ||
        /^(.)\1+$/.test(cleanIsbn)) { // Tous les chiffres identiques
      return false;
    }
    
    // Vérification supplémentaire : les ISBN-13 commencent généralement par 978 ou 979
    if (cleanIsbn.length === 13 && !cleanIsbn.startsWith('978') && !cleanIsbn.startsWith('979')) {
      return false;
    }
    
    // Si l'ISBN semble valide, le retourner
    return cleanIsbn;
  };
  
  // Méthode 1: Recherche dans la section détails
  const detailBullets = document.getElementById('detailBullets_feature_div');
  if (detailBullets) {
    const listItems = detailBullets.querySelectorAll('li span.a-list-item');
    for (const item of listItems) {
      const boldText = item.querySelector('span.a-text-bold');
      if (boldText && (boldText.textContent.includes('ISBN-13') || boldText.textContent.includes('ISBN-10'))) {
        const isbnSpan = item.querySelector('span:not(.a-text-bold)');
        if (isbnSpan) {
          const potentialIsbn = isbnSpan.textContent.trim();
          const validIsbn = isValidISBN(potentialIsbn);
          if (validIsbn) {
            console.log('DansMaZone: ISBN trouvé dans les détails:', validIsbn);
            return validIsbn;
          }
        }
      }
    }
  }
  
  // Méthode 2: Chercher dans les métadonnées
  const metaIsbn = document.querySelector('meta[property="books:isbn"]');
  if (metaIsbn && metaIsbn.content) {
    const match = metaIsbn.content.match(isbnRegex);
    if (match && match[1]) {
      const validIsbn = isValidISBN(match[1]);
      if (validIsbn) {
        console.log('DansMaZone: ISBN trouvé dans les métadonnées:', validIsbn);
        return validIsbn;
      }
    }
  }
  
  // Méthode 3: Chercher dans des zones de contenu spécifiques
  const textContentElements = [
    document.getElementById('productDescription'),
    document.getElementById('feature-bullets'),
    document.getElementById('bookDescription_feature_div')
  ];
  
  for (const element of textContentElements) {
    if (element) {
      const text = element.textContent;
      const matches = text.match(isbnRegex);
      if (matches && matches[1]) {
        const validIsbn = isValidISBN(matches[1]);
        if (validIsbn) {
          console.log('DansMaZone: ISBN trouvé dans le contenu:', validIsbn);
          return validIsbn;
        }
      }
    }
  }
  
  // Méthode 4: Vérifier s'il existe une section d'informations sur les livres
  const bookSections = [
    document.getElementById('rpi-attribute-book_details-isbn13'),
    document.getElementById('rpi-attribute-book_details-isbn10'),
    document.querySelector('[data-feature-name="bookDescription"]')
  ];
  
  if (!bookSections.some(element => element !== null)) {
    console.log('DansMaZone: Aucune section liée aux livres trouvée');
    return null; // Pas de section liée aux livres, donc pas un livre
  }
  
  // Méthode 5 (prudente): Chercher dans le corps entier de la page, mais avec une confiance faible
  // Uniquement si les sections liées aux livres existent
  const pageText = document.body.textContent;
  const bodyMatches = pageText.match(isbnRegex);
  if (bodyMatches && bodyMatches[1]) {
    const validIsbn = isValidISBN(bodyMatches[1]);
    if (validIsbn) {
      console.log('DansMaZone: ISBN potentiel trouvé dans le corps du texte:', validIsbn);
      return validIsbn;
    }
  }
  
  // Aucun ISBN valide trouvé
  console.log('DansMaZone: Aucun ISBN valide trouvé');
  return null;
}

/**
 * Extrait les détails du produit (nom, fabricant) pour créer un terme de recherche
 * @returns {string} Terme de recherche optimisé pour les sites externes
 */
function getProductDetails() {
  const details = {
    manufacturer: null,
    productName: null
  };

  // Récupérer le nom du produit
  const titleElement = document.getElementById('productTitle');
  if (titleElement) {
    details.productName = titleElement.textContent.trim();
  }

  // Récupérer le fabricant
  const detailBullets = document.getElementById('detailBullets_feature_div');
  if (detailBullets) {
    const listItems = detailBullets.querySelectorAll('li span.a-list-item');
    for (const item of listItems) {
      const label = item.querySelector('span.a-text-bold');
      const value = item.querySelector('span:not(.a-text-bold)');
      
      if (label && value) {
        const labelText = label.textContent.trim();
        if (labelText.includes('Fabricant')) {
          details.manufacturer = value.textContent.trim();
        }
      }
    }
  }

  // Construire une description de recherche sans duplication
  let searchQuery = '';
  
  if (details.manufacturer && details.productName) {
    // Vérifier si le nom du fabricant est déjà dans le nom du produit
    const manufacturerRegex = new RegExp(`\\b${details.manufacturer}\\b`, 'i');
    if (manufacturerRegex.test(details.productName)) {
      // Le fabricant est déjà mentionné dans le nom du produit
      const words = details.productName.split(' ').slice(0, 5);
      searchQuery = words.join(' ');
    } else {
      // Le fabricant n'est pas dans le nom du produit, l'ajouter
      searchQuery = details.manufacturer + ' ' + details.productName.split(' ').slice(0, 5).join(' ');
    }
  } else if (details.productName) {
    // Pas de fabricant, utiliser seulement le nom du produit
    const words = details.productName.split(' ').slice(0, 5);
    searchQuery = words.join(' ');
  } else if (details.manufacturer) {
    // Pas de nom de produit, utiliser seulement le fabricant
    searchQuery = details.manufacturer;
  }

  return searchQuery.trim();
}

/**
 * Ajoute le panneau latéral avec les liens vers les sites alternatifs
 * @param {Array} sites - Liste des sites pour la catégorie détectée
 * @param {string} searchTerm - Terme de recherche à utiliser
 * @param {string} detectedCategory - Catégorie du produit détectée
 */
function addLinkButtons(sites, searchTerm, detectedCategory) {
  // Vérifier si sites est bien un tableau
  if (!Array.isArray(sites)) {
    console.error('DansMaZone: sites n\'est pas un tableau valide', sites);
    sites = []; // Initialiser comme tableau vide pour éviter les erreurs
  }
  
  // Si aucun terme de recherche, ne rien afficher
  if (!searchTerm) {
    console.error('DansMaZone: Aucun terme de recherche fourni');
    return;
  }
  
  // Vérifier si un bandeau existe déjà et le supprimer
  const existingSidebar = document.querySelector('.dmz-sidebar');
  if (existingSidebar) {
    existingSidebar.remove();
  }
  
  // Ne pas créer de bandeau s'il n'y a pas de sites
  if (sites.length === 0) {
    console.warn('DansMaZone: Aucun site à afficher');
    return;
  }
  
  // Déterminer la langue de l'utilisateur
  const userLanguage = detectLanguage();
  console.log('DansMaZone: Langue détectée:', userLanguage);
  
  // Créer un bandeau vertical
  const sidebarEl = document.createElement('div');
  sidebarEl.classList.add('dmz-sidebar');
  
  // En-tête du bandeau
  const header = document.createElement('div');
  header.classList.add('dmz-sidebar-header');
  
  try {
    const icon = document.createElement('img');
    icon.src = browser.runtime.getURL('icons/icon-48.png');
    icon.alt = browser.i18n.getMessage('extensionName') || "DansMaZone";
    
    const title = document.createElement('span');
    title.textContent = i18nStrings.sidebarTitle;
    
    header.appendChild(icon);
    header.appendChild(title);
    sidebarEl.appendChild(header);
    
    // Ajouter la catégorie détectée sous l'en-tête
    if (detectedCategory) {
      const categoryInfo = document.createElement('div');
      categoryInfo.classList.add('dmz-category-info');
      
      const categoryText = document.createElement('span');
      categoryText.textContent = detectedCategory;
      
      categoryInfo.appendChild(categoryText);
      sidebarEl.appendChild(categoryInfo);
    }
    
    // Conteneur pour les boutons des sites
    const contentContainer = document.createElement('div');
    contentContainer.classList.add('dmz-sidebar-content');
    
    // Créer les boutons des sites
    for (const site of sites) {
      if (!site || (!site.url && !site.urls) || !site.name) {
        console.warn('DansMaZone: Site invalide ignoré', site);
        continue;
      }

      // Déterminer l'URL à utiliser (structure ancienne ou nouvelle)
      let siteUrl;
      if (site.urls) {
        // Nouvelle structure avec URLs multilingues
        siteUrl = site.urls[userLanguage] || site.urls[(userLanguage === 'fr' ? 'en' : 'fr')];
      } else {
        // Ancienne structure avec une seule URL
        siteUrl = site.url;
      }
      
      // Si aucune URL valide n'a été trouvée, ignorer ce site
      if (!siteUrl) {
        console.warn('DansMaZone: Aucune URL valide pour le site', site.name);
        continue;
      }
      
      const url = siteUrl
        .replace('##QUERY##', encodeURIComponent(searchTerm))
        .replace('##ISBN##', searchTerm);
      
      const button = document.createElement('a');
      button.href = url;
      button.target = "_blank";  // Ceci devrait déjà ouvrir dans un nouvel onglet
      button.classList.add('dmz-sidebar-button');
      
      // Ajouter un gestionnaire d'événements explicite pour s'assurer qu'il s'ouvre dans un nouvel onglet
      button.addEventListener('click', (e) => {
        e.preventDefault(); // Empêcher le comportement par défaut
        window.open(url, '_blank'); // Ouvrir explicitement dans un nouvel onglet
        return false; // Empêcher la propagation de l'événement
      });
      
      const siteName = document.createElement('span');
      siteName.textContent = site.name;
      
      button.appendChild(siteName);
      contentContainer.appendChild(button);
    }
    
    // Ajouter le bouton d'options après tous les sites
    const optionsButton = document.createElement('a');
    optionsButton.classList.add('dmz-sidebar-button', 'dmz-options-button');
    optionsButton.addEventListener('click', (e) => {
      e.preventDefault();
      try {
        browser.runtime.sendMessage({ action: 'openOptions' })
          .catch(error => {
            console.error('DansMaZone: Erreur lors de l\'envoi du message:', error);
            browser.runtime.openOptionsPage();
          });
      } catch (error) {
        console.error('DansMaZone: Erreur lors de l\'ouverture des options:', error);
      }
    });

    const optionsText = document.createElement('span');
    optionsText.textContent = i18nStrings.optionsText;
    optionsButton.appendChild(optionsText);
    contentContainer.appendChild(optionsButton);
    
    
    sidebarEl.appendChild(contentContainer);
    // Ajouter à la page (directement au body pour un positionnement absolu)
    if (document.body) {
      document.body.appendChild(sidebarEl);
      console.log('DansMaZone: Sidebar added to the page with', sites.length, 'sites');
    } else {
      console.error('DansMaZone: document.body not found, cannot add sidebar');
    }
  } catch (error) {
    console.error('DansMaZone: Error adding link buttons', error);
  }
}

/**
 * Trouve les sites correspondant à la catégorie détectée
 * @param {string} detectedCategory - Catégorie du produit détectée
 * @returns {Array} Liste des sites pour cette catégorie
 */
function findSitesForCategory(detectedCategory) {
  if (!detectedCategory || typeof detectedCategory !== 'string') {
    console.warn('DansMaZone: Catégorie non valide, utilisation de la catégorie par défaut');
    return combinedSites['default'] || [];
  }

  // Diviser la catégorie détectée en parties
  const categoryParts = detectedCategory.split('/').map(part => part.trim());
  
  // Chercher une correspondance dans les clés de combinedSites
  for (const part of categoryParts) {
    if (part && combinedSites[part]) {
      console.info('DansMaZone: Found sites for category:', part);
      return combinedSites[part];
    }
  }

  console.info('DansMaZone: No specific sites found, using default');
  return combinedSites['default'] || [];
}

/**
 * Point d'entrée principal pour l'analyse et l'affichage des alternatives
 * Détecte la catégorie du produit et affiche les sites correspondants
 */
async function start() {
  console.log('DansMaZone: Starting extension initialization');
  
  // Charger les traductions
  await loadI18nStrings();
  
  // Initialiser les sites en combinant ceux par défaut et personnalisés
  await initSites();
  
  // Vérifier si nous sommes sur une page produit Amazon
  const isProductPage = window.location.href.includes('/dp/') || 
                        window.location.href.includes('/gp/product/');
  
  if (!isProductPage) {
    console.log('DansMaZone: Not a product page, extension not active');
    return;
  }
  
  console.log('DansMaZone: Processing product page');
  
  try {
    const isbn = getISBN();
    if (isbn) {
      console.log('DansMaZone: ISBN found:', isbn);
      // Passer "Livres" comme catégorie
      addLinkButtons(combinedSites['Livres'] || [], isbn, 'Livres');
    } else {
      // Détecte la catégorie (en français ou anglais selon la langue de la page)
      const detectedCategory = await classifyPage(combinedSites);
      console.info('DansMaZone: Category detected:', detectedCategory);

      if (!detectedCategory || detectedCategory === 'default') {
        console.warn('DansMaZone: Aucune catégorie spécifique détectée, utilisation de la catégorie par défaut');
        const searchQuery = getProductDetails();
        if (searchQuery) {
          addLinkButtons(combinedSites['default'] || [], searchQuery, 'Général');
        }
        return;
      }

      // Récupérer les sites appropriés pour la catégorie détectée
      const searchQuery = getProductDetails();
      console.info('DansMaZone: Search query:', searchQuery);
      if (searchQuery) {
        const sites = findSitesForCategory(detectedCategory);
        addLinkButtons(sites, searchQuery, detectedCategory);
      }
    }
  } catch (error) {
    console.error('DansMaZone: Error during page processing:', error);
    fallbackInitialization();
  }
}

/**
 * Initialise l'extension au chargement de la page
 * Assure que l'extension fonctionne même si le DOM est chargé de manière asynchrone
 */
function initializeExtension() {
  try {
    // Crée un log avec un timestamp pour faciliter le débogage
    const timestamp = new Date().toISOString();
    console.log(`DansMaZone: Initialisation démarrée à ${timestamp}`);
    
    // On vérifie d'abord si on est sur une page produit
    const isProductPage = window.location.href.includes('/dp/') || 
                         window.location.href.includes('/gp/product/');
    
    if (!isProductPage) {
      console.log('DansMaZone: Pas sur une page produit, extension non activée');
      return;
    }

    // Fonction qui démarre l'extension de manière garantie
    const startExtension = () => {
      try {
        console.log('DansMaZone: Démarrage forcé de l\'extension');
        start();
      } catch (err) {
        console.error('DansMaZone: Erreur lors du démarrage forcé:', err);
        fallbackInitialization();
      }
    };

    // Initialiser quand le DOM est prêt
    if (document.readyState === "loading") {
      // Attendre que le document soit chargé
      document.addEventListener('DOMContentLoaded', () => {
        // Attendre un court délai pour s'assurer que les éléments Amazon sont disponibles
        // Chrome semble avoir besoin de plus de temps
        setTimeout(() => {
          const productTitle = document.getElementById('productTitle');
          if (productTitle) {
            console.log('DansMaZone: Élément productTitle trouvé, initialisation');
            start();
          } else {
            console.log('DansMaZone: Élément productTitle non trouvé après délai, démarrage forcé');
            startExtension();
          }
        }, 500); // Délai court mais suffisant pour Chrome
      });
    } else {
      // Le document est déjà chargé
      setTimeout(() => {
        const productTitle = document.getElementById('productTitle');
        if (productTitle) {
          console.log('DansMaZone: Élément productTitle trouvé, initialisation');
          start();
        } else {
          console.log('DansMaZone: Élément productTitle non trouvé, démarrage forcé');
          startExtension();
        }
      }, 100);
    }

    // Timeout de sécurité global si rien ne fonctionne
    setTimeout(() => {
      if (!document.querySelector('.dmz-sidebar')) {
        console.log('DansMaZone: Sidebar non détectée après timeout global, démarrage forcé');
        startExtension();
      }
    }, 3000); // Timeout global plus court

  } catch (error) {
    // Attraper toute erreur non prévue
    console.error('DansMaZone: Erreur critique lors de l\'initialisation:', error);
    
    // Tentative de récupération en dernier recours
    try {
      fallbackInitialization();
    } catch (fallbackError) {
      console.error('DansMaZone: Échec complet de l\'initialisation', fallbackError);
    }
  }
}

/**
 * Fonction de secours qui tente d'initialiser l'extension
 * avec un minimum de fonctionnalités en cas d'échec des méthodes normales
 */
function fallbackInitialization() {
  console.log('DansMaZone: Tentative d\'initialisation de secours');
  
  // Vérifier si nous sommes sur une page produit Amazon
  const isProductPage = window.location.href.match(/\/(dp|gp\/product)\/[A-Z0-9]{10}/i);
  
  if (!isProductPage) {
    console.log('DansMaZone: Pas sur une page produit, extension de secours non activée');
    return;
  }
  
  try {
    // Initialiser avec seulement les sites par défaut
    combinedSites = structuredClone(defaultSites);
    
    // Charger les traductions de secours
    i18nStrings = {
      sidebarTitle: browser.i18n.getMessage('sidebarTitle') || 'Dans ma zone',
      optionsText: browser.i18n.getMessage('optionsText') || 'Options'
    };
    
    // Récupérer un terme de recherche basique depuis le titre de la page
    let searchQuery = '';
    const pageTitle = document.title || '';
    
    if (pageTitle) {
      // Extraire la première partie du titre (avant tout séparateur)
      searchQuery = pageTitle.split(/[-:|(]/)[0].trim();
      console.log('DansMaZone: Terme de recherche de secours trouvé:', searchQuery);
    }
    
    // Si aucun terme de recherche n'a pu être extrait, essayer d'autres éléments
    if (!searchQuery) {
      const h1Elements = document.querySelectorAll('h1');
      for (const h1 of h1Elements) {
        if (h1.textContent && h1.textContent.trim()) {
          searchQuery = h1.textContent.trim();
          console.log('DansMaZone: Terme de recherche alternatif trouvé:', searchQuery);
          break;
        }
      }
    }
    
    // Si on a pu obtenir un terme de recherche, afficher le bandeau
    if (searchQuery) {
      // Utiliser la catégorie par défaut pour l'initialisation de secours
      addLinkButtons(combinedSites['default'], searchQuery, 'Général');
      
      // Informer discrètement l'utilisateur que le mode de secours est actif
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        bottom: 15px;
        right: 15px;
        background-color: rgba(255, 153, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 9999;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        opacity: 0;
        transition: opacity 0.5s ease;
      `;
      notification.textContent = 'DansMaZone fonctionne en mode limité';
      
      document.body.appendChild(notification);
      
      // Afficher puis masquer la notification
      setTimeout(() => {
        notification.style.opacity = '1';
        setTimeout(() => {
          notification.style.opacity = '0';
          setTimeout(() => notification.remove(), 500);
        }, 5000);
      }, 500);
    }
  } catch (error) {
    console.error('DansMaZone: Échec de l\'initialisation de secours', error);
  }
}

/**
 * Gère les erreurs de manière uniforme dans toute l'extension
 * @param {Error} error - L'erreur à gérer
 * @param {string} context - Le contexte dans lequel l'erreur s'est produite
 * @param {boolean} notify - Si true, montre une notification à l'utilisateur
 * @param {boolean} critical - Si true, considère l'erreur comme critique
 * @returns {Error} L'erreur originale pour permettre le chaînage
 */
function handleError(error, context, notify = true, critical = false) {
  // Log l'erreur dans la console avec son contexte
  console.error(`DansMaZone - Erreur ${critical ? 'critique' : ''} dans ${context}:`, error);
  
  // Notification à l'utilisateur si demandé
  if (notify && document.body) {
    const notificationElement = document.createElement('div');
    notificationElement.style.cssText = `
      position: fixed;
      bottom: 15px;
      right: 15px;
      background-color: ${critical ? 'rgba(220, 53, 69, 0.9)' : 'rgba(255, 153, 0, 0.9)'};
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      font-size: 14px;
      z-index: 9999;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    const message = critical 
      ? `DansMaZone - Erreur: Fonctionnement limité`
      : `DansMaZone - Problème mineur détecté`;
    
    notificationElement.textContent = message;
    
    document.body.appendChild(notificationElement);
    
    // Afficher puis masquer la notification
    setTimeout(() => {
      notificationElement.style.opacity = '1';
      setTimeout(() => {
        notificationElement.style.opacity = '0';
        setTimeout(() => notificationElement.remove(), 500);
      }, 5000);
    }, 100);
  }
  
  // Retourne l'erreur pour permettre un chaînage
  return error;
}

// Initialiser l'extension
initializeExtension();