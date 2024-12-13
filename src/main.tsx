// import { appWindow } from "@tauri-apps/api/window";
import * as React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

import "./style.css";

// const minimizeButton = document.getElementById("titlebar-minimize");
// if (minimizeButton) {
//   minimizeButton.addEventListener("click", () => appWindow.minimize());
// }

// const maximizeButton = document.getElementById("titlebar-maximize");
// if (maximizeButton) {
//   maximizeButton.addEventListener("click", () => appWindow.toggleMaximize());
// }

// const closeButton = document.getElementById("titlebar-close");
// if (closeButton) {
//   closeButton.addEventListener("click", () => appWindow.close());
// }

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
