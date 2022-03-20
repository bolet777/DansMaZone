/* eslint-disable import/first, indent */
global.browser = require('webextension-polyfill');

import '../styles/content_script.scss';
import { getSupportedLanguages, urls } from '../datas/urls.js';

let ISBN, language, product;
const supportedLanguages = getSupportedLanguages();

function start() {
  // const productTitle = document.getElementById('productTitle').innerHTML;
  ISBN = getISBN();
  language = getLanguage();
  product = getProductType();
  console.log('language', language);
  console.log('ISBN', ISBN);
  console.log('Product', product);
  if (ISBN && language) {
    const buttonEl = document.createElement('div');
    buttonEl.classList.add('a-button-stack', 'a-button-stack-local');

    const urlsLang = getUrls();
    const randomUrl = urlsLang[parseInt(urlsLang.length * Math.random())];
    const url = formatUrl(randomUrl.url);
    const text = browser.i18n.getMessage('buttonText');
    const icon = browser.runtime.getURL('images/icon-store.png');

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

    console.log(urlsLang);
    for (let i = 0, lg = urlsLang.length; i < lg; i++) {
      const link = urlsLang[i];
      buttons += getLink(link);
    }

    buttonEl.innerHTML = buttons;

    // const container = document.querySelector('#buybox .a-box-inner');
    const container = document.querySelector('#rightCol .a-button-stack').parentNode;
    // const container = document.querySelector('#bbopAndCartBox');
    // container.innerHTML = '';
    container.append(buttonEl);
  } else if (product) {
    const buttonEl = document.createElement('div');
    buttonEl.classList.add('a-button-stack', 'a-button-stack-local');

    const url = 'https://www.lepanierbleu.ca/produits?keyword=' + product;
    const text = 'Acheter sur Panier Bleu';
    const icon = browser.runtime.getURL('images/icon-store.png');

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

    // const urlName = 'Panier·Bleu';
    // const link = `<a href="${url}">${urlName}</a><br>`;
    // console.log('Link', link);
    // buttons += link;

    buttonEl.innerHTML = buttons;

    // const container = document.querySelector('#buybox .a-box-inner');
    const container = document.querySelector('#rightCol .a-button-stack').parentNode;
    // const container = document.querySelector('#bbopAndCartBox');
    // container.innerHTML = '';
    container.append(buttonEl);
  }
}

function getLanguage() {
  const hrefLang = document.documentElement.lang;
  console.log(hrefLang);

  for (let i = 0, lg = supportedLanguages.length; i < lg; i++) {
    if (hrefLang.indexOf(supportedLanguages[i]) !== -1) {
      return supportedLanguages[i];
    }
  }

  return null;
}

function getISBN() {
  const bulletSpans = document.querySelectorAll('#detailBullets_feature_div li span.a-list-item');
  for (let i = 0; i < bulletSpans.length; ++i) {
    if (bulletSpans[i].innerText && bulletSpans[i].innerText.indexOf('ISBN-13') !== -1) {
      return bulletSpans[i].querySelector('span:last-child').innerText.replace('-', '');
    }
  }
}

function getProductType() {
  var value = ' ';
  // Get the breadCrumbs value
  const breadCrumbs = document.querySelectorAll('#wayfinding-breadcrumbs_feature_div li span.a-list-item');
  console.log('breadCrumbs', breadCrumbs);
  if (breadCrumbs.length >= 3) {
    value = breadCrumbs[breadCrumbs.length - 1].innerText + ' ';
  }
  // Get the Product title value
  const title = document.querySelector('#productTitle').innerText;
  console.log('Title', title);
  var titles = title.split(' ');
  if (titles.length >= 4) {
    value += titles[0] + ' ' + titles[1] + ' ' + titles[2] + ' ' + titles[3];
  } else {
    value += title.substring(0, 20);
  }
  // return bulletSpans[bulletSpans.length - 1].innerText;
  return value;
}

function getUrls() {
  const urlsLang = [];
  for (let i = 0, lg = urls.length; i < lg; i++) {
    // console.log(urls[i].lang, urls[i].lang.indexOf(language));
    if (urls[i].lang.indexOf(language) !== -1) {
      // console.log(urls[i]);
      urlsLang.push(urls[i]);
    }
  }
  // console.log(urlsLang);
  return urlsLang;
}

function getLink(link) {
  return `<a href="${formatUrl(link.url)}">${link.name}</a><br>`;
}

function formatUrl(url) {
  return url.replace('##ISBN##', ISBN);
}

document.addEventListener('DOMContentLoaded', () => start());
