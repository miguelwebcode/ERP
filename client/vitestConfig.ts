/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import path from "path";

// Que nombre le doy a este archivo? está en el lugar correcto? (/client/viteConfig.ts)
export default defineConfig({
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [react(), viteTsConfigPaths()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    // Yo no uso redux, que me hace falta de aqui?
    alias: [
      {
        find: "react-redux/es/exports",
        replacement: path.resolve(
          __dirname,
          "./node_modules/react-redux/lib/exports"
        ),
      },
    ],
  },
  server: {
    // this ensures that the browser openss upon server start
    open: true,
    // this sets a default port to 3000
    port: 3000,
  },
});
