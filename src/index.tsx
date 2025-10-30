import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./root";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.scss";
import { BrowserRouter } from "react-router-dom";

const rootEl = document.getElementById("root");

const queryClient = new QueryClient();

if (rootEl) {
  const root = createRoot(rootEl);
  root.render(
    <StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    </StrictMode>
  );
}
