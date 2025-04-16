import React, { useState, useEffect } from "react";
import "../index.css";
import Graph from "./Graph.jsx";
import edgeCreator from "../edgeCreator.js";

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
  const logs = edgeCreator(windowLogs);

  return (
    <>
      <div className="h-screen flex flex-col">
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

        <main className="flex-1 overflow-hidden">
          <Graph logs={logs} />
        </main>

        {/* Footer*/}
        <footer className="bg-gradient-to-r from-gray-600 to-gray-100 shadow-inner">
          <div className="max-w-3xl mx-auto px-4 py-2 flex justify-between items-center text-sm text-gray-700">
            <span>Made with ❤️ by Aditya</span>
            <div className="flex space-x-4">
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/aditya-raj-904a93272/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                >
                  <path
                    d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 
                   0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 
                   0-1.75-.79-1.75-1.75s.79-1.75 
                   1.75-1.75 1.75.79 1.75 1.75-.79 
                   1.75-1.75 1.75zm13.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.88 
                   0-2.17 1.47-2.17 2.98v5.69h-3v-10h2.88v1.36h.04c.4-.76 
                   1.36-1.56 2.8-1.56 2.99 0 3.54 1.97 3.54 
                   4.53v5.67z"
                  />
                </svg>
              </a>
              {/* GitHub */}
              <a
                href="https://github.com/aditya06121"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                >
                  <path
                    d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.43 7.9 10.96.58.11.79-.25.79-.56 
                   0-.28-.01-1.02-.01-2-3.21.7-3.89-1.55-3.89-1.55-.53-1.34-1.3-1.7-1.3-1.7-1.06-.73.08-.72.08-.72 
                   1.18.08 1.8 1.21 1.8 1.21 1.04 1.78 2.74 1.26 3.41.96.11-.76.41-1.26.75-1.55-2.56-.29-5.26-1.28-5.26-5.72 
                   0-1.26.45-2.29 1.2-3.1-.12-.3-.52-1.51.11-3.14 
                   0 0 .98-.31 3.2 1.19.93-.26 1.92-.39 2.91-.4.99.01 1.98.14 
                   2.91.4 2.22-1.5 3.2-1.19 3.2-1.19.63 1.63.23 2.84.11 3.14.75.81 
                   1.2 1.84 1.2 3.1 0 4.45-2.7 5.43-5.28 5.71.42.36.8 1.1.8 2.22 
                   0 1.6-.01 2.89-.01 3.29 0 .31.21.68.8.56C20.7 21.43 24 17.1 
                   24 12c0-6.35-5.15-11.5-12-11.5z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default GraphPage;
