document.getElementById('searchButton').addEventListener('click', () => {
    const searchFeed = document.getElementById('searchFeed').value;
    if (searchFeed) {
      // Save the search feed to storage
      chrome.storage.local.set({ searchFeed }, () => {
        // Redirect to YouTube search results
        chrome.runtime.sendMessage({ action: 'redirectToYouTube', searchFeed }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error sending message:', chrome.runtime.lastError);
          } else {
            console.log('Redirecting to YouTube...');
          }
        });
      });
    } else {
      alert('Please enter a search feed!');
    }
  });