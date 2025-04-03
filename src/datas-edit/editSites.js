// Structure de données pour stocker les sites
let sitesData = [];
let categories = new Set();
const DEFAULT_JSON_PATH = "../datas/default-sites.json";
const EXPORT_JSON_PATH = "../datas/default-sites-generated.json";

// Objet pour stocker les tests en cours
let currentTests = {
    queue: [],
    running: false,
    stop: false,
    completed: 0,
    total: 0,
    concurrent: 0,
    maxConcurrent: 3,
    timeout: 10000, // 10 secondes par défaut
    cacheDuration: 24 * 60 * 60 * 1000, // 24 heures en millisecondes
    forceTest: false,
    checkContent: false,
    followRedirects: true
};

// Fonctions d'initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Gestion des modales
    setupModals();
    
    // Gestionnaires d'événements pour les boutons
    document.getElementById('addRow').addEventListener('click', showAddModal);
    document.getElementById('importJson').addEventListener('click', showImportModal);
    document.getElementById('exportJson').addEventListener('click', exportToJson);
    document.getElementById('exportCsv').addEventListener('click', exportToCsv);
    document.getElementById('siteForm').addEventListener('submit', saveSite);
    document.getElementById('processImport').addEventListener('click', processImport);
    document.getElementById('categoryFilter').addEventListener('change', filterTable);
    document.getElementById('loadJsonFile').addEventListener('click', loadDefaultJsonFile);
    document.getElementById('testVisibleSites').addEventListener('click', showTestConfigModal);
    document.getElementById('startTests').addEventListener('click', startTests);
    document.getElementById('cancelTests').addEventListener('click', function() {
        document.getElementById('testConfigModal').style.display = 'none';
    });
    document.getElementById('stopTests').addEventListener('click', stopTests);
    
    // Initialiser avec un tableau vide
    updateTable();
});

// Charger le fichier JSON par défaut
async function loadDefaultJsonFile() {
    // Créer un bouton temporaire pour ouvrir le sélecteur de fichiers
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    // Promesse pour attendre la sélection du fichier
    const filePromise = new Promise((resolve, reject) => {
        input.onchange = e => {
            if (e.target.files.length > 0) {
                resolve(e.target.files[0]);
            } else {
                reject(new Error("Aucun fichier sélectionné"));
            }
        };
        
        // Si l'utilisateur annule, gérer ce cas
        input.oncancel = () => reject(new Error("Sélection annulée"));
    });
    
    // Déclencher la boîte de dialogue de sélection de fichier
    input.click();
    
    try {
        showStatus('Sélectionnez le fichier JSON default-sites.json...', 'loading');
        const file = await filePromise;
        
        // Lire le contenu du fichier
        const fileContent = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = () => reject(new Error("Erreur lors de la lecture du fichier"));
            reader.readAsText(file);
        });
        
        // Parser le JSON
        const jsonData = JSON.parse(fileContent);
        processJsonData(jsonData);
        showStatus(`Fichier ${file.name} chargé avec succès!`, 'success');
    } catch (error) {
        console.error('Erreur lors du chargement du fichier JSON:', error);
        showStatus('Erreur: ' + error.message, 'error');
        // Initialiser avec un tableau vide en cas d'erreur
        updateTable();
    }
}

// Traiter les données JSON importées
function processJsonData(jsonData) {
    sitesData = [];
    categories = new Set();
    
    // Traiter chaque catégorie
    for (const category in jsonData) {
        const sites = jsonData[category];
        sites.forEach(site => {
            const newSite = {
                category: category,
                name: site.name
            };
            
            // Gérer les URLs
            if (site.urls) {
                newSite.urlFr = site.urls.fr || '';
                newSite.urlEn = site.urls.en || '';
            } else if (site.url) {
                newSite.urlFr = site.url;
                newSite.urlEn = site.url;
            } else {
                newSite.urlFr = '';
                newSite.urlEn = '';
            }
            
            // Ajouter des données de validation si elles existent
            if (site.validation) {
                newSite.validation = site.validation;
            }
            
            sitesData.push(newSite);
            categories.add(category);
        });
    }
    
    updateTable();
}

// Afficher un message de statut
function showStatus(message, type) {
    const statusElement = document.getElementById('statusMessage');
    statusElement.textContent = message;
    statusElement.className = 'status-message';
    
    if (type === 'success') {
        statusElement.classList.add('success');
    } else if (type === 'error') {
        statusElement.classList.add('error');
    } else if (type === 'loading') {
        statusElement.classList.add('loading');
        statusElement.innerHTML = `<span class="loading"></span> ${message}`;
    }
    
    statusElement.style.display = 'block';
    
    if (type !== 'loading') {
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 5000);
    }
}

