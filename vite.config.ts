import { fileURLToPath, URL } from "node:url";

import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// Resolves to absolute paths under `src/`. Keep in sync with
// `tsconfig.app.json:paths` — Vite handles runtime resolution while
// tsc handles typechecking, so both need the same alias set or you
// hit a "tsc passes / Vite throws on dev" footgun.
const fromSrc = (sub: string): string =>
  fileURLToPath(new URL(`./src/${sub}`, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fromSrc(""),
      "@shared": fromSrc("shared"),
      "@features": fromSrc("features"),
      "@config": fromSrc("config"),
      "@context": fromSrc("context"),
      "@layouts": fromSrc("layouts"),
      "@routes": fromSrc("routes"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  build: {
    // Vendor chunking — without this every lazy-loaded route bundles
    // its own copy of React/Router/framer-motion/recharts (the latter
    // two are heavy: ~80KB and ~150KB minified). Splitting them into
    // long-lived vendor chunks lets the browser cache them across
    // route navigations and reduces the main-route payload.
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          motion: ["framer-motion"],
          charts: ["recharts"],
          icons: ["@heroicons/react"],
        },
      },
    },
  },
});
