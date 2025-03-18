import browser from 'webextension-polyfill';
import defaultSites from '../datas/default-sites.json';
import { categoryKeywords, categoryMapping } from '../datas/category-classifier.js';

// Fonction pour obtenir les traductions
function getI18nMessages() {
  // Liste des clés de traduction nécessaires pour la page d'options
  const keys = [
    'extensionName', 'optionsTitle', 'mySitesTab', 'keywordsTab', 'contributeTab', 
    'searchSite', 'category', 'allCategories', 'addSite', 'siteName', 
    'siteNamePlaceholder', 'searchUrl', 'searchUrlPlaceholder', 'searchUrlInfo',
    'testTerm', 'testUrl', 'addButton', 'myCustomSites', 'importExport',
    'exportSites', 'importSites', 'keywordsManagement', 'addKeywords',
    'keywordsPlaceholder', 'language', 'frenchKeywords', 'englishKeywords',
    'contributeTitle', 'contributeDescription', 'shareSites', 'exportSitesStep1',
    'exportSitesStep2', 'exportSitesStep3', 'exportForContribution', 'improveCode',
    'improveCodeStep1', 'improveCodeStep2', 'improveCodeStep3', 'viewOnGitHub',
    'newCategory', 'reportBug', 'enterSearchTerm', 'confirmDelete', 'fillAllFields',
    'newCategoryPrompt', 'siteAddedSuccess', 'siteDeletedSuccess', 'enterTestTerm',
    'exportSuccess', 'importSuccess', 'enterValidKeyword', 'keywordsAddedSuccess',
    'keywordDeletedSuccess'
  ];
  
  // Récupérer toutes les traductions demandées
  const translations = {};
  for (const key of keys) {
    translations[key] = browser.i18n.getMessage(key) || '';
  }
  
  return translations;
}

// Stocker les références aux éléments du DOM
const elements = {
  tabs: document.querySelectorAll('.tab-btn'),
  tabContents: document.querySelectorAll('.tab-content'),
  siteSearch: document.getElementById('site-search'),
  categoryFilter: document.getElementById('category-filter'),
  sitesContainer: document.querySelector('.sites-container'),
  siteCategory: document.getElementById('site-category'),
  siteName: document.getElementById('site-name'),
  siteUrlFr: document.getElementById('site-url-fr'),
  siteUrlEn: document.getElementById('site-url-en'),
  siteUrlTest: document.getElementById('site-url-test'),
  testUrlFrBtn: document.getElementById('test-url-fr-btn'),
  testUrlEnBtn: document.getElementById('test-url-en-btn'),
  autoGenerateUrlBtn: document.getElementById('auto-generate-url'),
  copyUrlFrBtn: document.getElementById('copy-url-fr'),
  addSiteBtn: document.getElementById('add-site-btn'),
  exportBtn: document.getElementById('export-btn'),
  exportContribBtn: document.getElementById('export-contrib-btn'),
  importFile: document.getElementById('import-file'),
  versionElement: document.getElementById('version'),
  versionFooterElement: document.getElementById('version-footer'),
  optionsTitleElement: document.getElementById('options-title'),
  mySitesTabElement: document.querySelector('[data-tab="user-sites"]'),
  keywordsTabElement: document.querySelector('[data-tab="keywords"]'),
  contributeTabElement: document.querySelector('[data-tab="contribute"]'),
  searchSiteElement: document.getElementById('site-search'),
  categoryFilterLabel: document.querySelector('label[for="category-filter"]'),
  addSiteTitle: document.querySelector('.add-site-form h3'),
  siteCategoryLabel: document.querySelector('label[for="site-category"]'),
  siteNameLabel: document.querySelector('label[for="site-name"]'),
  // Utiliser des sélecteurs plus robustes ou initialiser ces références plus tard
  searchUrlFrLabel: null, // Sera initialisé dans localizeUI
  searchUrlEnLabel: null, // Sera initialisé dans localizeUI
  searchUrlInfo: document.querySelector('.url-info'),
  myCustomSitesTitle: document.querySelector('.sites-container').previousElementSibling,
  importExportTitle: document.querySelector('.import-export h3'),
  importSitesLabel: document.querySelector('.import-label')
};

// Structure de données pour stocker les sites personnalisés
let userSites = {};
// Objet pour stocker les traductions
let i18n = {};

