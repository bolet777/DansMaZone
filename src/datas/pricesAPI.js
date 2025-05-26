/**
* @file src/datas/pricesAPI.js
* @license GPL-3.0
* @copyright DansMaZone.ca
* 
* Module de gestion des APIs de prix pour l'extension DansMaZone
* 
* Ce module fournit une configuration centralisée et des fonctions
* pour récupérer les prix des produits depuis différentes APIs.
* Il permet d'ajouter facilement de nouveaux fournisseurs de prix
* sans modifier le code principal de l'extension.
*/

export const pricesConfig = {
  // APIs de prix
  priceAPIs: {
    'Les Libraires': {
      url: 'https://app.leslibraires.ca/api/v1/public/books/isbn',
      searchParam: 'isbn',
      priceSelector: '.price',
      displayName: 'Les Libraires'
    }
  },
   
  // Sites avec gestion des prix
  priceEnabledSites: ['Les Libraires'],
  
  // Configuration par défaut
  timeout: 5000,
  fallbackPrice: null
};

/**
* Récupère le prix d'un produit depuis l'API configurée pour un site donné
* @param {string} siteName - Nom du site (doit correspondre à une clé dans priceAPIs)
* @param {string} isbn - L'ISBN du livre à rechercher
* @returns {Promise<Object|null>} Données du produit avec prix et disponibilité, ou null si erreur
*/
export async function fetchBookPrice(siteName, isbn) {
  const apiConfig = pricesConfig.priceAPIs[siteName];
  if (!apiConfig) {
    console.log('DansMaZone: Configuration API non trouvée pour', siteName);
    return null;
  }
  
  try {
    const url = `${apiConfig.url}/${isbn}`;
    console.log('DansMaZone: Appel API vers:', url);
    
    const response = await fetch(url, {
      timeout: pricesConfig.timeout
    });
    
    console.log('DansMaZone: Status de la réponse:', response.status);
    
    if (!response.ok) {
      console.log('DansMaZone: Réponse API non OK:', response.status, response.statusText);
      return null;
    }
    
    const data = await response.json();
    console.log('DansMaZone: Données brutes de l\'API:', data);
    
    const result = extractPrice(data, apiConfig);
    console.log('DansMaZone: Résultat après extraction:', result);
    
    return result;
  } catch (error) {
    console.warn(`Prix non disponible pour ${siteName}:`, error);
    return null;
  }
}

/**
* Extrait et formate les données de prix depuis la réponse API
* @param {Object} data - Réponse brute de l'API
* @param {Object} apiConfig - Configuration de l'API utilisée
* @returns {Object|null} Objet contenant le prix, la disponibilité et l'URL, ou null si extraction échoue
*/
export function extractPrice(data, apiConfig) {
  console.log('DansMaZone: Extraction du prix pour:', data);
  
  // Les données sont dans data.data
  const bookData = data.data;
  
  if (bookData && bookData.available && bookData.price) {
    const result = {
      price: bookData.price,
      available: bookData.available,
      url: bookData.url || `https://www.leslibraires.ca/livres/${bookData.isbn || 'unknown'}.html`
    };
    console.log('DansMaZone: Prix extrait avec succès:', result);
    return result;
  }
  
  console.log('DansMaZone: Conditions non remplies pour l\'extraction:', {
    hasData: !!data,
    hasBookData: !!bookData,
    available: bookData?.available,
    price: bookData?.price
  });
  
  return null;
}