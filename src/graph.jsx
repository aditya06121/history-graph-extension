import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import GraphPage from "./components/GraphPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GraphPage />
  </StrictMode>
);
