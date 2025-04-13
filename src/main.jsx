import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { LevelProvider } from "./contexts/LevelContext";
import { LocaleProvider } from "./contexts/LocaleContext";
import { Analytics } from "@vercel/analytics/react"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LocaleProvider>
      <LevelProvider>
        <App />
      </LevelProvider>
    </LocaleProvider>
  </React.StrictMode>
);
