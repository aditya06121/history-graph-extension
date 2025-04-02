import React from "react";
import "../index.css";

const GraphPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-gray-100 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <header className="w-full bg-indigo-600 text-white py-6 shadow-md">
        <h1 className="text-center text-4xl font-extrabold tracking-wide">
          Browsing History Graph
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center mt-8 w-full max-w-4xl bg-white shadow-xl rounded-lg p-8 transform transition-transform duration-300 hover:scale-105">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Your Browsing Activity
        </h2>
        <p className="text-gray-600 text-center mb-6 text-lg">
          Here’s a visualization of your browsing history during this session.
        </p>

        {/* Placeholder for the Graph */}
        <div className="w-full h-80 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md transform transition-transform duration-300 hover:scale-105">
          <p className="text-white text-xl font-semibold">
            📊 Graph Visualization Coming Soon!
          </p>
        </div>

        {/* Action Button */}
        <button className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-300">
          Refresh Data
        </button>
      </main>

      {/* Footer */}
      <footer className="w-full mt-8 text-center text-gray-600">
        <p className="text-sm italic">Built with ❤️. Track responsibly!</p>
      </footer>
    </div>
  );
};

export default GraphPage;