// Fonction pour appliquer les traductions à l'interface utilisateur
function localizeUI() {
  try {
    // Charger les traductions
    i18n = getI18nMessages();
    
    // Initialiser les éléments qui n'avaient pas pu être trouvés plus tôt
    elements.searchUrlFrLabel = document.querySelector('label[for="site-url-fr"]');
    elements.searchUrlEnLabel = document.querySelector('label[for="site-url-en"]');
    
    // Titre de la page
    document.title = i18n.optionsTitle || "Options DansMaZone";
    if (elements.optionsTitleElement) {
      elements.optionsTitleElement.textContent = i18n.optionsTitle || "Options DansMaZone";
    }
    
    // Onglets
    if (elements.mySitesTabElement) {
      elements.mySitesTabElement.textContent = i18n.mySitesTab || "Mes sites";
    }
    if (elements.keywordsTabElement) {
      elements.keywordsTabElement.textContent = i18n.keywordsTab || "Mots-clés";
    }
    if (elements.contributeTabElement) {
      elements.contributeTabElement.textContent = i18n.contributeTab || "Contribuer";
    }
    
    // Recherche et filtre
    if (elements.searchSiteElement) {
      elements.searchSiteElement.placeholder = i18n.searchSite || "Rechercher un site...";
    }
    if (elements.categoryFilterLabel) {
      elements.categoryFilterLabel.textContent = i18n.category || "Catégorie:";
    }
    
    // Formulaire d'ajout de site
    if (elements.addSiteTitle) {
      elements.addSiteTitle.textContent = i18n.addSite || "Ajouter un site";
    }
    if (elements.siteCategoryLabel) {
      elements.siteCategoryLabel.textContent = i18n.category || "Catégorie:";
    }
    if (elements.siteNameLabel) {
      elements.siteNameLabel.textContent = i18n.siteName || "Nom du site:";
    }
    if (elements.siteName) {
      elements.siteName.placeholder = i18n.siteNamePlaceholder || "Ex: Ma Librairie Locale";
    }
    if (elements.searchUrlFrLabel) {
      elements.searchUrlFrLabel.textContent = "URL de recherche (FR):";
    }
    if (elements.searchUrlEnLabel) {
      elements.searchUrlEnLabel.textContent = "URL de recherche (EN):";
    }
    if (elements.siteUrlFr) {
      elements.siteUrlFr.placeholder = "Ex: https://example.com/fr/search?q=##QUERY##";
    }
    if (elements.siteUrlEn) {
      elements.siteUrlEn.placeholder = "Ex: https://example.com/en/search?q=##QUERY##";
    }
    if (elements.searchUrlInfo) {
      elements.searchUrlInfo.innerHTML = i18n.searchUrlInfo || 'Utilisez <code>##QUERY##</code> pour indiquer où le terme de recherche sera inséré, ou <code>##ISBN##</code> pour les livres.';
    }
    if (elements.siteUrlTest) {
      elements.siteUrlTest.placeholder = i18n.testTerm || "Terme de test (pour essayer l'URL)";
    }
    if (elements.testUrlFrBtn) {
      elements.testUrlFrBtn.textContent = "Tester URL FR";
    }
    if (elements.testUrlEnBtn) {
      elements.testUrlEnBtn.textContent = "Tester URL EN";
    }
    if (elements.addSiteBtn) {
      elements.addSiteBtn.textContent = i18n.addButton || "Ajouter le site";
    }
    
    // Liste des sites personnalisés
    if (elements.myCustomSitesTitle) {
      elements.myCustomSitesTitle.textContent = i18n.myCustomSites || "Mes sites personnalisés";
    }
    
    // Import/Export
    if (elements.importExportTitle) {
      elements.importExportTitle.textContent = i18n.importExport || "Importer / Exporter";
    }
    if (elements.exportBtn) {
      elements.exportBtn.textContent = i18n.exportSites || "Exporter mes sites";
    }
    if (elements.importSitesLabel) {
      elements.importSitesLabel.textContent = i18n.importSites || "Importer des sites";
    }
    
    // Option "Toutes les catégories"
    if (elements.categoryFilter) {
      const allCategoriesOption = elements.categoryFilter.querySelector('option[value="all"]');
      if (allCategoriesOption) {
        allCategoriesOption.textContent = i18n.allCategories || "Toutes les catégories";
      }
    }
    
    // Section des mots-clés
    const keywordsMgmtTitle = document.getElementById('keywords-management-title');
    if (keywordsMgmtTitle) {
      keywordsMgmtTitle.textContent = i18n.keywordsManagement || "Gestion des mots-clés";
    }
    
    const keywordsInputLabel = document.getElementById('keywords-input-label');
    if (keywordsInputLabel) {
      keywordsInputLabel.textContent = i18n.addKeywords || "Ajouter des mots-clés (séparés par virgule):";
    }
    
    const keywordInput = document.getElementById('keyword-input');
    if (keywordInput) {
      keywordInput.placeholder = i18n.keywordsPlaceholder || "Ex: ordinateur, écran, clavier";
    }
    
    const keywordsLanguageLabel = document.getElementById('keywords-language-label');
    if (keywordsLanguageLabel) {
      keywordsLanguageLabel.textContent = i18n.language || "Langue:";
    }
    
    const addKeywordsBtn = document.getElementById('add-keywords-btn');
    if (addKeywordsBtn) {
      addKeywordsBtn.textContent = i18n.addButton || "Ajouter";
    }
    
    const frKeywordsTitle = document.getElementById('fr-keywords-title');
    if (frKeywordsTitle) {
      frKeywordsTitle.textContent = i18n.frenchKeywords || "Mots-clés français";
    }
    
    const enKeywordsTitle = document.getElementById('en-keywords-title');
    if (enKeywordsTitle) {
      enKeywordsTitle.textContent = i18n.englishKeywords || "Mots-clés anglais";
    }
    
    // Section Contribuer
    const contributeTitle = document.getElementById('contribute-title');
    if (contributeTitle) {
      contributeTitle.textContent = i18n.contributeTitle || "Contribuer à DansMaZone";
    }
    
    const contributeDescription = document.getElementById('contribute-description');
    if (contributeDescription) {
      contributeDescription.textContent = i18n.contributeDescription || "Aidez à améliorer DansMaZone en partageant vos sites ou en signalant des bugs.";
    }
    
    const shareSitesTitle = document.getElementById('share-sites-title');
    if (shareSitesTitle) {
      shareSitesTitle.textContent = i18n.shareSites || "Partager vos sites";
    }
    
    const exportStep1 = document.getElementById('export-step-1');
    if (exportStep1) {
      exportStep1.textContent = i18n.exportSitesStep1 || "Exportez vos sites personnalisés";
    }
    
    const exportStep2 = document.getElementById('export-step-2');
    if (exportStep2) {
      exportStep2.textContent = i18n.exportSitesStep2 || "Envoyez le fichier JSON généré par email";
    }
    
    const exportStep3 = document.getElementById('export-step-3');
    if (exportStep3) {
      exportStep3.textContent = i18n.exportSitesStep3 || "Vos sites pourront être intégrés dans une future version";
    }
    
    const exportContribBtn = document.getElementById('export-contrib-btn');
    if (exportContribBtn) {
      exportContribBtn.textContent = i18n.exportForContribution || "Exporter pour contribution";
    }
    
    const improveCodeTitle = document.getElementById('improve-code-title');
    if (improveCodeTitle) {
      improveCodeTitle.textContent = i18n.improveCode || "Améliorer le code";
    }
    
    const improveStep1 = document.getElementById('improve-step-1');
    if (improveStep1) {
      improveStep1.textContent = i18n.improveCodeStep1 || "Le code est disponible sur GitHub";
    }
    
    const improveStep2 = document.getElementById('improve-step-2');
    if (improveStep2) {
      improveStep2.textContent = i18n.improveCodeStep2 || "Vous pouvez proposer des améliorations via des Pull Requests";
    }
    
    const improveStep3 = document.getElementById('improve-step-3');
    if (improveStep3) {
      improveStep3.textContent = i18n.improveCodeStep3 || "Ou signaler des bugs via des Issues";
    }
    
    const githubLink = document.getElementById('github-link');
    if (githubLink) {
      githubLink.textContent = i18n.viewOnGitHub || "Voir sur GitHub";
    }
    
    // Boutons spécifiques au nouveau format multilingue
    if (elements.autoGenerateUrlBtn) {
      elements.autoGenerateUrlBtn.textContent = "Auto-générer depuis l'URL FR";
    }
    if (elements.copyUrlFrBtn) {
      elements.copyUrlFrBtn.textContent = "Copier depuis FR";
    }
  } catch (error) {
    console.error("Erreur lors de la localisation de l'interface:", error);
  }
}

// Initialisation de la page
async function initOptions() {
  try {
    // Afficher la version de l'extension
    const manifestData = browser.runtime.getManifest();
    if (elements.versionElement) {
      elements.versionElement.textContent = manifestData.version;
    }
    
    if (elements.versionFooterElement) {
      elements.versionFooterElement.textContent = manifestData.version;
    }
    
    // Localiser l'interface
    localizeUI();
    
    // Initialiser les onglets
    initTabs();
    
    // Charger les sites personnalisés depuis le stockage
    await loadUserSites();
    
    // Charger les mots-clés par défaut
    try {
      loadDefaultKeywords();
    } catch (keywordsError) {
      console.error("Erreur lors du chargement des mots-clés par défaut:", keywordsError);
      // Continuer l'exécution même si cette partie échoue
    }
    
    // Remplir les listes déroulantes de catégories
    try {
      populateCategoryDropdowns();
    } catch (categoriesError) {
      console.error("Erreur lors du remplissage des catégories:", categoriesError);
      // Continuer l'exécution même si cette partie échoue
    }
    
    try {
      populateKeywordCategoryDropdown();
    } catch (keywordCategoriesError) {
      console.error("Erreur lors du remplissage des catégories de mots-clés:", keywordCategoriesError);
      // Continuer l'exécution même si cette partie échoue
    }
    
    // Initialiser la fonctionnalité de mots-clés
    try {
      await initKeywordsFeature();
    } catch (keywordFeatureError) {
      console.error("Erreur lors de l'initialisation des mots-clés:", keywordFeatureError);
      // Continuer l'exécution même si cette partie échoue
    }
    
    // Afficher les sites
    try {
      renderSites();
    } catch (renderError) {
      console.error("Erreur lors du rendu des sites:", renderError);
      // Continuer l'exécution même si cette partie échoue
    }
    
    // Si un onglet des mots-clés est actif, afficher les mots-clés
    try {
      if (elements.keywordCategory && elements.keywordCategory.value) {
        renderKeywords(elements.keywordCategory.value);
      }
    } catch (renderKeywordsError) {
      console.error("Erreur lors du rendu des mots-clés:", renderKeywordsError);
      // Continuer l'exécution même si cette partie échoue
    }
    
    try {
      setupBugReporting();
    } catch (bugReportingError) {
      console.error("Erreur lors de la configuration du rapport de bugs:", bugReportingError);
      // Continuer l'exécution même si cette partie échoue
    }
    
    // Ajouter les écouteurs d'événements
    try {
      attachEventListeners();
    } catch (eventsError) {
      console.error("Erreur lors de l'attachement des écouteurs d'événements:", eventsError);
      // Continuer l'exécution même si cette partie échoue
    }
    
    console.log("Initialisation de la page d'options terminée avec succès!");
  } catch (error) {
    console.error("Erreur critique lors de l'initialisation des options:", error);
    // Afficher une notification plus détaillée
    showNotification("Une erreur est survenue lors de l'initialisation. Consultez la console pour plus de détails.", "error");
  }
}

