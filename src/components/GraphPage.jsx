import React, { useState, useEffect } from "react";
import "../index.css";

function GraphPage() {
  const [windowLogs, setWindowLogs] = useState(null); // State to hold the logs for the current window
  // Fetch windowLogs from chrome.storage.local when the component mounts
  useEffect(() => {
    let currentWindowId = null; // Declare a variable to store the current window ID

    // Get the current window
    chrome.windows.getCurrent({ populate: true }, (currentWindow) => {
      currentWindowId = currentWindow.id; // Assign the current window ID to the variable

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
  }, []); // Empty dependency array means it only runs on mount and unmount

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
        <strong>{log.title}</strong> (URL:{" "}
        <a href={log.url} target="_blank" rel="noopener noreferrer">
          {log.url}
        </a>
        )
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 text-center pt-8">
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
