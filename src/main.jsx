import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import PopUp from "./components/PopUp.jsx";
import GraphPage from "./components/GraphPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<PopUp />} />
        <Route path="/graph" element={<GraphPage />} />
      </Routes>
    </HashRouter>
  </StrictMode>
);
