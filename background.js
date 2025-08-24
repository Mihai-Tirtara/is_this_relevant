// Listen for messages from content scripts
if (typeof chrome !== 'undefined') {
  chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action === 'closeTab') {
      chrome.tabs.remove(sender.tab.id);
    }
  });
} 