// Initialiser les onglets
function initTabs() {
  try {
    if (!elements.tabs || !elements.tabs.forEach) {
      console.warn("Les onglets n'ont pas été correctement initialisés");
      return;
    }
    
    elements.tabs.forEach(tab => {
      if (!tab) return;
      
      tab.addEventListener('click', () => {
        try {
          // Supprimer la classe active de tous les onglets
          elements.tabs.forEach(t => {
            if (t) t.classList.remove('active');
          });
          
          if (elements.tabContents && elements.tabContents.forEach) {
            elements.tabContents.forEach(c => {
              if (c) c.classList.remove('active');
            });
          }
          
          // Ajouter la classe active à l'onglet cliqué
          tab.classList.add('active');
          
          // Afficher le contenu de l'onglet
          const tabId = tab.dataset.tab;
          const tabContent = document.getElementById(tabId);
          if (tabContent) {
            tabContent.classList.add('active');
          } else {
            console.warn(`Contenu d'onglet non trouvé pour l'ID: ${tabId}`);
          }
        } catch (tabClickError) {
          console.error("Erreur lors du changement d'onglet:", tabClickError);
        }
      });
    });
  } catch (error) {
    console.error("Erreur lors de l'initialisation des onglets:", error);
  }
}

// Charger les sites personnalisés depuis le stockage
async function loadUserSites() {
    try {
      const result = await browser.storage.local.get('userSites');
      userSites = result.userSites || {};
      
      // S'assurer que toutes les catégories sont initialisées
      Object.keys(defaultSites).forEach(category => {
        if (!userSites[category]) {
          userSites[category] = [];
        }
      });
      
      return true;
    } catch (error) {
      handleError(error, 'chargement des sites personnalisés', true, true);
      
      // En cas d'erreur critique, initialiser avec un objet vide mais fonctionnel
      userSites = {};
      Object.keys(defaultSites).forEach(category => {
        userSites[category] = [];
      });
      
      return false;
    }
  }

// Sauvegarder les sites personnalisés dans le stockage
async function saveUserSites() {
    try {
      await browser.storage.local.set({ userSites });
      return true;
    } catch (error) {
      handleError(error, 'sauvegarde des sites personnalisés', true, false);
      
      // Proposer une solution de contournement
      if (error.message && error.message.includes('QUOTA_EXCEEDED')) {
        showNotification(
          'Espace de stockage insuffisant. Essayez de supprimer certains sites personnalisés.',
          'error'
        );
      }
      
      return false;
    }
  }

// Fonction améliorée pour le tri des catégories avec prise en compte des accents
function sortCategories(categories) {
    return categories.sort((a, b) => {
      // Utiliser localeCompare avec les options pour les caractères français
      return a.localeCompare(b, 'fr', { sensitivity: 'base' });
    });
}

// Remplir les listes déroulantes de catégories
function populateCategoryDropdowns() {
  // Vider d'abord les listes déroulantes
  elements.categoryFilter.innerHTML = '<option value="all">' + (i18n.allCategories || "Toutes les catégories") + '</option>';
  elements.siteCategory.innerHTML = '';
  
  // Obtenir toutes les catégories (par défaut + personnalisées)
  const allCategories = [...new Set([
    ...Object.keys(defaultSites),
    ...Object.keys(userSites)
  ])];
  
  // Trier les catégories avec notre nouvelle fonction
  const categories = sortCategories(allCategories);
  
  // Filtre de catégorie
  categories.forEach(category => {
    if (category !== 'default') {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      elements.categoryFilter.appendChild(option);
    }
  });
  
  // Liste déroulante pour l'ajout de site
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    elements.siteCategory.appendChild(option);
  });
  
  // Ajouter une option pour créer une nouvelle catégorie
  const newCategoryOption = document.createElement('option');
  newCategoryOption.value = 'new';
  newCategoryOption.textContent = i18n.newCategory || '+ Nouvelle catégorie';
  elements.siteCategory.appendChild(newCategoryOption);
}

/**
 * Auto-génère une URL en anglais à partir d'une URL en français
 * @param {string} frUrl - L'URL en français
 * @returns {string} L'URL en anglais générée
 */
function autoGenerateEnUrlFromFr(frUrl) {
  if (!frUrl) return '';
  
  // Cas simple : remplacement de /fr/ par /en/
  if (frUrl.includes('/fr/')) {
    return frUrl.replace('/fr/', '/en/');
  }
  
  // Cas avec un domaine .fr
  if (frUrl.includes('.fr/')) {
    return frUrl.replace('.fr/', '.com/');
  }
  
  // Cas avec ?lang=fr ou &lang=fr
  if (frUrl.includes('lang=fr')) {
    return frUrl.replace('lang=fr', 'lang=en');
  }
  
  // Cas avec locale=fr ou locale=fr_FR ou locale=fr_CA
  if (frUrl.match(/locale=fr(_[A-Z]{2})?/)) {
    return frUrl.replace(/locale=fr(_[A-Z]{2})?/, 'locale=en_CA');
  }
  
  // Cas avec "recherche" dans l'URL (pour les sites français)
  const searchTerms = {
    'recherche': 'search',
    'resultats-de-recherche': 'search-results',
    'resultats': 'results'
  };
  
  let newUrl = frUrl;
  Object.entries(searchTerms).forEach(([fr, en]) => {
    newUrl = newUrl.replace(fr, en);
  });
  
  // Si aucune modification n'a été apportée, simplement retourner l'URL d'origine
  return newUrl !== frUrl ? newUrl : frUrl;
}

