// MV3 service worker

// In-memory last URL and title per tab for same-tab edges
const lastUrlByTab = {};
const lastTitleByTab = {};

// Only track real webpages (http/https)
function isTrackableUrl(url) {
  return typeof url === "string" && /^https?:\/\//i.test(url);
}

// Initialize a window graph if missing
function initWindowGraph(windowId) {
  chrome.storage.local.get([`graph_${windowId}`], (res) => {
    if (!res[`graph_${windowId}`]) {
      const graph = { windowId, created: Date.now(), nodes: {}, edges: [] };
      chrome.storage.local.set({ [`graph_${windowId}`]: graph }, () => {
        console.log(`[STORAGE] init graph for window ${windowId}`);
      });
    } else {
      console.log(`[STORAGE] graph exists for window ${windowId}`);
    }
  });
}

// Save node/edge into per-window storage
function saveEdge(windowId, edge) {
  chrome.storage.local.get([`graph_${windowId}`], (res) => {
    let graph = res[`graph_${windowId}`] || {
      windowId,
      created: Date.now(),
      nodes: {},
      edges: [],
    };
    const ts = Date.now();

    // Do not log edges to non-trackable destinations
    if (!isTrackableUrl(edge.targetUrl)) return;
    // If source is non-trackable, treat it as null (start node)
    if (edge.sourceUrl && !isTrackableUrl(edge.sourceUrl)) {
      edge = { ...edge, sourceUrl: null, sourceTitle: null };
    }

    // Ensure nodes exist keyed by URL and update title if provided
    const ensureNode = (url, title) => {
      if (!url || !isTrackableUrl(url)) return;
      if (!graph.nodes[url]) {
        graph.nodes[url] = {
          url,
          title: title || null,
          createdAt: ts,
          lastVisited: ts,
          visitCount: 1,
        };
        console.log(`[NODE] create ${url}`);
      } else {
        graph.nodes[url].lastVisited = ts;
        graph.nodes[url].visitCount = (graph.nodes[url].visitCount || 0) + 1;
        if (title && graph.nodes[url].title !== title) {
          graph.nodes[url].title = title;
        }
        console.log(
          `[NODE] update ${url} → visits ${graph.nodes[url].visitCount}`
        );
      }
    };

    ensureNode(edge.sourceUrl, edge.sourceTitle);
    ensureNode(edge.targetUrl, edge.targetTitle);
    graph.edges.push({ ...edge, timestamp: ts });
    chrome.storage.local.set({ [`graph_${windowId}`]: graph }, () => {
      console.log(
        `[EDGE] ${edge.sameTab ? "same-tab" : "inter-tab"} ${
          edge.sourceUrl || "∅"
        } → ${edge.targetUrl} (${edge.type || "unknown"})`
      );
      console.log(
        `[STORAGE] window ${windowId}: nodes ${
          Object.keys(graph.nodes).length
        }, edges ${graph.edges.length}`
      );
    });
  });
}

// Helper: update a node's title when we learn it later
function updateNodeTitle(windowId, url, title) {
  if (!url || !title) return;
  chrome.storage.local.get([`graph_${windowId}`], (res) => {
    const graph = res[`graph_${windowId}`];
    if (!graph) return;
    if (!graph.nodes[url]) return;
    if (graph.nodes[url].title === title) return;
    graph.nodes[url].title = title;
    chrome.storage.local.set({ [`graph_${windowId}`]: graph });
  });
}

// Window lifecycle
chrome.windows.onCreated.addListener((win) => {
  console.log(`[WINDOW] created ${win.id}`);
  initWindowGraph(win.id);
});

chrome.windows.onRemoved.addListener((windowId) => {
  console.log(`[WINDOW] removed ${windowId}`);
  // Optional: keep graph for later; comment out next line if you want persistence across sessions
  // chrome.storage.local.remove([`graph_${windowId}`]);
});

