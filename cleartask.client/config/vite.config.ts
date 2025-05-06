import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import path from "path"; // ✅ Required for resolving paths
import { resolve } from "path";



export default defineConfig({
  plugins: [react()],
  envDir: "./env",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@services": path.resolve(__dirname, "./src/services"),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  build: {
    outDir: "dist",
    // rollupOptions: {
    //   input: resolve(__dirname, "./public/index.html"),
    // },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target:
          process.env.NODE_ENV === "production"
            ? "http://nammaweb.live"
            : "http://localhost:5076",
        changeOrigin: true,
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  preview: {
    port: 4173,
    host: true,
  },
});
