import browser from 'webextension-polyfill';
import '../styles/content_script.scss';
import { getSupportedLanguages, urls } from '../datas/urls.js';

let ISBN;
let language;
let product;

const supportedLanguages = getSupportedLanguages();

function start() {
  ISBN = getISBN();
  language = getLanguage();
  const productDetails = getProductDetails(); // Nouvelle fonction que vous avez ajoutée
  console.info('language', language);
  console.info('ISBN', ISBN);
  console.info('Product Details', productDetails);

  if (ISBN && language) {
    // Code existant pour les livres reste inchangé
    const buttonEl = document.createElement('div');
    buttonEl.classList.add('a-button-stack', 'a-button-stack-local');

    const urlsLang = getUrls();
    const randomUrl = urlsLang[Number.parseInt(urlsLang.length * Math.random())];
    const url = formatUrl(randomUrl.url);
    const text = browser.i18n.getMessage('buttonText');
    const icon = browser.runtime.getURL('images/icon-libraires.png');

    let buttons = `
      <a href="${url}" target="_blank" style="display:block; line-height:30px">
        <span class="a-button a-spacing-small a-button-primary a-button-icon">
          <span class="a-button-inner">
            <i class="a-icon a-icon-local"><img src="${icon}" /></i>
            ${text}
          </span>
        </span>
      </a>
    `;

    console.info(urlsLang);
    for (let i = 0, lg = urlsLang.length; i < lg; i++) {
      const link = urlsLang[i];
      buttons += getLink(link);
    }

    buttonEl.innerHTML = buttons;
    const container = document.querySelector('#rightCol .a-button-stack').parentNode;
    container.append(buttonEl);
  } else if (productDetails) { // Remplacer product par productDetails
    const buttonEl = document.createElement('div');
    buttonEl.classList.add('a-button-stack', 'a-button-stack-local');

    // Nouvelle URL pour Canadian Tire
    const url = `https://www.canadiantire.ca/fr/resultats-de-recherche.html?q=${encodeURIComponent(productDetails)}`;
    const text = 'Acheter sur Canadian Tire';
    const icon = browser.runtime.getURL('images/icon-panierbleu.png');

    const buttons = `
      <a href="${url}" target="_blank" style="display:block; line-height:30px">
        <span class="a-button a-spacing-small a-button-primary a-button-icon">
          <span class="a-button-inner">
            <i class="a-icon a-icon-local"><img src="${icon}" /></i>
            ${text}
          </span>
        </span>
      </a>
    `;

    buttonEl.innerHTML = buttons;
    const container = document.querySelector('#rightCol .a-button-stack').parentNode;
    container.append(buttonEl);
  }
}

function getLanguage() {
  const hrefLang = document.documentElement.lang;
  console.info(hrefLang);

  for (let i = 0, lg = supportedLanguages.length; i < lg; i++) {
    if (hrefLang.indexOf(supportedLanguages[i]) !== -1) {
      return supportedLanguages[i];
    }
  }

  return null;
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

function getProductType() {
  let value = ' ';
  const breadCrumbs = document.querySelectorAll(
    '#wayfinding-breadcrumbs_feature_div li span.a-list-item',
  );

  if (breadCrumbs.length >= 3) {
    value = `${breadCrumbs[breadCrumbs.length - 1].innerText} `;
  }

  const title = document.querySelector('#productTitle').innerText;
  const titles = title.split(' ');

  if (titles.length >= 4) {
    value += `${titles[0]} ${titles[1]} ${titles[2]} ${titles[3]}`;
  } else {
    value += title.substring(0, 20);
  }

  return value;
}

function getProductDetails() {
  const detailBullets = document.getElementById('detailBullets_feature_div');
  const details = {
    manufacturer: null,
    modelNumber: null,
    productName: null
  };

  // Récupérer le nom du produit
  const titleElement = document.getElementById('productTitle');
  if (titleElement) {
    details.productName = titleElement.textContent.trim();
  }

  if (detailBullets) {
    const listItems = detailBullets.querySelectorAll('li span.a-list-item');
    for (const item of listItems) {
      const label = item.querySelector('span.a-text-bold');
      const value = item.querySelector('span:not(.a-text-bold)');
      
      if (label && value) {
        const labelText = label.textContent.trim();
        const valueText = value.textContent.trim();

        if (labelText.includes('Fabricant')) {
          details.manufacturer = valueText;
        }
        if (labelText.includes('Numéro de modèle')) {
          details.modelNumber = valueText;
        }
      }
    }
  }

  // Construire une description de recherche
  let searchQuery = '';
  if (details.manufacturer) {
    searchQuery += details.manufacturer + ' ';
  }
  if (details.productName) {
    // Prendre les 4-5 premiers mots significatifs
    const words = details.productName.split(' ').slice(0, 5);
    searchQuery += words.join(' ');
  }

  return searchQuery.trim();
}

function getUrls() {
  const urlsLang = [];
  for (let i = 0, lg = urls.length; i < lg; i++) {
    // console.info(urls[i].lang, urls[i].lang.indexOf(language));
    if (urls[i].lang.indexOf(language) !== -1) {
      // console.info(urls[i]);
      urlsLang.push(urls[i]);
    }
  }
  // console.info(urlsLang);
  return urlsLang;
}

function getLink(link) {
  return `<a href="${formatUrl(link.url)}">${link.name}</a><br>`;
}

function formatUrl(url) {
  return url.replace('##ISBN##', ISBN);
}

document.addEventListener('DOMContentLoaded', () => start());