import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { AlertProvider } from "./contexts/AlertContext.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <ThemeProvider>
        <AuthProvider>
          <AlertProvider>
            <App />
          </AlertProvider>
        </AuthProvider>
      </ThemeProvider>
    </StrictMode>
  </BrowserRouter>,
);
