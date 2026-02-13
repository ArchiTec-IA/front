import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { Toaster } from "sonner";
import { store } from "./store/index.ts";
import { Provider } from "react-redux";
import { ThemeProvider } from "./providers/theme-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <App />
          <Toaster position="top-right" richColors closeButton theme="dark" />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
