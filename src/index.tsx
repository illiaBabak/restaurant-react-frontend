import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./root";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.scss";

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