// Afficher tous les sites (par défaut + personnalisés)
function renderSites() {
    // Vider le conteneur
    elements.sitesContainer.innerHTML = '';
    
    // Obtenir le filtre de catégorie
    const categoryFilter = elements.categoryFilter.value;
    // Obtenir le terme de recherche
    const searchTerm = elements.siteSearch.value.toLowerCase();
    
    // Obtenir toutes les catégories (par défaut + personnalisées)
    let allCategories = [...new Set([
      ...Object.keys(defaultSites),
      ...Object.keys(userSites)
    ])];
    
    // Trier les catégories
    let categories = sortCategories(allCategories);
    
    // Filtrer les catégories si nécessaire
    if (categoryFilter !== 'all') {
      categories = categories.filter(category => category === categoryFilter);
    }
  
  // Afficher chaque catégorie
  categories.forEach(category => {
    // Ignorer la catégorie par défaut dans l'affichage
    if (category === 'default' && categoryFilter === 'all') {
      return;
    }
    
    // Obtenir tous les sites de cette catégorie (par défaut + personnalisés)
    const defaultCategorySites = defaultSites[category] || [];
    const userCategorySites = userSites[category] || [];
    
    // Fusionner les sites par défaut et personnalisés
    let allSites = [
      ...defaultCategorySites.map(site => ({ ...site, isDefault: true })),
      ...userCategorySites.map(site => ({ ...site, isDefault: false }))
    ];
    
    // Filtrer les sites si un terme de recherche est fourni
    if (searchTerm) {
      allSites = allSites.filter(site => {
        const nameMatch = site.name.toLowerCase().includes(searchTerm);
        
        // Vérifier les URLs (ancien et nouveau format)
        let urlMatch = false;
        if (site.url) {
          urlMatch = site.url.toLowerCase().includes(searchTerm);
        } else if (site.urls) {
          urlMatch = Object.values(site.urls).some(url => 
            url && url.toLowerCase().includes(searchTerm)
          );
        }
        
        return nameMatch || urlMatch;
      });
    }
    
    // Si aucun site ne correspond au filtre, ne pas afficher cette catégorie
    if (allSites.length === 0) {
      return;
    }
    
    // Créer la section de catégorie
    const categorySection = document.createElement('div');
    categorySection.className = 'category-section';
    
    // En-tête de la catégorie
    const categoryHeader = document.createElement('div');
    categoryHeader.className = 'category-header';
    categoryHeader.innerHTML = `
      <h2>${category}</h2>
      <span class="toggle-icon">▼</span>
    `;
    categorySection.appendChild(categoryHeader);
    
    // Contenu de la catégorie
    const categoryContent = document.createElement('div');
    categoryContent.className = 'category-content';

    // Afficher chaque site
    allSites.forEach(site => {
        const siteItem = document.createElement('div');
        siteItem.className = 'site-item';
        
        // Créer les éléments de manière sécurisée
        const siteInfo = document.createElement('div');
        siteInfo.className = 'site-info';
        
        const siteName = document.createElement('div');
        siteName.className = 'site-name';
        siteName.textContent = site.name;
        
        const siteUrl = document.createElement('div');
        siteUrl.className = 'site-url';
        
        // Afficher les URLs selon le format (ancien ou nouveau)
        if (site.urls) {
          siteUrl.innerHTML = `
            <div><small>FR:</small> ${site.urls.fr || 'N/A'}</div>
            <div><small>EN:</small> ${site.urls.en || 'N/A'}</div>
          `;
        } else {
          siteUrl.textContent = site.url || 'N/A';
        }
        
        siteInfo.appendChild(siteName);
        siteInfo.appendChild(siteUrl);
        
        const siteActions = document.createElement('div');
        siteActions.className = 'site-actions';
        
        // Bouton de test - maintenant un menu déroulant
        const testBtn = document.createElement('button');
        testBtn.className = 'test-site-btn';
        testBtn.title = 'Tester';
        testBtn.textContent = '🔍';
        siteActions.appendChild(testBtn);
        
        // Boutons d'édition et de suppression pour les sites non par défaut
        if (!site.isDefault) {
          const editBtn = document.createElement('button');
          editBtn.className = 'edit-site-btn';
          editBtn.title = 'Modifier';
          editBtn.textContent = '✏️';
          siteActions.appendChild(editBtn);
          
          const deleteBtn = document.createElement('button');
          deleteBtn.className = 'delete-site-btn';
          deleteBtn.title = 'Supprimer';
          deleteBtn.textContent = '🗑️';
          siteActions.appendChild(deleteBtn);
        }
        
        siteItem.appendChild(siteInfo);
        siteItem.appendChild(siteActions);
        
        // Ajouter les données du site à l'élément de manière sécurisée
        siteItem.dataset.category = category;
        siteItem.dataset.name = site.name;
        
        // Stocker les URLs selon le format (ancien ou nouveau)
        if (site.urls) {
          siteItem.dataset.urlFr = site.urls.fr || '';
          siteItem.dataset.urlEn = site.urls.en || '';
        } else {
          siteItem.dataset.url = site.url || '';
        }
        
        siteItem.dataset.isDefault = site.isDefault.toString(); // Conversion explicite en chaîne
        
        categoryContent.appendChild(siteItem);
    });
    
    categorySection.appendChild(categoryContent);
    elements.sitesContainer.appendChild(categorySection);
    
    // Ajouter un écouteur d'événement pour l'expansion/réduction
    categoryHeader.addEventListener('click', () => {
      categoryContent.classList.toggle('expanded');
      const toggleIcon = categoryHeader.querySelector('.toggle-icon');
      toggleIcon.textContent = categoryContent.classList.contains('expanded') ? '▲' : '▼';
    });
    
    // Développer par défaut si une seule catégorie est affichée ou si un terme de recherche est fourni
    if (categories.length === 1 || searchTerm) {
      categoryContent.classList.add('expanded');
      categoryHeader.querySelector('.toggle-icon').textContent = '▲';
    }
  });
}

// Valider une URL de recherche
function validateSearchUrl(url) {
  // Vérifier si l'URL est valide
  try {
    new URL(url);
  } catch (e) {
    return {
      valid: false,
      message: "L'URL n'est pas valide."
    };
  }
  
  // Vérifier si l'URL contient le marqueur de requête
  if (!url.includes('##QUERY##') && !url.includes('##ISBN##')) {
    return {
      valid: false,
      message: "L'URL doit contenir ##QUERY## ou ##ISBN## pour indiquer où le terme de recherche sera inséré."
    };
  }
  
  return {
    valid: true,
    message: "L'URL est valide."
  };
}

// Tester une URL de recherche
function testSearchUrl(url, testTerm, language = null) {
  // Valider l'URL
  const validation = validateSearchUrl(url);
  if (!validation.valid) {
    showNotification(validation.message, 'error');
    return;
  }
  
  // Remplacer le marqueur par le terme de test
  let testUrl = url
    .replace('##QUERY##', encodeURIComponent(testTerm))
    .replace('##ISBN##', testTerm);
  
  // Ouvrir l'URL dans un nouvel onglet
  browser.tabs.create({ url: testUrl });
  
  // Afficher un message indiquant la langue testée
  if (language) {
    showNotification(`Test de l'URL ${language.toUpperCase()} en cours...`, 'success');
  }
}

// Ajouter un site personnalisé
async function addUserSite(category, name, urlFr, urlEn) {
  // Valider les URLs
  const validationFr = validateSearchUrl(urlFr);
  if (!validationFr.valid) {
    showNotification(`URL FR: ${validationFr.message}`, 'error');
    return false;
  }
  
  const validationEn = validateSearchUrl(urlEn);
  if (!validationEn.valid) {
    showNotification(`URL EN: ${validationEn.message}`, 'error');
    return false;
  }
  
  // Vérifier si la catégorie existe
  if (!userSites[category]) {
    userSites[category] = [];
  }
  
  // Vérifier si le site existe déjà
  const existingIndex = userSites[category].findIndex(site => site.name === name);
  if (existingIndex !== -1) {
    // Mettre à jour le site existant
    userSites[category][existingIndex] = {
      name,
      urls: {
        fr: urlFr,
        en: urlEn
      }
    };
  } else {
    // Ajouter un nouveau site
    userSites[category].push({
      name,
      urls: {
        fr: urlFr,
        en: urlEn
      }
    });
  }
  
  // Sauvegarder et rafraîchir l'affichage
  const saved = await saveUserSites();
  if (saved) {
    renderSites();
    return true;
  }
  
  return false;
}

