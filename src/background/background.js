import browser from 'webextension-polyfill';

// Écouter les messages du content script
browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'openOptions') {
    browser.runtime.openOptionsPage();
  }
});