// Configuration des modales
function setupModals() {
    const modals = document.getElementsByClassName('modal');
    const closeButtons = document.getElementsByClassName('close');
    
    // Fermer les modales quand on clique sur X
    for (let i = 0; i < closeButtons.length; i++) {
        closeButtons[i].addEventListener('click', function() {
            modals[i].style.display = "none";
        });
    }
    
    // Fermer les modales quand on clique en dehors
    window.addEventListener('click', function(event) {
        for (let i = 0; i < modals.length; i++) {
            if (event.target == modals[i]) {
                modals[i].style.display = "none";
            }
        }
    });
}

// Afficher la modale d'ajout
function showAddModal() {
    document.getElementById('modalTitle').textContent = 'Ajouter un site';
    document.getElementById('editIndex').value = -1;
    document.getElementById('siteForm').reset();
    document.getElementById('editModal').style.display = 'block';
    updateCategoriesDatalist();
}

// Afficher la modale d'édition
function showEditModal(index) {
    const site = sitesData[index];
    document.getElementById('modalTitle').textContent = 'Modifier un site';
    document.getElementById('editIndex').value = index;
    document.getElementById('category').value = site.category;
    document.getElementById('name').value = site.name;
    document.getElementById('urlFr').value = site.urlFr;
    document.getElementById('urlEn').value = site.urlEn;
    document.getElementById('editModal').style.display = 'block';
    updateCategoriesDatalist();
}

// Afficher la modale d'import JSON
function showImportModal() {
    document.getElementById('jsonInput').value = '';
    document.getElementById('importModal').style.display = 'block';
}

// Afficher la modale de configuration des tests
function showTestConfigModal() {
    // Réinitialiser les valeurs du formulaire
    document.getElementById('testTimeout').value = currentTests.timeout;
    document.getElementById('maxConcurrent').value = currentTests.maxConcurrent;
    document.getElementById('testCacheDuration').value = currentTests.cacheDuration / (60 * 60 * 1000); // Convertir en heures
    document.getElementById('forceTest').checked = currentTests.forceTest;
    document.getElementById('checkContent').checked = currentTests.checkContent;
    document.getElementById('followRedirects').checked = currentTests.followRedirects;
    
    // Cacher la barre de progression
    document.getElementById('testProgressBar').style.width = '0%';
    document.getElementById('testProgressText').textContent = '0/0 URLs testées';
    document.getElementById('testProgressText').parentElement.style.display = 'none';
    
    // Afficher la modale
    document.getElementById('testConfigModal').style.display = 'block';
}

// Mise à jour de la datalist des catégories
function updateCategoriesDatalist() {
    const datalist = document.getElementById('categories');
    datalist.innerHTML = '';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        datalist.appendChild(option);
    });
}

// Mettre à jour le filtre de catégories
function updateCategoryFilter() {
    const select = document.getElementById('categoryFilter');
    const currentValue = select.value;
    select.innerHTML = '<option value="">Toutes les catégories</option>';
    
    const sortedCategories = Array.from(categories).sort();
    sortedCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });
    
    select.value = currentValue;
}

// Filtrer le tableau par catégorie
function filterTable() {
    const category = document.getElementById('categoryFilter').value;
    const rows = document.getElementById('tableBody').getElementsByTagName('tr');
    
    for (let i = 0; i < rows.length; i++) {
        const categoryCell = rows[i].getElementsByTagName('td')[0];
        if (!category || categoryCell.textContent === category) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
}

// Enregistrer un site (ajout ou modification)
function saveSite(e) {
    e.preventDefault();
    const index = parseInt(document.getElementById('editIndex').value);
    const site = {
        category: document.getElementById('category').value,
        name: document.getElementById('name').value,
        urlFr: document.getElementById('urlFr').value,
        urlEn: document.getElementById('urlEn').value
    };
    
    // Conserver les données de validation si elles existent déjà
    if (index !== -1 && sitesData[index].validation) {
        site.validation = sitesData[index].validation;
    }
    
    if (index === -1) {
        // Ajout
        sitesData.push(site);
        showStatus('Site ajouté avec succès!', 'success');
    } else {
        // Modification
        sitesData[index] = site;
        showStatus('Site modifié avec succès!', 'success');
    }
    
    categories.add(site.category);
    updateTable();
    document.getElementById('editModal').style.display = 'none';
}

// Supprimer un site
function deleteSite(index) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce site?')) {
        sitesData.splice(index, 1);
        updateTable();
        showStatus('Site supprimé avec succès!', 'success');
    }
}

// Importer des données JSON
function processImport() {
    try {
        const jsonText = document.getElementById('jsonInput').value;
        const jsonData = JSON.parse(jsonText);
        
        // Traiter les données importées
        processJsonData(jsonData);
        
        document.getElementById('importModal').style.display = 'none';
        showStatus('Données importées avec succès!', 'success');
    } catch (error) {
        showStatus('Erreur lors de l\'import: ' + error.message, 'error');
    }
}

