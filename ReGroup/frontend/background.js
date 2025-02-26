// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'redirectToYouTube') {
      const { searchFeed } = message;
      const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchFeed)}`;
      
      // Open a new tab with the YouTube search results
      chrome.tabs.create({ url: youtubeSearchUrl }, (tab) => {
        if (chrome.runtime.lastError) {
          console.error('Error creating tab:', chrome.runtime.lastError);
        } else {
          console.log('Redirected to YouTube:', youtubeSearchUrl);
  
          // Listen for the new tab to finish loading
          chrome.tabs.onUpdated.addListener(function onUpdated(tabId, changeInfo) {
            if (tabId === tab.id && changeInfo.status === 'complete') {
              // Inject the content script into the new tab
              chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js'],
              });
  
              // Remove the listener to avoid multiple injections
              chrome.tabs.onUpdated.removeListener(onUpdated);
            }
          });
        }
      });
    }
  });