// Supprimer un site personnalisé
// Compléter la fonction deleteUserSite
async function deleteUserSite(category, name) {
    // Vérifier si la catégorie existe
    if (!userSites[category]) {
      return false;
    }
    
    // Trouver l'index du site
    const siteIndex = userSites[category].findIndex(site => site.name === name);
    if (siteIndex === -1) {
      return false;
    }
    
    // Supprimer le site
    userSites[category].splice(siteIndex, 1);
    
    // Si la catégorie est vide et n'est pas une catégorie par défaut, la supprimer
    if (userSites[category].length === 0 && !defaultSites[category]) {
      delete userSites[category];
    }
    
    // Sauvegarder et rafraîchir l'affichage
    const saved = await saveUserSites();
    if (saved) {
      renderSites();
      return true;
    }
    
    return false;
}
  
// Fonction pour attacher tous les écouteurs d'événements
function attachEventListeners() {
    // Écouteur pour la recherche de sites
    elements.siteSearch.addEventListener('input', () => {
      renderSites();
    });
    
    // Écouteur pour le filtre de catégorie
    elements.categoryFilter.addEventListener('change', () => {
      renderSites();
    });
    
    // Écouteur pour auto-générer l'URL EN depuis l'URL FR
    elements.autoGenerateUrlBtn.addEventListener('click', () => {
      const frUrl = elements.siteUrlFr.value;
      if (!frUrl) {
        showNotification('Veuillez d\'abord saisir l\'URL FR.', 'error');
        return;
      }
      
      const enUrl = autoGenerateEnUrlFromFr(frUrl);
      elements.siteUrlEn.value = enUrl;
      
      if (enUrl === frUrl) {
        showNotification('Impossible de générer l\'URL EN automatiquement. Veuillez la saisir manuellement.', 'warning');
      } else {
        showNotification('URL EN générée!', 'success');
      }
    });
    
    // Écouteur pour copier l'URL FR vers l'URL EN
    elements.copyUrlFrBtn.addEventListener('click', () => {
      const frUrl = elements.siteUrlFr.value;
      if (!frUrl) {
        showNotification('Veuillez d\'abord saisir l\'URL FR.', 'error');
        return;
      }
      
      elements.siteUrlEn.value = frUrl;
      showNotification('URL FR copiée vers URL EN!', 'success');
    });
    
    // Écouteur pour le test d'URL FR
    elements.testUrlFrBtn.addEventListener('click', () => {
      const url = elements.siteUrlFr.value;
      const testTerm = elements.siteUrlTest.value;
      
      if (!testTerm) {
        showNotification(i18n.enterTestTerm || 'Veuillez entrer un terme de test.', 'error');
        return;
      }
      
      testSearchUrl(url, testTerm, 'fr');
    });
    
    // Écouteur pour le test d'URL EN
    elements.testUrlEnBtn.addEventListener('click', () => {
      const url = elements.siteUrlEn.value;
      const testTerm = elements.siteUrlTest.value;
      
      if (!testTerm) {
        showNotification(i18n.enterTestTerm || 'Veuillez entrer un terme de test.', 'error');
        return;
      }
      
      testSearchUrl(url, testTerm, 'en');
    });
    
    // Écouteur pour l'ajout de site
    elements.addSiteBtn.addEventListener('click', async () => {
      const category = elements.siteCategory.value;
      const name = elements.siteName.value;
      const urlFr = elements.siteUrlFr.value;
      const urlEn = elements.siteUrlEn.value;
      
      // Validation de base
      if (!name || !urlFr || !urlEn) {
        showNotification(i18n.fillAllFields || 'Veuillez remplir tous les champs.', 'error');
        return;
      }
      
      // Si nouvelle catégorie, demander le nom
      let finalCategory = category;
      if (category === 'new') {
        const newCategory = prompt(i18n.newCategoryPrompt || 'Nom de la nouvelle catégorie:');
        if (!newCategory) {
          return;
        }
        finalCategory = newCategory;
      }
      
      const added = await addUserSite(finalCategory, name, urlFr, urlEn);
      if (added) {
        // Réinitialiser le formulaire
        elements.siteName.value = '';
        elements.siteUrlFr.value = '';
        elements.siteUrlEn.value = '';
        elements.siteUrlTest.value = '';
        
        showNotification(i18n.siteAddedSuccess || 'Site ajouté avec succès!', 'success');
        
        // Si nouvelle catégorie, actualiser les listes déroulantes
        if (category === 'new') {
          populateCategoryDropdowns();
        }
      }
    });
    
    // Écouteur pour l'exportation des sites
    elements.exportBtn.addEventListener('click', () => {
      exportUserSites();
    });
    
    // Écouteur pour l'exportation des sites pour contribution
    elements.exportContribBtn.addEventListener('click', () => {
      exportUserSites(true);
    });
    
    // Écouteur pour l'importation des sites
    elements.importFile.addEventListener('change', (event) => {
      importUserSites(event.target.files[0]);
    });
    
    // Délégation d'événements pour les actions sur les sites
    elements.sitesContainer.addEventListener('click', async (event) => {
      const button = event.target.closest('button');
      if (!button) return;
      
      const siteItem = button.closest('.site-item');
      const { category, name, url, urlFr, urlEn, isDefault } = siteItem.dataset;
      
      // Test du site
      if (button.classList.contains('test-site-btn')) {
        const testTerm = prompt(i18n.enterSearchTerm || 'Entrez un terme de recherche pour tester ce site:');
        if (testTerm) {
          // Déterminer quelle URL tester (ancien ou nouveau format)
          if (urlFr && urlEn) {
            // Nouveau format bilingue
            const langChoice = prompt("Choisissez la langue à tester (fr/en):", "fr");
            if (langChoice && langChoice.toLowerCase() === 'fr') {
              testSearchUrl(urlFr, testTerm, 'fr');
            } else if (langChoice && langChoice.toLowerCase() === 'en') {
              testSearchUrl(urlEn, testTerm, 'en');
            }
          } else {
            // Ancien format avec une seule URL
            testSearchUrl(url, testTerm);
          }
        }
      }
      
      // Édition du site
      else if (button.classList.contains('edit-site-btn')) {
        // Remplir le formulaire d'ajout avec les données du site
        elements.siteCategory.value = category;
        elements.siteName.value = name;
        
        // Déterminer quelles URLs utiliser (ancien ou nouveau format)
        if (urlFr && urlEn) {
          // Nouveau format bilingue
          elements.siteUrlFr.value = urlFr;
          elements.siteUrlEn.value = urlEn;
        } else if (url) {
          // Ancien format avec une seule URL
          elements.siteUrlFr.value = url;
          elements.siteUrlEn.value = url;
        }
        
        // Faire défiler jusqu'au formulaire
        elements.addSiteBtn.scrollIntoView({ behavior: 'smooth' });
      }
      
      // Suppression du site
      else if (button.classList.contains('delete-site-btn')) {
        const confirmMessage = (i18n.confirmDelete || 'Êtes-vous sûr de vouloir supprimer le site "$1"?')
          .replace('$1', name);
        if (confirm(confirmMessage)) {
          const deleted = await deleteUserSite(category, name);
          if (deleted) {
            showNotification(i18n.siteDeletedSuccess || 'Site supprimé avec succès!', 'success');
          }
        }
      }
    });
}
  
