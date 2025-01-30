import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
    include: [
      "**/?(*.)+(vitest.test).[jt]s?(x)", // Busca archivos con sufijo .vitest.test.ts o .vitest.test.tsx
    ],
  },
});
