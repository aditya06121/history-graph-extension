import React, { useState, useEffect } from "react";
import "../index.css";
import Graph from "./Graph.jsx";

/* global chrome */

function Legend() {
  const items = [
    { label: 'typed', color: '#16a34a' },
    { label: 'link', color: '#2563eb' },
    { label: 'history', color: '#a855f7' },
    { label: 'reload', color: '#6b7280' },
  ];
  return (
    <div className="flex items-center space-x-4">
      {items.map((it) => (
        <div key={it.label} className="flex items-center space-x-2 text-sm text-gray-700">
          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: it.color }} />
          <span>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

function GraphPage() {
  const [graphData, setGraphData] = useState({ nodes: {}, edges: [] });

  useEffect(() => {
    let currentWindowId = null;
    let storageChangeListener = null;
    let mounted = true;

    chrome.windows.getCurrent((currentWindow) => {
      if (!mounted) return;
      currentWindowId = currentWindow.id;

      const fetchGraphData = () => {
        chrome.storage.local.get([`graph_${currentWindowId}`], (result) => {
          if (!mounted) return;
          const windowGraph = result[`graph_${currentWindowId}`];
          if (windowGraph) setGraphData(windowGraph);
        });
      };

      fetchGraphData();

      storageChangeListener = (changes, areaName) => {
        if (!mounted) return;
        if (areaName === "local" && changes[`graph_${currentWindowId}`]) {
          setGraphData(changes[`graph_${currentWindowId}`].newValue);
        }
      };

      chrome.storage.onChanged.addListener(storageChangeListener);
    });

    return () => {
      mounted = false;
      if (storageChangeListener) {
        chrome.storage.onChanged.removeListener(storageChangeListener);
      }
    };
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-100 via-blue-100 to-cyan-100 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight text-center">Browsing Graph</h1>
          <p className="mt-1 text-center text-slate-600">Visualize your browsing journey</p>
        </div>
      </header>

      {/* Toolbar */}
      <div className="bg-white/70 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
          <Legend />
          <div className="text-xs text-slate-600">Nodes are color-coded by domain</div>
        </div>
      </div>

      <main className="flex-1 overflow-hidden">
        <Graph graphData={graphData} />
      </main>

      {/* Footer*/}
      <footer className="bg-gradient-to-r from-cyan-100 via-blue-100 to-indigo-100">
        <div className="max-w-6xl mx-auto px-4 py-2 flex justify-between items-center text-sm text-slate-700">
          <span>Made by Aditya</span>
          <div className="flex space-x-4">
            <a href="https://www.linkedin.com/in/aditya-raj-904a93272/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.79-1.75 1.75-1.75 1.75.79 1.75 1.75-.79 1.75-1.75 1.75zm13.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.88 0-2.17 1.47-2.17 2.98v5.69h-3v-10h2.88v1.36h.04c.4-.76 1.36-1.56 2.8-1.56 2.99 0 3.54 1.97 3.54 4.53v5.67z" /></svg>
            </a>
            <a href="https://github.com/aditya06121" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.43 7.9 10.96.58.11.79-.25.79-.56 0-.28-.01-1.02-.01-2-3.21.7-3.89-1.55-3.89-1.55-.53-1.34-1.3-1.7-1.3-1.7-1.06-.73.08-.72.08-.72 1.18.08 1.8 1.21 1.8 1.21 1.04 1.78 2.74 1.26 3.41.96.11-.76.41-1.26.75-1.55-2.56-.29-5.26-1.28-5.26-5.72 0-1.26.45-2.29 1.2-3.1-.12-.3-.52-1.51.11-3.14 0 0 .98-.31 3.2 1.19.93-.26 1.92-.39 2.91-.4.99.01 1.98.14 2.91.4 2.22-1.5 3.2-1.19 3.2-1.19.63 1.63.23 2.84.11 3.14.75.81 1.2 1.84 1.2 3.1 0 4.45-2.7 5.43-5.28 5.71.42.36.8 1.1.8 2.22 0 1.6-.01 2.89-.01 3.29 0 .31.21.68.8.56C20.7 21.43 24 17.1 24 12c0-6.35-5.15-11.5-12-11.5z" /></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default GraphPage;
