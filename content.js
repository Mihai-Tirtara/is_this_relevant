// Debug logging
console.log('Content script loaded!');
console.log('Document ready state:', document.readyState);
console.log('URL:', window.location.href);

// Check if this is a new page load (not just a hash change or similar)
let isNewPageLoad = !window.hasExtensionRun;
window.hasExtensionRun = true;

console.log('Is new page load:', isNewPageLoad);

// Always try to show dialog after a short delay to ensure page is ready
if (isNewPageLoad) {
  setTimeout(() => {
    console.log('Attempting to show dialog...');
    showRelevanceDialog();
  }, 1000);
}

function showRelevanceDialog() {
  console.log('showRelevanceDialog called');
  console.log('Current URL:', window.location.href);
  console.log('Protocol:', window.location.protocol);
  
  // Don't show dialog on extension pages or special URLs
  if (window.location.protocol === 'moz-extension:' || 
      window.location.protocol === 'about:' ||
      window.location.protocol === 'chrome:' ||
      window.location.href.includes('https://www.google.com/search?'))  {
    console.log('Skipping dialog for special URL');
    return;
  }

  console.log('Creating dialog...');

  // Remove any existing dialog first
  const existingOverlay = document.getElementById('relevance-checker-overlay');
  if (existingOverlay) {
    console.log('Removing existing dialog');
    existingOverlay.remove();
  }

  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'relevance-checker-overlay';
  overlay.innerHTML = `
    <div id="relevance-checker-dialog">
      <h3>Site Relevance Check</h3>
      <p>Is this website relevant to you?</p>
      <div class="button-container">
        <button id="relevance-yes" class="btn btn-yes">Yes</button>
        <button id="relevance-no" class="btn btn-no">No</button>
      </div>
    </div>
  `;

  console.log('Appending dialog to body');
  document.body.appendChild(overlay);

  // Add event listeners
  const yesBtn = document.getElementById('relevance-yes');
  const noBtn = document.getElementById('relevance-no');
  
  console.log('Yes button found:', !!yesBtn);
  console.log('No button found:', !!noBtn);
  
  if (yesBtn) {
    yesBtn.addEventListener('click', handleYes);
    console.log('Yes button listener added');
  }
  
  if (noBtn) {
    noBtn.addEventListener('click', handleNo);
    console.log('No button listener added');
  }

  // Prevent background scrolling
  document.body.style.overflow = 'hidden';
  
  console.log('Dialog should now be visible');
}

function handleYes() {
  console.log('Yes button clicked - keeping page open');
  removeDialog();
}

function handleNo() {
  console.log('No button clicked - closing tab');
  removeDialog(); // Remove dialog first
  
  // Send message to background script to close the tab
  try {
    if (typeof browser !== 'undefined') {
      browser.runtime.sendMessage({ action: 'closeTab' }).catch(error => {
        console.error('Error sending message:', error);
        // Fallback: try to close window directly
        //window.close();
      });
    } else if (typeof chrome !== 'undefined') {
      chrome.runtime.sendMessage({ action: 'closeTab' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error:', chrome.runtime.lastError);
          // Fallback: try to close window directly
          //window.close();
        }
      });
    } else {
      // Final fallback
      //window.close();
    }
  } catch (error) {
    console.error('Failed to close tab:', error);
    // Try alternative methods
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.close();
    }
  }
}

function removeDialog() {
  const overlay = document.getElementById('relevance-checker-overlay');
  if (overlay) {
    overlay.remove();
  }
  // Restore scrolling
  document.body.style.overflow = '';
}