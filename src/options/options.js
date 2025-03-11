import browser from 'webextension-polyfill';
import { categorySites } from '../datas/category-sites.js';
import { categoryMapping } from '../datas/category-classifier.js';

// Stocker les références aux éléments du DOM
const elements = {
  tabs: document.querySelectorAll('.tab-btn'),
  tabContents: document.querySelectorAll('.tab-content'),
  siteSearch: document.getElementById('site-search'),
  categoryFilter: document.getElementById('category-filter'),
  sitesContainer: document.querySelector('.sites-container'),
  siteCategory: document.getElementById('site-category'),
  siteName: document.getElementById('site-name'),
  siteUrl: document.getElementById('site-url'),
  siteUrlTest: document.getElementById('site-url-test'),
  testUrlBtn: document.getElementById('test-url-btn'),
  addSiteBtn: document.getElementById('add-site-btn'),
  exportBtn: document.getElementById('export-btn'),
  exportContribBtn: document.getElementById('export-contrib-btn'),
  importFile: document.getElementById('import-file'),
  versionElement: document.getElementById('version')
};

// Structure de données pour stocker les sites personnalisés
let userSites = {};
// Stockage des sites par défaut de l'extension
let defaultSites = {};

// Initialisation de la page
async function initOptions() {
  // Afficher la version de l'extension
  const manifestData = browser.runtime.getManifest();
  elements.versionElement.textContent = manifestData.version;

  // Initialiser les onglets
  initTabs();
  
  // Cloner les sites par défaut
  defaultSites = structuredClone(categorySites);
  
  // Charger les sites personnalisés depuis le stockage
  await loadUserSites();
  
  // Remplir les listes déroulantes de catégories
  populateCategoryDropdowns();
  
  // Afficher les sites
  renderSites();
  
  // Ajouter les écouteurs d'événements
  attachEventListeners();
}

// Initialiser les onglets
function initTabs() {
  elements.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Supprimer la classe active de tous les onglets
      elements.tabs.forEach(t => t.classList.remove('active'));
      elements.tabContents.forEach(c => c.classList.remove('active'));
      
      // Ajouter la classe active à l'onglet cliqué
      tab.classList.add('active');
      
      // Afficher le contenu de l'onglet
      const tabId = tab.dataset.tab;
      document.getElementById(tabId).classList.add('active');
    });
  });
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
  } catch (error) {
    console.error('Erreur lors du chargement des sites personnalisés:', error);
    showNotification('Erreur lors du chargement des sites personnalisés.', 'error');
    userSites = {};
  }
}

// Sauvegarder les sites personnalisés dans le stockage
async function saveUserSites() {
  try {
    await browser.storage.local.set({ userSites });
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des sites personnalisés:', error);
    showNotification('Erreur lors de la sauvegarde des sites personnalisés.', 'error');
    return false;
  }
}