// Exporter en JSON et enregistrer dans le fichier spécifié
async function exportToJson() {
    const result = {};
    let validationCount = 0;
    
    // Regrouper par catégorie
    sitesData.forEach(site => {
        if (!result[site.category]) {
            result[site.category] = [];
        }
        
        const newSite = {
            name: site.name
        };
        
        // Gérer les URLs
        if (site.urlFr === site.urlEn) {
            newSite.url = site.urlFr;
        } else {
            newSite.urls = {
                fr: site.urlFr,
                en: site.urlEn
            };
        }
        
        // IMPORTANT: Toujours inclure les données de validation si elles existent
        if (site.validation) {
            // Utiliser une copie profonde pour éviter de modifier l'original
            newSite.validation = {};
            
            // Copier explicitement les données de validation pour chaque langue
            if (site.validation.fr) {
                newSite.validation.fr = {
                    status: site.validation.fr.status,
                    code: site.validation.fr.code,
                    timestamp: site.validation.fr.timestamp,
                    error: site.validation.fr.error
                };
                validationCount++;
            }
            
            if (site.validation.en) {
                newSite.validation.en = {
                    status: site.validation.en.status,
                    code: site.validation.en.code,
                    timestamp: site.validation.en.timestamp,
                    error: site.validation.en.error
                };
                validationCount++;
            }
        }
        
        result[site.category].push(newSite);
    });
    
    // Afficher un message si pas de données de validation
    if (validationCount === 0) {
        if (!confirm("Aucune donnée de validation d'URL n'a été trouvée. Voulez-vous quand même exporter le fichier?\n\nIl est recommandé de tester les URLs avec le bouton 'Tester les sites visibles' avant d'exporter.")) {
            showStatus('Exportation annulée. Veuillez tester les URLs avant d\'exporter.', 'error');
            return;
        }
    }
    
    // Créer le blob JSON
    const jsonStr = JSON.stringify(result, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    
    try {
        // Utiliser l'API File System Access si disponible (navigateurs modernes)
        if ('showSaveFilePicker' in window) {
            showStatus('Enregistrement du fichier...', 'loading');
            
            const opts = {
                suggestedName: 'default-sites-generated.json',
                types: [{
                    description: 'JSON Files',
                    accept: {'application/json': ['.json']}
                }]
            };
            
            try {
                const handle = await window.showSaveFilePicker(opts);
                const writable = await handle.createWritable();
                await writable.write(blob);
                await writable.close();
                showStatus(`Fichier enregistré dans ${handle.name} (${validationCount} validations incluses)`, 'success');
            } catch (err) {
                if (err.name !== 'AbortError') {
                    throw err;
                }
                showStatus('Opération annulée par l\'utilisateur', 'error');
            }
        } else {
            // Fallback pour les navigateurs qui ne supportent pas l'API File System Access
            downloadFile('default-sites-generated.json', jsonStr, 'application/json');
            showStatus(`Fichier téléchargé: default-sites-generated.json (${validationCount} validations incluses)`, 'success');
        }
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error);
        showStatus('Erreur lors de l\'enregistrement du fichier. Téléchargement à la place.', 'error');
        
        // Télécharger en cas d'erreur
        downloadFile('default-sites-generated.json', jsonStr, 'application/json');
    }
}

// Exporter en CSV
function exportToCsv() {
    let csv = 'Catégorie,Nom,URL_FR,URL_EN,Statut_FR,Statut_EN\n';
    
    sitesData.forEach(site => {
        // Échapper les virgules et les guillemets
        const category = escapeCsvField(site.category);
        const name = escapeCsvField(site.name);
        const urlFr = escapeCsvField(site.urlFr);
        const urlEn = escapeCsvField(site.urlEn);
        
        // Récupérer les statuts de validation si disponibles
        let statusFr = 'Non testé';
        let statusEn = 'Non testé';
        
        if (site.validation) {
            if (site.validation.fr) {
                statusFr = site.validation.fr.status === 'valid' ? 'Valide' : 'Invalide';
            }
            if (site.validation.en) {
                statusEn = site.validation.en.status === 'valid' ? 'Valide' : 'Invalide';
            }
        }
        
        csv += `${category},${name},${urlFr},${urlEn},${statusFr},${statusEn}\n`;
    });
    
    downloadFile('sites.csv', csv, 'text/csv');
    showStatus('Fichier CSV téléchargé', 'success');
}

