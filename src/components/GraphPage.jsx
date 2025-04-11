import React, { useState, useEffect } from "react";
import "../index.css";
import Graph from "./Graph.jsx";

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

  return (
    <>
      {/* Header with minimalist gray gradient */}
      <header className="bg-gradient-to-r from-gray-100 to-gray-600 shadow-sm">
        <div className="max-w-3xl mx-auto px-1.5 py-2">
          <h1 className="text-5xl font-extrabold text-gray-800 text-center tracking-tight">
            Browsing Graph
          </h1>
          <p className="mt-2 text-center text-lg text-gray-600">
            Visualize your browsing data beautifully ✨
          </p>
        </div>
      </header>

      <Graph logs={windowLogs} />
    </>
  );
}

export default GraphPage;
