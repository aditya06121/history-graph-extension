import React, { useState, useEffect } from "react";
import "../index.css";

function GraphPage() {
  const [windowLogs, setWindowLogs] = useState(null);
  useEffect(() => {
    let currentWindowId = null;
    chrome.windows.getCurrent((currentWindow) => {
      currentWindowId = currentWindow.id;

      // Retrieve all window logs from chrome storage
      chrome.storage.local.get(["windowLogs"], (result) => {
        if (result.windowLogs) {
          // Filter the logs to only get the logs for the current window
          const currentWindowLogs = result.windowLogs[currentWindowId];
          if (currentWindowLogs) {
            setWindowLogs(currentWindowLogs);
          } else {
            setWindowLogs([]);
          }
        } else {
          setWindowLogs([]);
        }
      });
    });

    // Listen for changes to windowLogs in chrome storage
    const storageChangeListener = (changes, areaName) => {
      if (areaName === "local" && changes.windowLogs) {
        // When windowLogs change, we might need to filter it again
        const updatedLogs = changes.windowLogs.newValue;
        if (currentWindowId !== null) {
          setWindowLogs(updatedLogs[currentWindowId] || []);
        }
      }
    };
    chrome.storage.onChanged.addListener(storageChangeListener);

    // Cleanup listener on component unmount
    return () => {
      chrome.storage.onChanged.removeListener(storageChangeListener);
    };
  }, []);

  // Render logs for the current window
  const renderLogs = () => {
    if (!windowLogs) {
      return <div>Loading...</div>;
    }

    if (windowLogs.length === 0) {
      return <div>No logs available for the current window.</div>;
    }

    return windowLogs.map((log, index) => (
      <div key={index} className="tab-item">
        <strong>{log.title}</strong> <italic>tabID:{log.tabId}</italic>
        <br />
        <italic>Opener tab id:{log.openerTabId}</italic>
        <br />
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-5xl font-semibold text-gray-900 text-center pt-16 pb-4">
        Browsing Graph
      </h1>

      {/* Display logs for the current window */}
      <div className="mt-8 px-4">
        <div className="mt-4">{renderLogs()}</div>
      </div>
    </div>
  );
}

export default GraphPage;
