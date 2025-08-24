// Listen for messages from content scripts
if (typeof browser !== 'undefined') {
  // Firefox
  browser.runtime.onMessage.addListener((message, sender) => {
    if (message.action === 'closeTab') {
      browser.tabs.remove(sender.tab.id);
    }
  });
} else if (typeof chrome !== 'undefined') {
  // Chrome (for compatibility)
  chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action === 'closeTab') {
      chrome.tabs.remove(sender.tab.id);
    }
  });
}