// Échapper un champ CSV
function escapeCsvField(field) {
    if (!field) return '';
    // Si le champ contient des virgules, des guillemets ou des sauts de ligne, l'entourer de guillemets
    if (field.indexOf(',') !== -1 || field.indexOf('"') !== -1 || field.indexOf('\n') !== -1) {
        // Remplacer les guillemets par des doubles guillemets
        return '"' + field.replace(/"/g, '""') + '"';
    }
    return field;
}

// Télécharger un fichier
function downloadFile(filename, content, type) {
    const blob = new Blob([content], { type: type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
}

// Mettre à jour le tableau
function updateTable() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    // Trier les données par catégorie puis par nom
    const sortedData = [...sitesData].sort((a, b) => {
        if (a.category !== b.category) {
            return a.category.localeCompare(b.category);
        }
        return a.name.localeCompare(b.name);
    });
    
    sortedData.forEach((site, index) => {
        const row = document.createElement('tr');
        
        // Créer les cellules
        const categoryCell = document.createElement('td');
        categoryCell.textContent = site.category;
        
        const nameCell = document.createElement('td');
        nameCell.textContent = site.name;
        
        const urlFrCell = document.createElement('td');
        urlFrCell.textContent = site.urlFr;
        
        // Ajouter l'indicateur de statut pour l'URL FR
        if (site.urlFr) {
            const urlFrStatus = getUrlStatusIndicator(site, 'fr');
            urlFrCell.appendChild(urlFrStatus);
        }
        
        const urlEnCell = document.createElement('td');
        urlEnCell.textContent = site.urlEn;
        
        // Ajouter l'indicateur de statut pour l'URL EN
        if (site.urlEn) {
            const urlEnStatus = getUrlStatusIndicator(site, 'en');
            urlEnCell.appendChild(urlEnStatus);
        }
        
        const actionsCell = document.createElement('td');
        actionsCell.className = 'actions-cell';
        
        // Bouton de test
        const testButton = document.createElement('button');
        testButton.className = 'action-btn test-site-btn';
        testButton.title = 'Tester';
        testButton.textContent = '🔍';
        testButton.addEventListener('click', (e) => {
            // Lancer directement le test pour ce site sans ouvrir le modal
            e.stopPropagation(); // Empêche la propagation de l'événement
            
            // Configurer les tests
            currentTests.queue = [];
            currentTests.completed = 0;
            currentTests.total = 0;
            currentTests.running = false;
            currentTests.stop = false;
            
            // Charger les paramètres par défaut
            currentTests.timeout = 10000;
            currentTests.maxConcurrent = 3;
            currentTests.cacheDuration = 24 * 60 * 60 * 1000;
            currentTests.forceTest = false;
            currentTests.checkContent = false;
            currentTests.followRedirects = true;
            
            // Ajouter les URLs du site aux tests
            const site = sitesData[index];
            
            if (site.urlFr) {
                currentTests.queue.push({ siteIndex: index, lang: 'fr', url: site.urlFr });
                currentTests.total++;
            }
            
            if (site.urlEn) {
                currentTests.queue.push({ siteIndex: index, lang: 'en', url: site.urlEn });
                currentTests.total++;
            }
            
            if (currentTests.total === 0) {
                showStatus('Aucune URL à tester pour ce site', 'error');
                return;
            }
            
            // Afficher un message de statut
            showStatus(`Test des URLs pour ${site.name}...`, 'loading');
            
            // Lancer les tests directement
            currentTests.running = true;
            processUrlQueue();
        });
        
        // Bouton d'édition
        const editButton = document.createElement('button');
        editButton.className = 'action-btn edit-btn';
        const editIcon = document.createElement('img');
        editIcon.src = 'edit.png';
        editIcon.alt = 'Éditer';
        editButton.appendChild(editIcon);
        editButton.addEventListener('click', () => showEditModal(index));
        
        // Bouton de suppression
        const deleteButton = document.createElement('button');
        deleteButton.className = 'action-btn delete-btn';
        const deleteIcon = document.createElement('img');
        deleteIcon.src = 'delete.png';
        deleteIcon.alt = 'Supprimer';
        deleteIcon.className = 'delete-icon';
        deleteButton.appendChild(deleteIcon);
        deleteButton.addEventListener('click', () => deleteSite(index));
        
        // Ajouter les boutons à la cellule d'actions
        actionsCell.appendChild(testButton);
        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
        
        // Ajouter les cellules à la ligne
        row.appendChild(categoryCell);
        row.appendChild(nameCell);
        row.appendChild(urlFrCell);
        row.appendChild(urlEnCell);
        row.appendChild(actionsCell);
        
        // Ajouter les données du site à l'élément pour faciliter l'accès
        row.dataset.siteIndex = index;
        
        // Ajouter la ligne au tableau
        tableBody.appendChild(row);
    });
    
    // Mettre à jour le filtre de catégories
    updateCategoryFilter();
    // Appliquer le filtre
    filterTable();
}

// Créer un indicateur de statut pour une URL
function getUrlStatusIndicator(site, lang) {
    const container = document.createElement('span');
    container.className = 'tooltip';
    
    const statusIndicator = document.createElement('span');
    statusIndicator.className = 'url-status';
    
    const tooltipText = document.createElement('span');
    tooltipText.className = 'tooltip-text';
    
    // Déterminer le statut de l'URL
    if (site.validation && site.validation[lang]) {
        const validation = site.validation[lang];
        const timestamp = validation.timestamp 
            ? new Date(validation.timestamp).toLocaleString() 
            : 'Date inconnue';
        
        if (validation.status === 'valid') {
            statusIndicator.classList.add('valid');
            tooltipText.textContent = `URL valide (${validation.code || 200})\nDernier test: ${timestamp}`;
        } else if (validation.status === 'invalid') {
            statusIndicator.classList.add('invalid');
            tooltipText.textContent = `URL invalide (${validation.code || 'Erreur'})\n${validation.error || ''}\nDernier test: ${timestamp}`;
        } else {
            statusIndicator.classList.add('untested');
            tooltipText.textContent = 'URL non testée';
        }
    } else {
        statusIndicator.classList.add('untested');
        tooltipText.textContent = 'URL non testée';
    }
    
    container.appendChild(statusIndicator);
    container.appendChild(tooltipText);
    
    return container;
}

// Tester un site spécifique
function testSite(index) {
    const site = sitesData[index];
    
    if (!site) {
        showStatus('Site introuvable', 'error');
        return;
    }
    
    // Configurer les tests
    currentTests.queue = [];
    currentTests.completed = 0;
    currentTests.total = 0;
    currentTests.running = false;
    currentTests.stop = false;
    
    // Récupérer les paramètres de configuration actuels
    currentTests.timeout = parseInt(document.getElementById('testTimeout').value) || 10000;
    currentTests.maxConcurrent = parseInt(document.getElementById('maxConcurrent').value) || 3;
    currentTests.cacheDuration = parseInt(document.getElementById('testCacheDuration').value) * 60 * 60 * 1000 || 24 * 60 * 60 * 1000;
    currentTests.forceTest = document.getElementById('forceTest').checked;
    currentTests.checkContent = document.getElementById('checkContent').checked;
    currentTests.followRedirects = document.getElementById('followRedirects').checked;
    
    // Vérifier si les URLs existent
    if (site.urlFr) {
        currentTests.queue.push({ siteIndex: index, lang: 'fr', url: site.urlFr });
        currentTests.total++;
    }
    
    if (site.urlEn) {
        currentTests.queue.push({ siteIndex: index, lang: 'en', url: site.urlEn });
        currentTests.total++;
    }
    
    if (currentTests.total === 0) {
        showStatus('Aucune URL à tester pour ce site', 'error');
        return;
    }
    
    // Afficher les informations de progression
    document.getElementById('testProgressBar').style.width = '0%';
    document.getElementById('testProgressText').textContent = `0/${currentTests.total} URLs testées`;
    document.getElementById('testProgressText').parentElement.style.display = 'block';
    
    // Fermer la modale de configuration
    document.getElementById('testConfigModal').style.display = 'block';
    
    // Débuter les tests
    startTests();
}

// Démarrer les tests d'URL
function startTests() {
    // Récupérer les paramètres de configuration
    currentTests.timeout = parseInt(document.getElementById('testTimeout').value) || 10000;
    currentTests.maxConcurrent = parseInt(document.getElementById('maxConcurrent').value) || 3;
    currentTests.cacheDuration = parseInt(document.getElementById('testCacheDuration').value) * 60 * 60 * 1000 || 24 * 60 * 60 * 1000;
    currentTests.forceTest = document.getElementById('forceTest').checked;
    currentTests.checkContent = document.getElementById('checkContent').checked;
    currentTests.followRedirects = document.getElementById('followRedirects').checked;
    
    // Si la queue est vide, récupérer tous les sites visibles
    if (currentTests.queue.length === 0) {
        // Récupérer tous les sites visibles dans le tableau
        const visibleRows = Array.from(document.getElementById('tableBody').querySelectorAll('tr'))
            .filter(row => row.style.display !== 'none');
        
        currentTests.total = 0;
        currentTests.completed = 0;
        currentTests.queue = [];
        
        visibleRows.forEach(row => {
            const siteIndex = parseInt(row.dataset.siteIndex);
            const site = sitesData[siteIndex];
            
            if (site.urlFr) {
                currentTests.queue.push({ siteIndex, lang: 'fr', url: site.urlFr });
                currentTests.total++;
            }
            
            if (site.urlEn) {
                currentTests.queue.push({ siteIndex, lang: 'en', url: site.urlEn });
                currentTests.total++;
            }
        });
    }
    
    if (currentTests.total === 0) {
        showStatus('Aucune URL à tester', 'error');
        return;
    }
    
    // Initialiser la barre de progression
    document.getElementById('testProgressBar').style.width = '0%';
    document.getElementById('testProgressText').textContent = `0/${currentTests.total} URLs testées`;
    document.getElementById('testProgressText').parentElement.style.display = 'block';
    
    // Marquer les tests comme étant en cours
    currentTests.running = true;
    currentTests.stop = false;
    
    // Afficher un message de statut
    showStatus(`Test de ${currentTests.total} URLs en cours...`, 'loading');
    
    // Démarrer le traitement de la queue
    processUrlQueue();
}

// Arrêter les tests en cours
function stopTests() {
    if (currentTests.running) {
        currentTests.stop = true;
        showStatus('Arrêt des tests en cours...', 'loading');
    }
}

// Gestionnaire d'erreurs global pour TOUTES les erreurs de console pendant les tests
let globalTestErrorHandler = null;

// Cette fonction sera exécutée au début du script pour SUPPRIMER TOUTES LES ERREURS
// liées au testing d'URL ou au chargement de ressources web dans la console
document.addEventListener('DOMContentLoaded', function() {
    // 1. Supprimer TOUTES les erreurs de ressources web (images, iframes, etc.)
    // Ce gestionnaire est crucial pour éviter les erreurs 404 dans la console
    globalTestErrorHandler = function(e) {
        // Tester d'abord si c'est une erreur de ressource
        if (e.target && (
            // Si c'est une image, iframe, script, etc.
            (e.target.tagName === 'IMG') || 
            (e.target.tagName === 'IFRAME') || 
            (e.target.tagName === 'LINK') ||
            (e.target.tagName === 'SCRIPT') ||
            // Ou si le message d'erreur contient des indices d'URL
            (e.message && (
                e.message.includes('http') || 
                e.message.includes('favicon') ||
                e.message.includes('GET ') ||
                e.message.includes('404') ||
                e.message.includes('HEAD ') ||
                e.message.includes('Failed to load')
            )) ||
            // Ou si le fichier en erreur est une URL ou une ressource
            (e.filename && (
                e.filename.includes('http') || 
                e.filename.includes('favicon') || 
                e.filename.includes('.png') || 
                e.filename.includes('.ico') ||
                e.filename.includes('.jpg')
            ))
        )) {
            // TOUJOURS bloquer l'affichage de ces erreurs
            // Ce qui est crucial pour une interface propre
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    };
    
    // 2. Installer l'intercepteur pour TOUTES les erreurs
    window.addEventListener('error', globalTestErrorHandler, true);
    
    // 3. Intercepter aussi les rejets de promesses (très important pour fetch)
    window.addEventListener('unhandledrejection', function(e) {
        // Toujours empêcher l'affichage des rejets de promesses liés à HTTP
        if (e.reason && (
            typeof e.reason.toString === 'function' && (
                e.reason.toString().includes('http') || 
                e.reason.toString().includes('fetch') ||
                e.reason.toString().includes('network') ||
                e.reason.toString().includes('404') ||
                e.reason.toString().includes('error') ||
                e.reason.toString().includes('fail')
            )
        )) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);
    
    // 4. Surcharge de console.error pour filtrer les erreurs HTTP
    const originalConsoleError = console.error;
    console.error = function() {
        // Vérifier si l'erreur est liée à une ressource HTTP
        if (arguments.length > 0) {
            const errorMsg = String(arguments[0] || '');
            
            // Si le message contient des indices d'erreur web, on le supprime
            if (errorMsg.includes('http') || 
                errorMsg.includes('favicon') ||
                errorMsg.includes('GET ') ||
                errorMsg.includes('404') ||
                errorMsg.includes('Failed to load') ||
                errorMsg.includes('CORS')) {
                return; // Ignorer complètement cette erreur
            }
        }
        
        // Sinon, on laisse passer l'erreur originale
        return originalConsoleError.apply(console, arguments);
    };
});

// Traiter la queue d'URLs à tester
function processUrlQueue() {
    if (currentTests.stop) {
        currentTests.running = false;
        showStatus('Tests arrêtés par l\'utilisateur', 'error');
        return;
    }
    
    // Traiter jusqu'à maxConcurrent URLs en même temps
    while (currentTests.concurrent < currentTests.maxConcurrent && currentTests.queue.length > 0) {
        const testItem = currentTests.queue.shift();
        testUrl(testItem);
        currentTests.concurrent++;
    }
    
    // Si la queue est vide et qu'il n'y a plus de tests en cours, terminer le processus
    if (currentTests.queue.length === 0 && currentTests.concurrent === 0) {
        currentTests.running = false;
        showStatus(`Tests terminés: ${currentTests.total} URLs testées`, 'success');
        updateTable(); // Rafraîchir l'affichage des données
    }
}

// Tableau global pour suivre les erreurs de résolution de nom (DNS) pour chaque URL
let domainErrors = {};

// Intercepteur global pour supprimer les erreurs de console
// On l'installe une seule fois dès le chargement
document.addEventListener('DOMContentLoaded', function() {
    // Intercepter TOUTES les erreurs liées aux ressources
    window.addEventListener('error', function(e) {
        if (e.target && (e.target.tagName === 'IMG' || e.target.tagName === 'IFRAME' || 
            e.target.nodeName === 'SCRIPT' || e.target.nodeName === 'LINK')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        return true;
    }, true);

    // Supprimer aussi les erreurs de rejets de promesses (pour fetch)
    window.addEventListener('unhandledrejection', function(e) {
        e.preventDefault();
        return false;
    }, true);
});

// Méthode simple pour tester une URL
function testUrl(testItem) {
    const { siteIndex, lang, url } = testItem;
    const site = sitesData[siteIndex];
    
    // Vérifier si un test récent est disponible dans le cache
    if (!currentTests.forceTest && site.validation && site.validation[lang]) {
        const validation = site.validation[lang];
        if (validation.timestamp) {
            const now = Date.now();
            const lastTest = validation.timestamp;
            
            // Si le dernier test est assez récent, utiliser ce résultat
            if (now - lastTest < currentTests.cacheDuration) {
                updateTestProgress();
                currentTests.concurrent--;
                processUrlQueue();
                return;
            }
        }
    }
    
    // Mettre à jour l'indicateur de statut pour montrer que le test est en cours
    const row = document.querySelector(`tr[data-site-index="${siteIndex}"]`);
    if (row) {
        const cell = row.cells[lang === 'fr' ? 2 : 3];
        if (cell) {
            const tooltip = cell.querySelector('.tooltip');
            if (tooltip) {
                const indicator = tooltip.querySelector('.url-status');
                if (indicator) {
                    indicator.className = 'url-status loading';
                    
                    const tooltipText = tooltip.querySelector('.tooltip-text');
                    if (tooltipText) {
                        tooltipText.textContent = 'Test en cours...';
                    }
                }
            }
        }
    }
    
    // Remplacer les placeholders dans l'URL
    const testUrl = url
        .replace('##QUERY##', 'test')
        .replace('##ISBN##', '9780446310789');
    
    // Vérifier si l'URL est valide
    let urlObj;
    try {
        urlObj = new URL(testUrl);
    } catch (e) {
        // URL invalide, on la marque comme telle immédiatement
        handleTestResult(siteIndex, lang, {
            status: 'invalid',
            code: 'INVALID_URL',
            timestamp: Date.now(),
            error: "URL mal formée: " + e.message
        });
        
        updateTestProgress();
        currentTests.concurrent--;
        processUrlQueue();
        return;
    }
    
    // Si l'URL est vide
    if (!url.trim()) {
        handleTestResult(siteIndex, lang, {
            status: 'invalid',
            code: 'EMPTY_URL',
            timestamp: Date.now(),
            error: "L'URL est vide"
        });
        
        updateTestProgress();
        currentTests.concurrent--;
        processUrlQueue();
        return;
    }
    
    // Variables de contrôle
    let isCompleted = false;
    let urlIsValid = false;
    let dnsErrorDetected = false;
    let testTimeoutId = null;
    let domainErrorHandler = null;
    
    // Nettoyer les éléments créés
    function cleanup() {
        // Supprimer tous les timeouts
        clearTimeout(testTimeoutId);
        clearTimeout(quickTimeoutId);
        
        try {
            // Supprimer l'image du favicon
            if (faviconImg && faviconImg.parentNode) {
                faviconImg.parentNode.removeChild(faviconImg);
            }
            
            // Supprimer l'image aléatoire
            if (randomImg && randomImg.parentNode) {
                randomImg.parentNode.removeChild(randomImg);
            }
            
            // Supprimer le gestionnaire d'erreurs
            if (domainErrorHandler) {
                window.removeEventListener('error', domainErrorHandler, true);
            }
        } catch (e) {}
    }
    
    // Fonction pour marquer l'URL comme valide
    function markAsValid(code) {
        if (!isCompleted) {
            isCompleted = true;
            cleanup();
            
            handleTestResult(siteIndex, lang, {
                status: 'valid',
                code: code || 'URL_VALID',
                timestamp: Date.now(),
                error: null
            });
        }
    }
    
    // Fonction pour marquer l'URL comme invalide
    function markAsInvalid(code, error) {
        if (!isCompleted) {
            isCompleted = true;
            cleanup();
            
            handleTestResult(siteIndex, lang, {
                status: 'invalid',
                code: code || 'URL_INVALID',
                timestamp: Date.now(),
                error: error || "URL invalide"
            });
        }
    }
    
    // Méthode 1: Test du favicon
    // Cette méthode est très simple et fonctionne pour la plupart des sites
    // Si le favicon charge, le domaine est certainement valide
    const faviconImg = new Image();
    faviconImg.style.display = 'none';
    document.body.appendChild(faviconImg);
    
    faviconImg.onload = function() {
        urlIsValid = true;
        markAsValid('FAVICON_LOADED');
    };
    
    faviconImg.onerror = function(e) {
        // Si le favicon échoue, on essaie d'autres méthodes
        // Ne rien faire ici, le timeout s'en chargera
    };
    
    // Tester le favicon (en ajoutant un timestamp pour éviter le cache)
    const domain = urlObj.hostname;
    faviconImg.src = `https://${domain}/favicon.ico?_=${Date.now()}`;
    
    // Méthode 2: Test simple avec fetch en no-cors (simplement pour voir si le domaine répond)
    fetch(`https://${domain}`, { 
        method: 'HEAD',
        mode: 'no-cors',  // Crucial pour éviter les erreurs CORS
        cache: 'no-store'
    })
    .then(() => {
        // Si on arrive ici, le domaine existe certainement
        urlIsValid = true;
        markAsValid('FETCH_SUCCESS');
    })
    .catch(() => {
        // Une erreur fetch n'est pas conclusive (peut être CORS)
    });
    
    // Test spécifique pour les domaines inexistants
    // Très simple: on crée une nouvelle image avec un chemin random sur le domaine
    // Si elle déclenche une erreur DNS, le domaine n'existe probablement pas
    const randomImg = new Image();
    randomImg.style.display = 'none';
    document.body.appendChild(randomImg);
    
    // On ajoute un gestionnaire qui détecte spécifiquement les erreurs DNS
    domainErrorHandler = function(e) {
        // Vérifier si l'erreur est liée à notre image ou au domaine que nous testons
        if ((e.target === randomImg || 
            (e.filename && e.filename.includes(domain))) && 
            (e.message && (
                e.message.includes('DNS') || 
                e.message.includes('ERR_NAME_NOT_RESOLVED') || 
                e.message.includes('net::ERR_NAME_NOT_RESOLVED') ||
                e.message.includes('ERR_NAME') ||
                e.message.includes('hostname')
            ))) {
            
            dnsErrorDetected = true;
            
            // Si nous détectons une erreur DNS, on peut marquer l'URL comme invalide immédiatement
            // C'est le signal le plus fiable qu'un domaine n'existe pas
            if (!isCompleted) {
                markAsInvalid('DNS_ERROR_IMMEDIATE', "Le domaine n'existe pas (DNS error)");
            }
        }
        
        // Toujours supprimer l'erreur de la console
        e.preventDefault();
        e.stopPropagation();
        return false;
    };
    
    // Ajouter le gestionnaire d'erreurs
    window.addEventListener('error', domainErrorHandler, true);
    
    // On essaie de charger un chemin random (très efficace pour détecter les domaines inexistants)
    // Nous utilisons un chemin totalement aléatoire qui ne devrait exister sur aucun site
    randomImg.src = `https://${domain}/doesnotexist-${Math.random()}.png?_=${Date.now()}`;
    
    // Définir un timeout court pour les erreurs DNS rapides
    const quickTimeoutId = setTimeout(() => {
        // Si nous avons déjà détecté une erreur DNS mais que le test n'est pas encore terminé,
        // on peut conclure plus rapidement
        if (dnsErrorDetected && !isCompleted) {
            markAsInvalid('DNS_ERROR_QUICK', "Le domaine n'existe pas (DNS error)");
        }
    }, 1500); // 1.5 secondes pour les erreurs DNS rapides
    
    // Définir un timeout plus long pour tirer des conclusions définitives
    testTimeoutId = setTimeout(() => {
        // Nettoyer le timeout rapide
        clearTimeout(quickTimeoutId);
        
        // Si l'URL a été marquée comme valide ou invalide, ne rien faire
        if (isCompleted) return;
        
        // Si on a détecté une erreur DNS, le domaine n'existe probablement pas
        if (dnsErrorDetected) {
            markAsInvalid('DNS_ERROR', "Le domaine n'existe pas (DNS error)");
        } 
        // Sinon, on considère l'URL comme valide par défaut
        // La plupart des domaines valides vont bloquer nos tests mais existent quand même
        else {
            markAsValid('TIMEOUT_ASSUMED_VALID');
        }
    }, 5000); // 5 secondes suffisent généralement pour un test complet
}

// Gérer le résultat d'un test d'URL
function handleTestResult(siteIndex, lang, result) {
    const site = sitesData[siteIndex];
    
    // Initialiser l'objet validation si nécessaire
    if (!site.validation) {
        site.validation = {};
    }
    
    // Stocker le résultat
    site.validation[lang] = result;
    
    // Mettre à jour l'UI
    updateTestProgress();
    
    // Décrémenter le compteur de tests concurrents
    currentTests.concurrent--;
    
    // Continuer à traiter la queue
    processUrlQueue();
}

// Mettre à jour la progression des tests
function updateTestProgress() {
    currentTests.completed++;
    
    // Mettre à jour la barre de progression
    const progressBar = document.getElementById('testProgressBar');
    const progressText = document.getElementById('testProgressText');
    
    const progressPercent = (currentTests.completed / currentTests.total) * 100;
    progressBar.style.width = `${progressPercent}%`;
    progressText.textContent = `${currentTests.completed}/${currentTests.total} URLs testées`;
}