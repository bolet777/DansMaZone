/**
 * Mini-serveur pour vérifier les URLs pour DansMaZone
 * 
 * Ce serveur fournit une API REST pour vérifier la validité des URLs
 * et contourner les restrictions CORS du navigateur.
 */

const express = require('express');
const cors = require('cors');
const urlValidator = require('./url-validator');
const path = require('path');
const fs = require('fs');

// Configuration du serveur Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour le parsing JSON et CORS
app.use(express.json());
app.use(cors());

// Servir les fichiers statiques de l'éditeur
app.use(express.static(path.join(__dirname, '..')));

// Route pour vérifier une URL individuelle
app.post('/check-url', async (req, res) => {
  try {
    const { url, timeout } = req.body;
    
    if (!url) {
      return res.status(400).json({ 
        error: 'URL is required' 
      });
    }

    console.log(`Testing URL: ${url}`);
    const result = await urlValidator.checkUrl(url, timeout);
    console.log(`Result for ${url}: ${JSON.stringify(result)}`);
    
    res.json(result);
  } catch (error) {
    console.error('Error checking URL:', error);
    res.status(500).json({ 
      status: 'error', 
      error: error.message || 'Unknown error occurred' 
    });
  }
});

// Route pour tester un lot d'URLs
app.post('/check-urls-batch', async (req, res) => {
  try {
    const { urls, timeout, concurrency = 5 } = req.body;
    
    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ 
        error: 'URLs array is required' 
      });
    }

    console.log(`Testing ${urls.length} URLs in batch mode`);
    const results = await urlValidator.checkUrlsBatch(urls, timeout, concurrency);
    
    res.json(results);
  } catch (error) {
    console.error('Error checking URLs batch:', error);
    res.status(500).json({ 
      status: 'error', 
      error: error.message || 'Unknown error occurred' 
    });
  }
});

// Route pour charger le fichier default-sites.json 
app.get('/load-default-sites', (req, res) => {
  try {
    const defaultSitesPath = path.join(__dirname, '../../datas/default-sites.json');
    
    if (!fs.existsSync(defaultSitesPath)) {
      return res.status(404).json({
        error: 'default-sites.json not found'
      });
    }

    const data = fs.readFileSync(defaultSitesPath, 'utf8');
    const sitesData = JSON.parse(data);
    
    res.json(sitesData);
  } catch (error) {
    console.error('Error loading default sites:', error);
    res.status(500).json({
      status: 'error',
      error: error.message || 'Unknown error occurred'
    });
  }
});

// Route pour enregistrer le fichier default-sites-generated.json
app.post('/save-sites', (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({
        error: 'Data is required'
      });
    }
    
    const outputPath = path.join(__dirname, '../default-sites-generated.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
    
    console.log(`File saved to ${outputPath}`);
    res.json({ success: true, path: outputPath });
  } catch (error) {
    console.error('Error saving sites:', error);
    res.status(500).json({
      status: 'error',
      error: error.message || 'Unknown error occurred'
    });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`
┌──────────────────────────────────────────────────┐
│                                                  │
│   DansMaZone URL Checker Server                  │
│                                                  │
│   Server running at: http://localhost:${PORT}      │
│                                                  │
│   To use the tool, open in your browser:         │
│   http://localhost:${PORT}/editSites.html          │
│                                                  │
└──────────────────────────────────────────────────┘
`);
});