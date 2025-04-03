/**
 * Module de validation d'URLs pour DansMaZone
 * 
 * Fournit des fonctions pour vérifier la validité des URLs
 * en effectuant des requêtes HTTP réelles et en analysant les réponses.
 */

const axios = require('axios');
const { URL } = require('url');

// Timeout par défaut en millisecondes
const DEFAULT_TIMEOUT = 10000;

/**
 * Vérifie si une URL est valide en effectuant une requête HTTP
 * 
 * @param {string} url - L'URL à vérifier
 * @param {number} [timeout=10000] - Timeout en millisecondes
 * @returns {Promise<Object>} Résultat de la vérification
 */
async function checkUrl(url, timeout = DEFAULT_TIMEOUT) {
  // Remplacer les placeholders par des valeurs de test
  let testUrl = url
    .replace('##QUERY##', encodeURIComponent('test'))
    .replace('##ISBN##', '9780446310789');
  
  const result = {
    originalUrl: url,
    testUrl: testUrl,
    timestamp: Date.now(),
    status: 'invalid',
    code: null,
    error: null,
    redirectUrl: null,
    contentType: null,
    serverInfo: null
  };
  
  try {
    // Valider la structure de l'URL
    const urlObj = new URL(testUrl);
    
    // Configuration de la requête axios
    const config = {
      method: 'HEAD',  // HEAD pour ne pas télécharger tout le contenu
      timeout: timeout,
      maxRedirects: 5,
      validateStatus: null,  // Ne pas rejeter les codes d'erreur HTTP
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      }
    };
    
    // Première tentative avec HEAD
    const response = await axios.head(testUrl, config);
    
    // Si HEAD échoue ou retourne 405 (Method Not Allowed), essayer avec GET
    if (!response || response.status === 405) {
      config.method = 'GET';
      const getResponse = await axios.get(testUrl, {
        ...config,
        // Annuler après avoir reçu les headers pour économiser la bande passante
        transformResponse: [(data) => { return ''; }]
      });
      
      handleResponse(getResponse, result);
    } else {
      handleResponse(response, result);
    }
    
    return result;
  } catch (error) {
    // Traiter les erreurs axios
    if (error.response) {
      // La requête a été faite et le serveur a répondu avec un statut d'erreur
      handleResponse(error.response, result);
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      result.status = 'invalid';
      result.code = 'NETWORK_ERROR';
      result.error = 'No response received from server';
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      result.status = 'invalid';
      
      if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
        result.code = 'DNS_ERROR';
        result.error = `Domain does not exist or is not reachable (${error.code})`;
      } else if (error.code === 'ECONNREFUSED') {
        result.code = 'CONNECTION_REFUSED';
        result.error = 'Connection refused by server';
      } else {
        result.code = error.code || 'UNKNOWN_ERROR';
        result.error = error.message || 'Unknown error occurred';
      }
    }
    
    return result;
  }
}

/**
 * Traite la réponse HTTP et met à jour l'objet de résultat
 * 
 * @param {Object} response - Réponse Axios
 * @param {Object} result - Objet de résultat à mettre à jour
 */
function handleResponse(response, result) {
  // Enregistrer le code de statut HTTP
  result.code = response.status;
  
  // Récupérer l'URL finale (après redirection)
  if (response.request && response.request.res && response.request.res.responseUrl) {
    result.redirectUrl = response.request.res.responseUrl;
  }
  
  // Récupérer les informations de l'en-tête
  if (response.headers) {
    result.contentType = response.headers['content-type'];
    result.serverInfo = response.headers['server'];
  }
  
  // Analyser le code de statut HTTP pour déterminer la validité
  if (response.status >= 200 && response.status < 400) {
    // Les codes 2xx et 3xx indiquent généralement une URL valide
    result.status = 'valid';
  } else {
    // Les codes 4xx et 5xx indiquent des problèmes
    result.status = 'invalid';
    
    // Messages d'erreur basés sur le code HTTP
    if (response.status === 404) {
      result.error = 'Page not found (404)';
    } else if (response.status === 403) {
      result.error = 'Access forbidden (403)';
    } else if (response.status === 500) {
      result.error = 'Server error (500)';
    } else if (response.status === 429) {
      result.error = 'Rate limited (429)';
    } else {
      result.error = `HTTP error (${response.status})`;
    }
  }
}

/**
 * Vérifie un lot d'URLs avec gestion de la concurrence
 * 
 * @param {Array<string>} urls - Tableau d'URLs à vérifier
 * @param {number} [timeout=10000] - Timeout en millisecondes
 * @param {number} [concurrency=5] - Nombre de requêtes simultanées
 * @returns {Promise<Object>} Résultats de vérification indexés par URL
 */
async function checkUrlsBatch(urls, timeout = DEFAULT_TIMEOUT, concurrency = 5) {
  const results = {};
  const queue = [...urls];
  const running = new Set();
  
  // Fonction pour traiter la file d'attente
  async function processQueue() {
    if (queue.length === 0) return;
    
    // Prendre une URL de la file d'attente
    const url = queue.shift();
    running.add(url);
    
    try {
      // Vérifier l'URL
      console.log(`Testing (${running.size}/${concurrency}): ${url}`);
      results[url] = await checkUrl(url, timeout);
    } catch (error) {
      console.error(`Error checking ${url}:`, error);
      results[url] = {
        originalUrl: url,
        timestamp: Date.now(),
        status: 'error',
        code: 'EXCEPTION',
        error: error.message || 'Unknown error occurred'
      };
    }
    
    // Retirer l'URL des tâches en cours
    running.delete(url);
    
    // Traiter l'élément suivant
    return processQueue();
  }
  
  // Démarrer jusqu'à 'concurrency' tâches simultanées
  const workers = [];
  for (let i = 0; i < Math.min(concurrency, urls.length); i++) {
    workers.push(processQueue());
  }
  
  // Attendre que toutes les tâches soient terminées
  await Promise.all(workers);
  
  return results;
}

module.exports = {
  checkUrl,
  checkUrlsBatch
};