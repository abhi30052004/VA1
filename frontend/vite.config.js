import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Basic Vite config for local development.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
});
