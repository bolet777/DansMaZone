# DansMaZone - TODO

## 🧪 Tests et Qualité (Priorité Haute)

### Architecture de Tests

* [x] ✅ 📋 **Refactor système de tests**
* [ ] 📋 **Infrastructure tests end-to-end** (Playwright ou Puppeteer)
* [ ] 📋 **Tests de content scripts** (Jest + jsdom)
* [ ] 📋 **Validation et gestion des erreurs**

  * Créer un middleware ou helper `handleError()` pour uniformiser les `catch`/`console.error`
  * Valider systématiquement les données reçues (storage local, messages entre scripts)

### Tests Manquants

* [x] ✅ Tests pour `preprocessText`
* [x] ✅ Tests de classification par catégorie
* [ ] 📋 Tests d'extraction des données produit Amazon
* [ ] 📋 Tests de performance (temps de chargement < 1s)
* [ ] 📋 Tests de régression sur les sélecteurs Amazon
* [ ] 📋 Tests end-to-end (Playwright ou Puppeteer)
* [ ] 📋 Tests content scripts (Jest + jsdom)

---

## 💾 Architecture des Données (Priorité Haute)

### Stockage des Sites

* [ ] 📋 **Analyser les limites du système JSON actuel**

  * Fichier `default-sites.json` devient volumineux (300+ sites)
  * Pas de versionning des données
  * Validation manuelle des URLs chronophage
  * Performance de chargement à étudier

* [ ] 📋 **Évaluer une base de données**

  * SQLite embarqué vs JSON optimisé
  * Indexation par catégorie/langue
  * Système de cache intelligent
  * Migration des données existantes

### Validation des URLs

* [x] ✅ Site Editor avec validation HTTP
* [ ] 📋 Automatisation des tests de validité
* [ ] 📋 Monitoring des sites cassés
* [ ] 📋 Système d'alerte pour les URLs 404

---

## 🔍 Classification et Performance

### Optimisations Actuelles

* [x] ✅ Cache TF-IDF (`preparedData`)
* [x] ✅ Cache classification (`classificationCache`)
* [x] ✅ Cache mots-clés (`keywordsCache`)
* [x] ✅ Temps de chargement < 1s (objectif atteint)

### Améliorations Futures

* [ ] 📋 **Index inversé mot → catégories**

  * Classification en 2 étapes (rapide + approfondie)
  * Réduire le nombre de comparaisons TF-IDF
  * Méta-catégories pour filtrage initial

* [ ] 📋 **Extraction fabricant/marque améliorée**

  * Parser plus de sélecteurs Amazon
  * Gérer les variations de structure HTML
  * Fallbacks robustes

---

## ⚙️ Outils de développement modernes (Priorité Moyenne)

* [ ] 📋 Migrer de `webpack.config.js` vers Vite (simplifier la configuration, dev server rapide)
* [ ] 📋 Refondre le popup et la page d’options en React (ou Preact) + Tailwind CSS

  * Composants réutilisables (Listes, Modales)
  * Design mobile-first
* [ ] 📋 Mettre en place Prettier + Biome et Husky en pre-commit pour cohérence du style

---

## 🛠 Robustesse et Maintenance

### Sélecteurs Amazon

* [x] ✅ Sélecteurs CSS avec fallbacks multiples
* [x] ✅ Extraction robuste titre/marque/ISBN
* [ ] 📋 **Monitoring des changements Amazon**

  * Tests automatisés sur pages Amazon réelles
  * Alertes si extraction échoue
  * Documentation des sélecteurs critiques

### Gestion d'Erreurs

* [x] ✅ Fonction `handleError` centralisée
* [x] ✅ Fallbacks pour stockage corrompu
* [x] ✅ Mode de récupération fonctionnel
* [ ] 📋 Instrumenter `console.log`/`console.error` vers un service de monitoring (Sentry, LogRocket)
* [ ] 📋 Bouton “Envoyer un rapport d’erreur” pour feedback utilisateur

---

## 🔒 Sécurité et Permissions (Priorité Haute)

* [ ] 📋 Vérifier les permissions dans `manifest.json` (éviter `<all_urls>`)
* [ ] 📋 Stocker les clés API dans `chrome.storage.sync` chiffré (ne pas inclure dans le code)
* [ ] 📋 Implémenter un mécanisme de rate-limit pour les appels aux API externes

---

## 📦 Distribution et Compatibilité

### Stores

* [x] ✅ Structure conforme Chrome/Firefox/Edge
* [ ] 📋 **Validation finale stores**

  * Tester soumission Chrome Web Store
  * Validation Firefox Add-ons
  * Documentation pour reviewers

### Maintenance

* [x] ✅ Build system automatisé
* [x] ✅ Linting/formatting (Biome)
* [ ] 📋 CI/CD pour tests automatiques
* [ ] 📋 Release notes automatisées

---

## 🎨 UX/UI (Priorité Faible)

### Fonctionnel Actuel

* [x] ✅ Sidebar responsive avec hover
* [x] ✅ Support bilingue automatique
* [x] ✅ Notifications d'erreur utilisateur
* [x] ✅ Page d'options complète

### Améliorations Futures (si temps)

* [ ] 📋 Mode sombre (détection préférences système)
* [ ] 📋 Personnalisation couleurs/thème
* [ ] 📋 Statistiques utilisateur dans les options

---

## 🚀 Roadmap Prioritaire

### Phase 1 - Fondations Solides (1-2 mois)

1. **Refactor système de tests** (critique)
2. **Analyser architecture données** (JSON vs DB)
3. **Monitoring sélecteurs Amazon** (robustesse)

### Phase 2 - Optimisations (2-3 mois)

1. **Index inversé classification** (performance)
2. **Automatisation validation URLs** (qualité)
3. **Système de release** (distribution)

### Phase 3 - Fonctionnalités (3+ mois)

1. **Sites officiels marques** (valeur ajoutée)
2. **Analytics utilisateur** (données)
3. **Améliorations UX** (polish)

---

## 📊 Métriques Actuelles

### Performance ✅

* **Temps chargement** : < 1s (objectif atteint)
* **Classification** : \~85% précision estimée
* **Sites supportés** : 300+ actifs

### Qualité 🔄

* **Couverture tests** : \~30% (à améliorer)
* **URLs validées** : Manuel (à automatiser)
* **Robustesse** : Bonne (fallbacks en place)

---

## Notes de Développement

* **Priorité absolue** : Tests + Architecture données
* **Éviter** : Over-engineering (garder simple)
* **Focus** : Robustesse avant nouvelles fonctionnalités
* **Méthode** : Une tâche à la fois, bien finie
