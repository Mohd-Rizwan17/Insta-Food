import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import.meta.env.VITE_API_BASE_URL;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