// Tab created: inter-tab edges via openerTabId
chrome.tabs.onCreated.addListener((tab) => {
  console.log(
    `[TAB] created id=${tab.id} win=${tab.windowId} opener=${
      tab.openerTabId ?? "none"
    }`
  );
  initWindowGraph(tab.windowId);
  if (tab.openerTabId) {
    chrome.tabs.get(tab.openerTabId, (opener) => {
      if (chrome.runtime.lastError) {
        console.warn(
          `[TAB] opener fetch error: ${chrome.runtime.lastError.message}`
        );
        return;
      }
      const sourceUrl = isTrackableUrl(opener.url) ? opener.url : null;
      const targetUrlRaw = tab.pendingUrl || tab.url || "";
      // Only create inter-tab edge when we know the destination URL (http/https)
      if (!isTrackableUrl(targetUrlRaw)) return;
      const targetUrl = targetUrlRaw;
      const sourceTitle = opener.title || null;
      const targetTitle = tab.title || null;
      saveEdge(tab.windowId, {
        sourceUrl,
        targetUrl,
        sourceTitle,
        targetTitle,
        sourceTabId: tab.openerTabId,
        targetTabId: tab.id,
        type: "link",
        sameTab: false,
      });
    });
  }
});

// Main-frame navigations: same-tab edges with transition metadata
chrome.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId !== 0) return; // main frame only
  if (!isTrackableUrl(details.url)) return; // ignore about:blank, chrome://, extension pages, etc.

  chrome.tabs.get(details.tabId, (tab) => {
    if (chrome.runtime.lastError) {
      console.warn(`[NAV] tabs.get error: ${chrome.runtime.lastError.message}`);
      return;
    }
    initWindowGraph(tab.windowId);
    const targetUrl = details.url;
    const targetTitle = tab.title || null;
    const sourceUrl = lastUrlByTab[details.tabId] || null;
    const sourceTitle = lastTitleByTab[details.tabId] || null;
    const sameTab = true;

    // Create edge only if a real change occurred
    if (sourceUrl && sourceUrl !== targetUrl) {
      saveEdge(tab.windowId, {
        sourceUrl,
        targetUrl,
        sourceTitle,
        targetTitle,
        sourceTabId: details.tabId,
        targetTabId: details.tabId,
        type: details.transitionType, // e.g., "typed", "link", "reload"
        transitionQualifiers: details.transitionQualifiers || [],
        sameTab,
      });
    } else {
      // No previous URL; record node touch
      saveEdge(tab.windowId, {
        sourceUrl: null,
        targetUrl,
        sourceTitle: null,
        targetTitle,
        sourceTabId: null,
        targetTabId: details.tabId,
        type: details.transitionType,
        transitionQualifiers: details.transitionQualifiers || [],
        sameTab: false,
      });
    }

    // Update last URL/title for this tab (only for trackable urls)
    lastUrlByTab[details.tabId] = targetUrl;
    lastTitleByTab[details.tabId] = targetTitle || null;

    // Ensure node title is up to date
    updateNodeTitle(tab.windowId, targetUrl, targetTitle);

    console.log(
      `[NAV] tab ${details.tabId} ${sourceUrl || "∅"} → ${targetUrl} (${details.transitionType})`
    );
  });
});

// Update node titles when the tab title becomes available/changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!changeInfo.title) return;
  if (!tab || !tab.url || !isTrackableUrl(tab.url)) return;
  lastTitleByTab[tabId] = changeInfo.title;
  updateNodeTitle(tab.windowId, tab.url, changeInfo.title);
});

// Optional: initialize existing windows/tabs on startup
chrome.runtime.onStartup.addListener(() => {
  console.log("[STARTUP] initializing graphs for current windows");
  chrome.windows.getAll({}, (wins) => wins.forEach((w) => initWindowGraph(w.id)));
});

// Optional: toggle tracking via messages (hook your popup)
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.action === "getGraph" && msg.windowId) {
    chrome.storage.local.get([`graph_${msg.windowId}`], (res) => {
      sendResponse(res[`graph_${msg.windowId}`] || null);
    });
    return true;
  }
});