// Remplir les listes déroulantes de catégories
function populateCategoryDropdowns() {
  // Obtenir toutes les catégories (par défaut + personnalisées)
  const categories = [...new Set([
    ...Object.keys(defaultSites),
    ...Object.keys(userSites)
  ])].sort();
  
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
  newCategoryOption.textContent = '+ Nouvelle catégorie';
  elements.siteCategory.appendChild(newCategoryOption);
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
  let categories = [...new Set([
    ...Object.keys(defaultSites),
    ...Object.keys(userSites)
  ])].sort();
  
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
      allSites = allSites.filter(site => 
        site.name.toLowerCase().includes(searchTerm) || 
        site.url.toLowerCase().includes(searchTerm)
      );
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
      
      siteItem.innerHTML = `
        <div class="site-info">
          <div class="site-name">${site.name}</div>
          <div class="site-url">${site.url}</div>
        </div>
        <div class="site-actions">
          <button class="test-site-btn" title="Tester">🔍</button>
          ${!site.isDefault ? `<button class="edit-site-btn" title="Modifier">✏️</button>` : ''}
          ${!site.isDefault ? `<button class="delete-site-btn" title="Supprimer">🗑️</button>` : ''}
        </div>
      `;
      
      // Ajouter les données du site à l'élément
      siteItem.dataset.category = category;
      siteItem.dataset.name = site.name;
      siteItem.dataset.url = site.url;
      siteItem.dataset.isDefault = site.isDefault;
      
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
function testSearchUrl(url, testTerm) {
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
}

// Ajouter un site personnalisé
async function addUserSite(category, name, url) {
  // Valider l'URL
  const validation = validateSearchUrl(url);
  if (!validation.valid) {
    showNotification(validation.message, 'error');
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
      url,
      icon: 'icon-dansmazone.png' // Icône par défaut
    };
  } else {
    // Ajouter un nouveau site
    userSites[category].push({
      name,
      url,
      icon: 'icon-dansmazone.png' // Icône par défaut
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
    
    // Écouteur pour le test d'URL
    elements.testUrlBtn.addEventListener('click', () => {
      const url = elements.siteUrl.value;
      const testTerm = elements.siteUrlTest.value;
      
      if (!testTerm) {
        showNotification('Veuillez entrer un terme de test.', 'error');
        return;
      }
      
      testSearchUrl(url, testTerm);
    });
    
    // Écouteur pour l'ajout de site
    elements.addSiteBtn.addEventListener('click', async () => {
      const category = elements.siteCategory.value;
      const name = elements.siteName.value;
      const url = elements.siteUrl.value;
      
      // Validation de base
      if (!name || !url) {
        showNotification('Veuillez remplir tous les champs.', 'error');
        return;
      }
      
      // Si nouvelle catégorie, demander le nom
      let finalCategory = category;
      if (category === 'new') {
        const newCategory = prompt('Nom de la nouvelle catégorie:');
        if (!newCategory) {
          return;
        }
        finalCategory = newCategory;
      }
      
      const added = await addUserSite(finalCategory, name, url);
      if (added) {
        // Réinitialiser le formulaire
        elements.siteName.value = '';
        elements.siteUrl.value = '';
        elements.siteUrlTest.value = '';
        
        showNotification('Site ajouté avec succès!', 'success');
        
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
      const { category, name, url, isDefault } = siteItem.dataset;
      
      // Test du site
      if (button.classList.contains('test-site-btn')) {
        const testTerm = prompt('Entrez un terme de recherche pour tester ce site:');
        if (testTerm) {
          testSearchUrl(url, testTerm);
        }
      }
      
      // Édition du site
      else if (button.classList.contains('edit-site-btn')) {
        // Remplir le formulaire d'ajout avec les données du site
        elements.siteCategory.value = category;
        elements.siteName.value = name;
        elements.siteUrl.value = url;
        
        // Faire défiler jusqu'au formulaire
        elements.addSiteBtn.scrollIntoView({ behavior: 'smooth' });
      }
      
      // Suppression du site
      else if (button.classList.contains('delete-site-btn')) {
        if (confirm(`Êtes-vous sûr de vouloir supprimer le site "${name}"?`)) {
          const deleted = await deleteUserSite(category, name);
          if (deleted) {
            showNotification('Site supprimé avec succès!', 'success');
          }
        }
      }
    });
  }
  
  // Fonction pour exporter les sites personnalisés
  function exportUserSites(forContribution = false) {
    // Préparer les données à exporter
    let dataToExport;
    
    if (forContribution) {
      // Pour contribution: format spécial pour faciliter l'intégration
      dataToExport = Object.entries(userSites).reduce((result, [category, sites]) => {
        if (sites.length > 0) {
          result[category] = sites;
        }
        return result;
      }, {});
    } else {
      // Export normal: tous les sites personnalisés
      dataToExport = userSites;
    }
    
    // Convertir en JSON
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
    
    showNotification('Export réussi!', 'success');
  }
  
  // Fonction pour importer des sites personnalisés
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
        
        // Fusionner avec les sites existants
        Object.entries(importedData).forEach(([category, sites]) => {
          if (!Array.isArray(sites)) {
            return;
          }
          
          // Créer la catégorie si elle n'existe pas
          if (!userSites[category]) {
            userSites[category] = [];
          }
          
          // Ajouter chaque site, en vérifiant les doublons
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
        
        // Sauvegarder et rafraîchir l'affichage
        const saved = await saveUserSites();
        if (saved) {
          // Actualiser les listes déroulantes de catégories
          populateCategoryDropdowns();
          
          // Actualiser l'affichage des sites
          renderSites();
          
          showNotification('Import réussi!', 'success');
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
  
  // Initialiser la page
  document.addEventListener('DOMContentLoaded', initOptions);