// Fonction pour exporter les sites et les mots-clés personnalisés
function exportUserSites(forContribution = false) {
    // Préparer les données à exporter
    let dataToExport;
    
    if (forContribution) {
      // Pour contribution: format spécial pour faciliter l'intégration
      dataToExport = {
        sites: Object.entries(userSites).reduce((result, [category, sites]) => {
          if (sites.length > 0) {
            result[category] = sites;
          }
          return result;
        }, {}),
        keywords: Object.entries(userCategoryKeywords).reduce((result, [category, keywords]) => {
          // N'inclure que les catégories avec des mots-clés personnalisés
          if ((keywords.fr && keywords.fr.length > 0) || (keywords.en && keywords.en.length > 0)) {
            result[category] = keywords;
          }
          return result;
        }, {})
      };
    } else {
      // Export normal: tous les sites et mots-clés personnalisés
      dataToExport = {
        sites: userSites,
        keywords: userCategoryKeywords
      };
    }
    
    // Convertir en JSON bien formaté
    const jsonData = JSON.stringify(dataToExport, null, 2);
    
    // Créer un objet Blob
    const blob = new Blob([jsonData], { type: 'application/json' });
    
    // Créer une URL pour le Blob
    const url = URL.createObjectURL(blob);
    
    // Créer un lien pour télécharger le fichier
    const a = document.createElement('a');
    a.href = url;
    a.download = forContribution ? 'dansmazone-contribution.json' : 'dansmazone-sites.json';
    
    // Cliquer sur le lien pour télécharger
    document.body.appendChild(a);
    a.click();
    
    // Nettoyer
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification(i18n.exportSuccess || 'Export réussi!', 'success');
}
  
// Fonction modifiée pour importer à la fois les sites et les mots-clés
async function importUserSites(file) {
    if (!file) {
      return;
    }
    
    // Lire le fichier
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        
        // Vérifier la structure des données
        if (typeof importedData !== 'object') {
          throw new Error('Format de fichier invalide.');
        }
        
        // Si le format est celui de la nouvelle version (avec sites et keywords)
        if (importedData.sites && typeof importedData.sites === 'object') {
          // Traiter les sites
          Object.entries(importedData.sites).forEach(([category, sites]) => {
            if (!Array.isArray(sites)) {
              return;
            }
            
            // Créer la catégorie si elle n'existe pas
            if (!userSites[category]) {
              userSites[category] = [];
            }
            
            // Ajouter chaque site
            sites.forEach(site => {
              // Vérifier la structure du site
              if (!site.name || !site.url) {
                return;
              }
              
              // Vérifier si le site existe déjà
              const existingIndex = userSites[category].findIndex(s => s.name === site.name);
              
              if (existingIndex !== -1) {
                // Mettre à jour le site existant
                userSites[category][existingIndex] = site;
              } else {
                // Ajouter un nouveau site
                userSites[category].push(site);
              }
            });
          });
          
          // Traiter les mots-clés si présents
          if (importedData.keywords && typeof importedData.keywords === 'object') {
            Object.entries(importedData.keywords).forEach(([category, keywords]) => {
              // Créer la catégorie si elle n'existe pas
              if (!userCategoryKeywords[category]) {
                userCategoryKeywords[category] = {
                  fr: [],
                  en: []
                };
              }
              
              // Fusionner les mots-clés français
              if (keywords.fr && Array.isArray(keywords.fr)) {
                keywords.fr.forEach(keyword => {
                  if (!userCategoryKeywords[category].fr.includes(keyword)) {
                    userCategoryKeywords[category].fr.push(keyword);
                  }
                });
              }
              
              // Fusionner les mots-clés anglais
              if (keywords.en && Array.isArray(keywords.en)) {
                keywords.en.forEach(keyword => {
                  if (!userCategoryKeywords[category].en.includes(keyword)) {
                    userCategoryKeywords[category].en.push(keyword);
                  }
                });
              }
            });
          }
        } else {
          // Format ancien (juste des sites)
          Object.entries(importedData).forEach(([category, sites]) => {
            if (!Array.isArray(sites)) {
              return;
            }
            
            // Créer la catégorie si elle n'existe pas
            if (!userSites[category]) {
              userSites[category] = [];
            }
            
            // Ajouter chaque site
            sites.forEach(site => {
              // Vérifier la structure du site
              if (!site.name || !site.url) {
                return;
              }
              
              // Vérifier si le site existe déjà
              const existingIndex = userSites[category].findIndex(s => s.name === site.name);
              
              if (existingIndex !== -1) {
                // Mettre à jour le site existant
                userSites[category][existingIndex] = site;
              } else {
                // Ajouter un nouveau site
                userSites[category].push(site);
              }
            });
          });
        }
        
        // Sauvegarder les sites et les mots-clés
        const sitesSaved = await saveUserSites();
        const keywordsSaved = await saveUserKeywords();
        
        if (sitesSaved && keywordsSaved) {
          // Actualiser les listes déroulantes de catégories
          populateCategoryDropdowns();
          populateKeywordCategoryDropdown();
          
          // Actualiser l'affichage des sites
          renderSites();
          
          // Actualiser l'affichage des mots-clés si l'onglet est actif
          if (elements.keywordCategory.value) {
            renderKeywords(elements.keywordCategory.value);
          }
          
          showNotification(i18n.importSuccess || 'Import réussi!', 'success');
        }
      } catch (error) {
        console.error('Erreur lors de l\'import:', error);
        showNotification('Erreur lors de l\'import: ' + error.message, 'error');
      }
    };
    
    reader.readAsText(file);
}
  
