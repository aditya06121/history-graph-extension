chrome.runtime.onMessage.addListener((message) => {
  const trackingMessage = document.createElement("div");
  trackingMessage.textContent = "This webpage is tracked";
  trackingMessage.style.position = "fixed";
  trackingMessage.style.top = "0";
  trackingMessage.style.left = "0";
  trackingMessage.style.backgroundColor = "red";
  trackingMessage.style.color = "white";
  trackingMessage.style.padding = "10px";
  trackingMessage.style.zIndex = "10000";
  trackingMessage.style.fontSize = "20px";

  document.body.appendChild(trackingMessage);

  setTimeout(() => {
    trackingMessage.remove();
  }, 2000);
});
