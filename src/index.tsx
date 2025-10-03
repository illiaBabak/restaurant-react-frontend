import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import { App } from "./root";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const rootEl = document.getElementById("root");

const queryClient = new QueryClient();

if (rootEl) {
  const root = createRoot(rootEl);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>
  );
}
