// tests/mocks/browser.js
// Mock pour remplacer webextension-polyfill dans l'environnement Node.js

// Créer un objet qui simule l'API browser de WebExtension
const browserMock = {
    runtime: {
      getURL: (path) => `mocked-extension://${path}`,
      sendMessage: () => Promise.resolve({}),
      onMessage: {
        addListener: () => {}
      },
      openOptionsPage: () => Promise.resolve()
    },
    
    storage: {
      local: {
        get: (key) => {
          // Simuler des données de stockage pour les tests
          const mockStorage = {
            userSites: {},
            userCategoryKeywords: {}
          };
          
          if (typeof key === 'string') {
            return Promise.resolve({ [key]: mockStorage[key] || null });
          } else if (Array.isArray(key)) {
            const result = {};
            key.forEach(k => {
              result[k] = mockStorage[k] || null;
            });
            return Promise.resolve(result);
          } else {
            return Promise.resolve(mockStorage);
          }
        },
        set: () => Promise.resolve()
      }
    },
    
    i18n: {
      getMessage: (key) => {
        // Simuler des traductions
        const translations = {
          extensionName: 'DansMaZone',
          sidebarTitle: 'Dans ma zone',
          optionsText: 'Options',
          searchOn: 'Chercher sur'
        };
        return translations[key] || key;
      }
    },
    
    tabs: {
      create: () => Promise.resolve({ id: 123 }),
      query: () => Promise.resolve([{ id: 123, url: 'https://example.com' }])
    }
  };
  
  export default browserMock;