// Fonction pour afficher une notification
function showNotification(message, type = 'success') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Ajouter au corps du document
    document.body.appendChild(notification);
    
    // Afficher la notification
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Masquer la notification après 3 secondes
    setTimeout(() => {
      notification.classList.remove('show');
      
      // Supprimer l'élément après l'animation
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
}

/**
 * Gère les erreurs de manière uniforme dans toute l'extension
 * @param {Error} error - L'erreur à gérer
 * @param {string} context - Le contexte dans lequel l'erreur s'est produite
 * @param {boolean} notify - Si true, montre une notification à l'utilisateur
 * @param {boolean} critical - Si true, considère l'erreur comme critique
 */
function handleError(error, context, notify = true, critical = false) {
    // Log l'erreur dans la console avec son contexte
    console.error(`DansMaZone - Erreur ${critical ? 'critique' : ''} dans ${context}:`, error);
    
    // Notification à l'utilisateur si demandé
    if (notify) {
      const message = critical 
        ? `Erreur critique: ${error.message || 'Erreur inconnue'}. Veuillez réessayer ou réinstaller l'extension.`
        : `Erreur: ${error.message || 'Une erreur est survenue'}`;
      showNotification(message, 'error');
    }
    
    // Pour les erreurs critiques, on peut envisager d'autres actions
    if (critical) {
      // Par exemple, désactiver certaines fonctionnalités
      // ou tenter une récupération automatique
    }
    
    // Renvoie l'erreur pour permettre un traitement supplémentaire si nécessaire
    return error;
}

function setupBugReporting() {
  // Créer le bouton de rapport de bug
  const bugReportBtn = document.createElement('button');
  bugReportBtn.textContent = i18n.reportBug || 'Signaler un problème';
  bugReportBtn.className = 'bug-report-btn';
  
  // Créer la structure du modal qui sera affiché
  const modal = document.createElement('div');
  modal.className = 'bug-report-modal';
  modal.style.display = 'none';
  
  modal.innerHTML = `
      <div class="bug-report-modal-content">
          <span class="close-modal">&times;</span>
          <h3>Signaler un problème</h3>
          <p>Pour signaler un problème avec l'extension DansMaZone, veuillez inclure les informations ci-dessous:</p>
          <div class="bug-report-info">
              <div id="diagnostic-info"></div>
              <textarea id="bug-description" rows="6" placeholder="Décrivez le problème rencontré..."></textarea>
          </div>
          <div class="bug-report-actions">
              <button id="copy-info-btn">Copier les informations</button>
              <div id="copy-success" style="display: none; color: green; margin-top: 10px;">Informations copiées dans le presse-papier!</div>
          </div>
          <div class="contact-info">
              <p>Veuillez envoyer ces informations à : <strong>ccosenza.dlab@gmail.com</strong></p>
          </div>
      </div>
  `;
  
  // Ajouter les éléments au DOM
  document.body.appendChild(modal);
  document.querySelector('footer').appendChild(bugReportBtn);
  
  // Récupérer les informations de diagnostic
  function getDiagnosticInfo() {
      return {
          version: browser.runtime.getManifest().version,
          browser: navigator.userAgent,
          storageSize: Object.keys(userSites).length
      };
  }
  
  // Fonction pour formater le texte du rapport
  function formatReportText(description = '') {
      const diagnosticInfo = getDiagnosticInfo();
      return `${description.trim() ? description + '\n\n' : ''}` +
             `-------- Informations de diagnostic --------\n` +
             `Version: ${diagnosticInfo.version}\n` +
             `Navigateur: ${diagnosticInfo.browser}\n` +
             `Sites personnalisés: ${diagnosticInfo.storageSize} catégories`;
  }
  
  // Afficher le modal avec les informations de diagnostic
  bugReportBtn.onclick = () => {
      const diagnosticInfo = getDiagnosticInfo();
      const diagInfoEl = document.getElementById('diagnostic-info');
      
      diagInfoEl.innerHTML = `
          <div><strong>Version:</strong> ${diagnosticInfo.version}</div>
          <div><strong>Navigateur:</strong> ${diagnosticInfo.browser}</div>
          <div><strong>Sites personnalisés:</strong> ${diagnosticInfo.storageSize} catégories</div>
      `;
      
      modal.style.display = 'block';
  };
  
  // Fermer le modal lorsque l'utilisateur clique sur la croix
  document.querySelector('.close-modal').onclick = () => {
      modal.style.display = 'none';
      document.getElementById('bug-description').value = '';
      document.getElementById('copy-success').style.display = 'none';
  };
  
  // Fermer le modal si l'utilisateur clique en dehors
  window.onclick = (event) => {
      if (event.target === modal) {
          modal.style.display = 'none';
          document.getElementById('bug-description').value = '';
          document.getElementById('copy-success').style.display = 'none';
      }
  };
  
  // Copier les informations dans le presse-papier
  document.getElementById('copy-info-btn').onclick = () => {
      const description = document.getElementById('bug-description').value;
      const reportText = formatReportText(description);
      
      // Utiliser l'API Clipboard pour copier le texte
      navigator.clipboard.writeText(reportText).then(() => {
          const copySuccess = document.getElementById('copy-success');
          copySuccess.style.display = 'block';
          
          // Masquer le message après 3 secondes
          setTimeout(() => {
              copySuccess.style.display = 'none';
          }, 3000);
      });
  };
  
  // Supprimé le code pour le bouton d'email
  
  // Ajouter du CSS pour le modal
  const style = document.createElement('style');
  style.textContent = `
      .bug-report-btn {
          background-color: var(--secondary-color);
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 4px;
          cursor: pointer;
          margin-left: 15px;
          transition: background-color 0.2s;
      }
      
      .bug-report-btn:hover {
          background-color: #344258;
      }
      
      .bug-report-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
      }
      
      .bug-report-modal-content {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          width: 80%;
          max-width: 600px;
          position: relative;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
      
      .close-modal {
          position: absolute;
          top: 10px;
          right: 15px;
          font-size: 24px;
          cursor: pointer;
          color: #888;
      }
      
      .close-modal:hover {
          color: #333;
      }
      
      .bug-report-info {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          margin: 15px 0;
      }
      
      #diagnostic-info {
          margin-bottom: 15px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 10px;
      }
      
      #bug-description {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          resize: vertical;
          font-family: inherit;
          box-sizing: border-box;
      }
      
      .bug-report-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
          flex-wrap: wrap;
      }
      
      .bug-report-actions button {
          padding: 8px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
      }
      
      #copy-info-btn {
          background-color: var(--secondary-color);
          color: white;
      }
      
      #copy-info-btn:hover {
          background-color: #344258;
      }
      
      #email-btn {
          background-color: var(--primary-color);
          color: white;
      }
      
      #email-btn:hover {
          background-color: var(--primary-dark);
      }
  `;
  
  document.head.appendChild(style);
}

// Ajouter les références DOM pour les éléments des mots-clés
elements.keywordCategory = document.getElementById('keyword-category');
elements.keywordInput = document.getElementById('keyword-input');
elements.keywordLanguage = document.getElementById('keyword-language');
elements.addKeywordsBtn = document.getElementById('add-keywords-btn');
elements.frKeywordsList = document.querySelector('.fr-keywords');
elements.enKeywordsList = document.querySelector('.en-keywords');

// Structure pour stocker les mots-clés personnalisés
let userCategoryKeywords = {};

// Structure pour stocker les mots-clés par défaut
let defaultCategoryKeywords = {};

// Chargement des mots-clés par défaut
function loadDefaultKeywords() {
    // Copier les mots-clés par défaut depuis category-classifier.js
    defaultCategoryKeywords = structuredClone(categoryKeywords);
}

// Chargement des mots-clés personnalisés
async function loadUserKeywords() {
    try {
        const result = await browser.storage.local.get('userCategoryKeywords');
        userCategoryKeywords = result.userCategoryKeywords || {};
        
        // S'assurer que toutes les catégories sont initialisées
        Object.keys(defaultCategoryKeywords).forEach(category => {
        if (!userCategoryKeywords[category]) {
            userCategoryKeywords[category] = {
            fr: [],
            en: []
            };
        }
        });
        
        // Aussi initialiser les catégories personnalisées
        Object.keys(userSites).forEach(category => {
        if (!userCategoryKeywords[category]) {
            userCategoryKeywords[category] = {
            fr: [],
            en: []
            };
        }
        });
        
        return true;
    } catch (error) {
        handleError(error, 'chargement des mots-clés personnalisés', true, false);
        
        // En cas d'erreur, initialiser avec un objet vide
        userCategoryKeywords = {};
        Object.keys(defaultCategoryKeywords).forEach(category => {
        userCategoryKeywords[category] = { fr: [], en: [] };
        });
        Object.keys(userSites).forEach(category => {
        userCategoryKeywords[category] = { fr: [], en: [] };
        });
        
        return false;
    }
}

// Sauvegarder les mots-clés personnalisés
async function saveUserKeywords() {
    try {
        await browser.storage.local.set({ userCategoryKeywords });
        return true;
    } catch (error) {
        handleError(error, 'sauvegarde des mots-clés personnalisés', true, false);
        return false;
    }
}

// Remplir la liste déroulante des catégories pour les mots-clés
function populateKeywordCategoryDropdown() {
    // Vider d'abord la liste
    elements.keywordCategory.innerHTML = '';

    // Obtenir toutes les catégories (par défaut + personnalisées)
    const categories = sortCategories([
        ...new Set([
        ...Object.keys(defaultCategoryKeywords),
        ...Object.keys(userSites)
        ])
    ]);

    // Ajouter chaque catégorie
    categories.forEach(category => {
        if (category !== 'default') {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        elements.keywordCategory.appendChild(option);
        }
    });
}

// Afficher les mots-clés pour une catégorie
function renderKeywords(category) {
    // Vider les listes
    elements.frKeywordsList.innerHTML = '';
    elements.enKeywordsList.innerHTML = '';
    
    // Obtenir les mots-clés par défaut
    const defaultFrKeywords = [];
    const defaultEnKeywords = [];
    
    if (defaultCategoryKeywords[category]) {
        // Dans le format actuel, les mots-clés français et anglais sont mélangés
        // avec des commentaires pour les séparer. Pour simplifier, nous supposons:
        // - Les premiers mots sont en français (jusqu'à la moitié)
        // - Les seconds sont en anglais
        const allKeywords = defaultCategoryKeywords[category];
        const midPoint = Math.floor(allKeywords.length / 2);
        
        for (let i = 0; i < allKeywords.length; i++) {
        if (i < midPoint) {
            defaultFrKeywords.push(allKeywords[i]);
        } else {
            defaultEnKeywords.push(allKeywords[i]);
        }
        }
    }
    
    // Obtenir les mots-clés personnalisés
    const userFrKeywords = userCategoryKeywords[category]?.fr || [];
    const userEnKeywords = userCategoryKeywords[category]?.en || [];
    
    // Afficher les mots-clés français
    [...defaultFrKeywords, ...userFrKeywords].forEach(keyword => {
        const tag = document.createElement('div');
        tag.className = 'keyword-tag';
        tag.textContent = keyword;
        
        // Si c'est un mot-clé personnalisé, ajouter un bouton de suppression
        if (userFrKeywords.includes(keyword)) {
        const removeBtn = document.createElement('span');
        removeBtn.className = 'remove-keyword';
        removeBtn.textContent = '×';
        removeBtn.dataset.keyword = keyword;
        removeBtn.dataset.language = 'fr';
        
        tag.appendChild(removeBtn);
        } else {
        tag.classList.add('default-keyword');
        }
        
        elements.frKeywordsList.appendChild(tag);
    });
    
    // Afficher les mots-clés anglais
    [...defaultEnKeywords, ...userEnKeywords].forEach(keyword => {
        const tag = document.createElement('div');
        tag.className = 'keyword-tag';
        tag.textContent = keyword;
        
        // Si c'est un mot-clé personnalisé, ajouter un bouton de suppression
        if (userEnKeywords.includes(keyword)) {
        const removeBtn = document.createElement('span');
        removeBtn.className = 'remove-keyword';
        removeBtn.textContent = '×';
        removeBtn.dataset.keyword = keyword;
        removeBtn.dataset.language = 'en';
        
        tag.appendChild(removeBtn);
        } else {
        tag.classList.add('default-keyword');
        }
        
        elements.enKeywordsList.appendChild(tag);
    });
}

// Ajouter des mots-clés à une catégorie
async function addKeywords(category, keywordsText, language) {
    // S'assurer que la catégorie existe
    if (!userCategoryKeywords[category]) {
        userCategoryKeywords[category] = {
        fr: [],
        en: []
        };
    }

    // Séparer les mots-clés par virgule et nettoyer
    const keywords = keywordsText.split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);

    if (keywords.length === 0) {
        showNotification(i18n.enterValidKeyword || 'Veuillez entrer au moins un mot-clé valide.', 'error');
        return false;
    }

    // Ajouter chaque mot-clé s'il n'existe pas déjà
    let added = 0;
    keywords.forEach(keyword => {
        if (!userCategoryKeywords[category][language].includes(keyword)) {
        userCategoryKeywords[category][language].push(keyword);
        added++;
        }
    });

    // Sauvegarder et rafraîchir l'affichage
    const saved = await saveUserKeywords();
    if (saved) {
        renderKeywords(category);
        return true;
    }

    return false;
}

