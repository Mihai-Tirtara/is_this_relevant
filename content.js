
// Check if this is a new page load (not just a hash change or similar)
let isNewPageLoad = !window.hasExtensionRun;
window.hasExtensionRun = true;

const specialPages = isSpecialPage(); 

function isSpecialPage() {
  const url = window.location.href;
  const protocol = window.location.protocol;

  if (protocol === 'moz-extension:' || 
      protocol === 'about:' ||
      protocol === 'chrome:' ||
      url.includes('https://www.google.com/search?')) 
    return true;
}


// Add a short delay to ensure page is ready
if (isNewPageLoad && !specialPages) {
  setTimeout(() => {
    showDialog();
  }, 1000);
}

function showDialog() {

  // Create dialog
  const dialogPage = document.createElement('div');
  dialogPage.id = 'relevance-checker-dialog-page';
  dialogPage.innerHTML = `
    <div id="relevance-checker-dialog">
      <h3>Site Relevance Check</h3>
      <p>Is this website relevant to you?</p>
      <div class="button-container">
        <button id="yes" class="btn btn-yes">Yes</button>
        <button id="no" class="btn btn-no">No</button>
      </div>
    </div>
  `;
  document.body.appendChild(dialogPage);

  document.getElementById('yes').addEventListener('click', removeDialog);
  document.getElementById('no').addEventListener('click', closePage);
  
  // Prevent background scrolling
  document.body.style.overflow = 'hidden';
  
}

function removeDialog() {
  const dialogPage = document.getElementById('relevance-checker-dialog-page');
  if (dialogPage) {
    dialogPage.remove();
  }
  // Restore scrolling
  document.body.style.overflow = '';
}

function closePage() { 
  
  try {
    if (typeof chrome !== 'undefined') {
      chrome.runtime.sendMessage({ action: 'closeTab' }).catch(error => {
        console.error('Error sending message:', error);
      });
    }
  } 
  catch (error) {
    console.error('Failed to send close tab :', error);
  }
}

