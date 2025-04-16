// global variables
let tracking = true;
let tabNames = {}; // Maps tabId to tabName
let windowLogs = {};

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(["windowLogs"], (result) => {
    if (result.windowLogs) {
      windowLogs = result.windowLogs;
    }
  });
});

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
      const isURLLike2 =
        tab.url.includes("http:") || tab.url.includes("https:");

      // Update tabName only if it's new and not URL-like
      if (!isURLLike && currentTitle !== tabNames[tabId] && isURLLike2) {
        // Simple but smart way of checking the name of the previous tab and generating the tree.
        windowLogs[windowId].push({
          title: currentTitle,
          url: tab.url,
          tabId: tabId,
          openerTabId: tab.openerTabId,
        });
        tabNames[tabId] = currentTitle; // Update the tabName for this tabId
        chrome.storage.local.set({ windowLogs: windowLogs });
        console.log(windowLogs);
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
    chrome.storage.local.set({ windowLogs: windowLogs });
  }
});

chrome.windows.onRemoved.addListener((windowId) => {
  delete windowLogs[windowId];
  chrome.storage.local.set({ windowLogs: windowLogs });
});
