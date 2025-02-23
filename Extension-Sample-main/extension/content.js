// content.js

// Track the current URL and timer IDs.
let lastUrl = location.href;
let alertTimeoutId = null;
let alertIntervalId = null;

// Clear any pending timers.
function clearTimers() {
  if (alertTimeoutId) {
    clearTimeout(alertTimeoutId);
    alertTimeoutId = null;
  }
  if (alertIntervalId) {
    clearInterval(alertIntervalId);
    alertIntervalId = null;
  }
}

// Function to send an alert message to the background.
function sendAlert() {
  chrome.runtime.sendMessage({ action: 'triggerAlert' }, (response) => {
    console.log("Alert sent, response:", response);
  });
}

// Placeholder function to determine if a video is valid.
// Currently always returns false to simulate an invalid video.
function isVideoValid() {
  // Replace this logic with your actual validity check.
  return false;
}

// Schedule a check for the current video.
function scheduleAlertForVideo() {
  clearTimers();
  console.log("Scheduling scan for the current video.");

  // Wait 5 minutes (300000 ms) before checking validity.
  alertTimeoutId = setTimeout(() => {
    console.log("5 minutes elapsed: Checking video validity.");
    if (!isVideoValid()) {
      console.log("Video is invalid. Sending first alert.");
      sendAlert();
      // Schedule repeated alerts every 2 minutes (120000 ms).
      alertIntervalId = setInterval(() => {
        if (!isVideoValid()) {
          console.log("Video is still invalid. Sending repeated alert.");
          sendAlert();
        } else {
          console.log("Video became valid. Clearing alert interval.");
          clearInterval(alertIntervalId);
          alertIntervalId = null;
        }
      }, 120000);
    } else {
      console.log("Video is valid. No alerts needed.");
    }
  }, 300000);
}

// Check for URL changes and schedule alert scans for new videos.
function checkUrlChange() {
  const currentUrl = location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    console.log("New video detected:", currentUrl);
    clearTimers();
    scheduleAlertForVideo();
  }
}

// Set up a MutationObserver to detect DOM changes (useful on dynamic sites like YouTube).
const observer = new MutationObserver(checkUrlChange);
observer.observe(document, { subtree: true, childList: true });

// Also listen for popstate events (e.g., when the user navigates).
window.addEventListener('popstate', checkUrlChange);

// Start scheduling for the current video immediately.
scheduleAlertForVideo();
