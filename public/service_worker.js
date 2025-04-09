// global variables
let tracking = true;
let tabName = "";
let windowLogs = {};

// tracks the names of the tabs and stuff on tab update if tracking is turned on in popup.js
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tracking) {
    if (changeInfo.title) {
      const currentTitle = tab.title;
      const windowId = tab.windowId;
      if (!windowLogs[windowId]) {
        windowLogs[windowId] = [];
      }

      // Check if the title includes common URL indicators
      const isURLLike = currentTitle.includes("/");

      // Update tabName only if it's new and not URL-like
      if (!isURLLike && currentTitle !== tabName) {
        //simple but smart way if checking the name of prev tab and generating the tree.
        windowLogs[windowId].push({
          title: currentTitle,
          url: tab.url,
          tabId: tabId,
          openerTabId: tab.openerTabId,
        });
        console.log(windowLogs);
        tabName = currentTitle;
      }
    }
  }
});

//listen for messages from the popup for tick conformation
chrome.runtime.onMessage.addListener((message) => {
  if (message.tracking !== undefined) {
    if (message.tracking) {
      tracking = true;
    } else {
      tracking = false;
    }
  }
});

chrome.windows.onCreated.addListener((window) => {
  if (!windowLogs[window.id]) {
    windowLogs[window.id] = [];
  }
});

chrome.windows.onRemoved.addListener((windowId) => {
  delete windowLogs[windowId];
});
