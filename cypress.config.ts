import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },

  e2e: {
    baseUrl: "https://restaurant-react-frontend-weld.vercel.app/",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
