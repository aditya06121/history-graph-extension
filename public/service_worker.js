let tracking = true;

chrome.webNavigation.onCompleted.addListener((details) => {
  if (tracking) {
    if (details.frameId === 0) {
      // Only for the main frame
      const url = details.url;
      console.log(`URL: ${url}`);
      // No need to notify about tracking info as per adi's instructions
    }
  }
});

let tabName = ""; // Initialize tabName outside the listener

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tracking) {
    if (changeInfo.title) {
      const currentTitle = tab.title;

      // Check if the title includes common URL indicators
      const isURLLike = currentTitle.includes("/");

      // Update tabName only if it's new and not URL-like
      if (!isURLLike && currentTitle !== tabName) {
        console.log(currentTitle);
        tabName = currentTitle;
      }
    }
  }
});

//listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.tracking !== undefined) {
    if (message.tracking) {
      tracking = true;
    } else {
      tracking = false;
    }
  }
});
