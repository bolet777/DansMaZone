import browser from 'webextension-polyfill';
import '../styles/content_script.scss';
import { categorySites } from '../datas/category-sites.js';
import { classifyPage, categoryMapping } from '../datas/category-classifier.js';

// Stockage pour les sites combinés (par défaut + personnalisés)
let combinedSites = {};

// Fonction pour fusionner les sites par défaut et personnalisés
async function initSites() {
  // Copier les sites par défaut
  combinedSites = structuredClone(categorySites);
  
  try {
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
  } catch (error) {
    console.error('DansMaZone: Erreur lors du chargement des sites personnalisés', error);
    // En cas d'erreur, on utilise seulement les sites par défaut
  }
}

function getISBN() {
  const detailBullets = document.getElementById('detailBullets_feature_div');
  if (detailBullets) {
    const listItems = detailBullets.querySelectorAll('li span.a-list-item');
    for (const item of listItems) {
      const boldText = item.querySelector('span.a-text-bold');
      if (boldText && boldText.textContent.includes('ISBN-13')) {
        const isbnSpan = item.querySelector('span:not(.a-text-bold)');
        if (isbnSpan) {
          return isbnSpan.textContent.trim().replace(/-/g, '');
        }
      }
    }
  }
  return null;
}

function getProductCategory() {
  // Via le fil d'Ariane
  const breadcrumbs = document.querySelectorAll('#wayfinding-breadcrumbs_feature_div li span.a-list-item');
  if (breadcrumbs.length > 0) {
    const categories = Array.from(breadcrumbs)
      .map(item => item.textContent.trim())
      .filter(text => 
        text && 
        text !== '›' && 
        !text.includes('retour') &&
        !text.includes('Retour')
      )
      .slice(0, 2);
    
    if (categories.length > 0) {
      return categories
        .join('/')
        .replace(/\s+/g, ' ')
        .replace(/[›\\/]+/g, '/')
        .replace(/^\W+|\W+$/g, '')
        .trim();
    }
  }
  return 'Unknown';
}

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

// Dans la fonction addLinkButtons - plus besoin du paramètre container
function addLinkButtons(sites, searchTerm) {
  // Vérifier si un bandeau existe déjà et le supprimer
  const existingSidebar = document.querySelector('.dmz-sidebar');
  if (existingSidebar) {
    existingSidebar.remove();
  }
  
  // Créer un bandeau vertical
  const sidebarEl = document.createElement('div');
  sidebarEl.classList.add('dmz-sidebar');
  
  // En-tête du bandeau
  const header = document.createElement('div');
  header.classList.add('dmz-sidebar-header');
  
  const icon = document.createElement('img');
  icon.src = browser.runtime.getURL('icons/icon-48.png');
  icon.alt = "DansMaZone";
  
  const title = document.createElement('span');
  title.textContent = "Dans ma zone";
  
  header.appendChild(icon);
  header.appendChild(title);
  sidebarEl.appendChild(header);
  
  // Conteneur pour les boutons des sites
  const contentContainer = document.createElement('div');
  contentContainer.classList.add('dmz-sidebar-content');
  
  // Créer les boutons des sites
  for (const site of sites) {
    const url = site.url
      .replace('##QUERY##', encodeURIComponent(searchTerm))
      .replace('##ISBN##', searchTerm);
    
    const button = document.createElement('a');
    button.href = url;
    button.target = "_blank";
    button.classList.add('dmz-sidebar-button');
    
    const siteName = document.createElement('span');
    siteName.textContent = site.name;
    
    button.appendChild(siteName);
    contentContainer.appendChild(button);
  }
  
  sidebarEl.appendChild(contentContainer);
  
  // Ajouter à la page (directement au body pour un positionnement absolu)
  document.body.appendChild(sidebarEl);
  
  // Log pour débogage
  console.log('DansMaZone: Sidebar added to the page with', sites.length, 'sites');
  
  // Ajouter un event listener pour déboguer
  sidebarEl.addEventListener('mouseenter', () => {
    console.log('DansMaZone: Sidebar hovered, content should be visible');
  });
}

function findSitesForCategory(detectedCategory) {
  // Diviser la catégorie détectée en parties
  const categoryParts = detectedCategory.split('/').map(part => part.trim());
  
  // Chercher une correspondance dans les clés de combinedSites
  for (const part of categoryParts) {
    if (combinedSites[part]) {
      console.info('Found sites for category:', part);
      return combinedSites[part];
    }
  }

  console.info('No specific sites found, using default');
  return combinedSites['default'];
}

async function start() {
  // Initialiser les sites en combinant ceux par défaut et personnalisés
  await initSites();
  
  // Vérifier si nous sommes sur une page produit Amazon
  const isProductPage = window.location.href.includes('/dp/') || 
                        window.location.href.includes('/gp/product/');
  
  if (!isProductPage) {
    console.log('DansMaZone: Not a product page, extension not active');
    return;
  }
  
  console.log('DansMaZone: Starting on product page');
  
  const isbn = getISBN();
  if (isbn) {
    console.log('DansMaZone: ISBN found:', isbn);
    addLinkButtons(combinedSites['Livres'], isbn);
  } else {
    // Détecte la catégorie (en français ou anglais selon la langue de la page)
    const detectedCategory = classifyPage();
    console.info('Category detected:', detectedCategory);

    // Si la catégorie est en anglais, la convertir en français pour l'utiliser comme clé
    let frenchCategory = detectedCategory;
    
    // Si la catégorie n'est pas dans combinedSites, il s'agit probablement d'une catégorie en anglais
    if (!combinedSites[detectedCategory]) {
      // Chercher la clé française qui correspond à cette catégorie anglaise
      const frenchCategoryEntry = Object.entries(categoryMapping)
        .find(([fr, en]) => en === detectedCategory);
      
      if (frenchCategoryEntry) {
        frenchCategory = frenchCategoryEntry[0];
        console.info('Converted category to French:', frenchCategory);
      }
    }
    
    const searchQuery = getProductDetails();
    console.info('Search query:', searchQuery);
    if (searchQuery) {
      const sites = combinedSites[frenchCategory] || combinedSites['default'];
      addLinkButtons(sites, searchQuery);
    }
  }
}

// Fonction pour s'assurer que l'extension s'exécute après que le contenu soit chargé
function initializeExtension() {
  // Utilisez MutationObserver pour détecter quand le titre du produit est chargé
  const observer = new MutationObserver((mutations, obs) => {
    const productTitle = document.getElementById('productTitle');
    if (productTitle) {
      console.log('DansMaZone: Product title found, initializing extension');
      start();
      obs.disconnect(); // Arrêter d'observer une fois le titre trouvé
    }
  });
  
  // Commencer l'observation si le document est chargé
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Timeout de sécurité pour s'assurer que l'extension démarre même si le titre n'est jamais trouvé
    setTimeout(() => {
      if (!document.getElementById('productTitle')) {
        console.log('DansMaZone: Timeout reached, starting anyway');
        start();
        observer.disconnect();
      }
    }, 5000); // 5 secondes de timeout
  } else {
    // Si le document n'est pas encore prêt, attendre le DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }
}

// Initialiser l'extension
initializeExtension();