chrome.webNavigation.onCompleted.addListener((details) => {
  hasShownPrompt = true;
  const url = details.url;

  // Send a message to the content script
  chrome.tabs.sendMessage(details.tabId, { url: url });
});
