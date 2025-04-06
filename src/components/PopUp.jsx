import React, { useState } from "react";

const PopUp = () => {
  const [isTracking, setIsTracking] = useState(true);

  const handleCheckboxChange = () => {
    const newTrackingState = !isTracking;
    setIsTracking(newTrackingState);

    // Send the updated state to the service worker
    chrome.runtime.sendMessage({ tracking: newTrackingState });
  };

  const handleShowGraph = () => {
    const newTab = window.open("../../graph.html", "_blank");
    if (!newTab) {
      alert(
        "Failed to open the graph page. Please check your browser settings."
      );
    }
  };

  return (
    <div className="bg-white shadow-lg p-6 w-96 text-center border border-gray-200">
      <h1 className="text-3xl font-extrabold text-indigo-600 mb-4">
        History Graph
      </h1>
      <p className="text-gray-600 text-md mb-6 leading-relaxed">
        This extension generates a graph showing the websites you have visited
        in this active session. Track and visualize your browsing habits!
      </p>
      <p className="text-gray-600 text-md mb-6 leading-relaxed">
        refresh the page to start tracking!
      </p>

      <div className="flex items-center space-x-3 mb-5 justify-center">
        <input
          type="checkbox"
          id="startTracking"
          checked={isTracking}
          onChange={handleCheckboxChange}
          className="h-5 w-5 text-indigo-600 border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 transition duration-300"
        />
        <label
          htmlFor="startTracking"
          className="text-gray-700 text-lg font-medium"
        >
          Start Tracking
        </label>
      </div>

      <button
        onClick={handleShowGraph}
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition duration-300 text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        Show Graph
      </button>
    </div>
  );
};

export default PopUp;
