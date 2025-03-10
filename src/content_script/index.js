import browser from 'webextension-polyfill';
import '../styles/content_script.scss';
import { categorySites } from '../datas/category-sites.js';
import { classifyPage, categoryMapping } from '../datas/category-classifier.js';

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

// Dans la fonction addLinkButtons
function addLinkButtons(sites, searchTerm, container) {
  const buttonEl = document.createElement('div');
  buttonEl.classList.add('a-button-stack', 'a-button-stack-local');

  let buttons = '';
  
  // Tous les sites avec le même style
  for (const site of sites) {
    const url = site.url
      .replace('##QUERY##', encodeURIComponent(searchTerm))
      .replace('##ISBN##', searchTerm);
    
    buttons += `
      <a href="${url}" target="_blank" style="display:block; line-height:30px; margin:5px 0;">
        <span class="a-button a-spacing-small a-button-primary a-button-icon">
          <span class="a-button-inner">
            <i class="a-icon a-icon-local"><img src="${browser.runtime.getURL(`images/${site.icon}`)}" /></i>
            ${site.name}
          </span>
        </span>
      </a>
    `;
  }

  buttonEl.innerHTML = buttons;
  container.append(buttonEl);
}

function findSitesForCategory(detectedCategory) {
  // Diviser la catégorie détectée en parties
  const categoryParts = detectedCategory.split('/').map(part => part.trim());
  
  // Chercher une correspondance dans les clés de categorySites
  for (const part of categoryParts) {
    if (categorySites[part]) {
      console.info('Found sites for category:', part);
      return categorySites[part];
    }
  }

  console.info('No specific sites found, using default');
  return categorySites['default'];
}

function start() {
  const container = document.querySelector('#rightCol .a-button-stack').parentNode;
  
  const isbn = getISBN();
  if (isbn) {
    addLinkButtons(categorySites['Livres'], isbn, container);
  } else {
    // Détecte la catégorie (en français ou anglais selon la langue de la page)
    const detectedCategory = classifyPage();
    console.info('Category detected:', detectedCategory);

    // Si la catégorie est en anglais, la convertir en français pour l'utiliser comme clé
    let frenchCategory = detectedCategory;
    
    // Si la catégorie n'est pas dans categorySites, il s'agit probablement d'une catégorie en anglais
    if (!categorySites[detectedCategory]) {
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
      const sites = categorySites[frenchCategory] || categorySites['default'];
      addLinkButtons(sites, searchQuery, container);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => start());