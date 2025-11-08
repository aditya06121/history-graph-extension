import React, { useState, useEffect } from "react";

/* global chrome */

const PopUp = () => {
  const [isTracking, setIsTracking] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    chrome.storage.local.get(["trackingEnabled"], (res) => {
      if (typeof res.trackingEnabled === "boolean") {
        setIsTracking(res.trackingEnabled);
      }
    });
  }, []);

  const handleCheckboxChange = () => {
    const newTrackingState = !isTracking;
    setIsTracking(newTrackingState);
    chrome.runtime.sendMessage({ action: "setTracking", tracking: newTrackingState }, (resp) => {
      if (chrome.runtime.lastError) return;
      if (resp?.ok) setStatus(newTrackingState ? "Tracking enabled" : "Tracking disabled");
      setTimeout(() => setStatus(null), 1500);
    });
  };

  const handleShowGraph = () => {
    const url = chrome.runtime.getURL("graph.html");
    const newTab = window.open(url, "_blank");
    if (!newTab) {
      alert("Failed to open the graph page. Please check your browser settings.");
    }
  };

  return (
    <div className="w-[26rem] bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-xl rounded-2xl p-6 text-center">
      <h1 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">History Graph</h1>
      <p className="text-slate-600 text-sm mb-5 leading-relaxed">
        Visualize your browsing journey for the current session.
      </p>

      <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-3 mb-5">
        <div className="text-left">
          <div className="text-slate-800 font-semibold">Tracking</div>
          <div className="text-slate-500 text-xs">Toggle to start/stop recording</div>
        </div>
        <label className="inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" checked={isTracking} onChange={handleCheckboxChange} />
          <div className={`${isTracking ? "bg-indigo-600" : "bg-slate-300"} relative w-12 h-6 rounded-full transition-colors`}>
            <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${isTracking ? "translate-x-6" : "translate-x-0"}`} />
          </div>
        </label>
      </div>

      {status && <div className="text-xs text-slate-600 mb-3">{status}</div>}

      <button
        onClick={handleShowGraph}
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition duration-200 text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        Open Graph
      </button>

      <p className="text-slate-400 text-[11px] mt-3">If pages don’t show titles immediately, we wait until they finish loading.</p>
    </div>
  );
};

export default PopUp;
