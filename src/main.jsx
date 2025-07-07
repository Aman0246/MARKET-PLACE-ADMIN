import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastProvider } from "./Component/ToastProvider/ToastProvider.jsx";
import { ThemeProvider } from "./contexts/theme/ThemeContext.jsx";
import { Provider } from "react-redux";
import { store } from "./features/store/store.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastProvider>
      <ThemeProvider>
        <Provider store={store}>
        <App />
        </Provider>
      </ThemeProvider>
    </ToastProvider>
  </StrictMode>
);
