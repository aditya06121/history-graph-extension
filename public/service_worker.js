// global variables
let tracking = true;
let obj = {};
let tabName = "";

// tracks the names of the tabs and stuff on tab update if tracking is turned on in popup.js
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tracking) {
    if (changeInfo.title) {
      const currentTitle = tab.title;

      // Check if the title includes common URL indicators
      const isURLLike = currentTitle.includes("/");

      // Update tabName only if it's new and not URL-like
      if (!isURLLike && currentTitle !== tabName) {
        obj = {
          title: currentTitle,
          url: tab.url,
          tabId: tabId,
          openerTabId: tab.openerTabId,
        };
        console.log(obj);
        tabName = currentTitle;
      }
    }
  }
});

//listen for messages from the popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.tracking !== undefined) {
    if (message.tracking) {
      tracking = true;
    } else {
      tracking = false;
    }
  }
});
