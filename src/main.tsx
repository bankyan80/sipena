import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const isProd = import.meta.env.MODE === "production";

// Register Service Worker for genuine Progressive Web App (PWA) capabilities
if ("serviceWorker" in navigator && isProd) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SIPENA SW registered on scope: ", registration.scope);
      })
      .catch((error) => {
        console.error("SIPENA SW registration failure: ", error);
      });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