// Supprimer un mot-clé
async function removeKeyword(category, keyword, language) {
    // Vérifier si la catégorie existe
    if (!userCategoryKeywords[category]) {
        return false;
    }

    // Trouver l'index du mot-clé
    const keywordIndex = userCategoryKeywords[category][language].indexOf(keyword);
    if (keywordIndex === -1) {
        return false;
    }

    // Supprimer le mot-clé
    userCategoryKeywords[category][language].splice(keywordIndex, 1);

    // Sauvegarder et rafraîchir l'affichage
    const saved = await saveUserKeywords();
    if (saved) {
        renderKeywords(category);
        return true;
    }

    return false;
}

// Initialiser la fonctionnalité de mots-clés
async function initKeywordsFeature() {
    // Charger les mots-clés par défaut
    loadDefaultKeywords();

    // Charger les mots-clés personnalisés
    await loadUserKeywords();

    // Remplir la liste déroulante des catégories
    populateKeywordCategoryDropdown();

    // Afficher les mots-clés pour la première catégorie
    if (elements.keywordCategory.options.length > 0) {
        renderKeywords(elements.keywordCategory.value);
    }

    // Ajouter les écouteurs d'événements
    attachKeywordEventListeners();
}

// Attacher les écouteurs d'événements pour les mots-clés
function attachKeywordEventListeners() {
    // Changement de catégorie
    elements.keywordCategory.addEventListener('change', () => {
        renderKeywords(elements.keywordCategory.value);
    });

    // Ajout de mots-clés
    elements.addKeywordsBtn.addEventListener('click', async () => {
        const category = elements.keywordCategory.value;
        const keywordsText = elements.keywordInput.value;
        const language = elements.keywordLanguage.value;
        
        const added = await addKeywords(category, keywordsText, language);
        if (added) {
        // Réinitialiser l'input
        elements.keywordInput.value = '';
        showNotification(i18n.keywordsAddedSuccess || 'Mots-clés ajoutés avec succès!', 'success');
        }
    });

    // Suppression de mots-clés (délégation d'événements)
    document.querySelectorAll('.keyword-list').forEach(list => {
        list.addEventListener('click', async (event) => {
            const removeBtn = event.target.closest('.remove-keyword');
            if (!removeBtn) return;
            
            const { keyword, language } = removeBtn.dataset;
            const category = elements.keywordCategory.value;
            
            const removed = await removeKeyword(category, keyword, language);
            if (removed) {
                showNotification(i18n.keywordDeletedSuccess || 'Mot-clé supprimé avec succès!', 'success');
            }
            });
        });
}
 
// Initialiser la page
document.addEventListener('DOMContentLoaded', initOptions);