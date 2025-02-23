chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'triggerAlert') {
    console.log("Received triggerAlert message from content script.");
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Content Alert',
      message: 'The current video is off-topic. Please check your search.'
    }, (notificationId) => {
      console.log("Notification created with id:", notificationId);
      sendResponse({ result: 'Alert triggered' });
    });
    // Return true to indicate asynchronous response.
    return true;
  }
});
