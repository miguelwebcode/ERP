import { defineConfig } from "vitest/config";
import { readFileSync, existsSync } from 'fs';

// Read skiplist and generate exclude patterns
function getExcludePatterns() {
  const SKIPLIST_FILE = '.vitest-skiplist.txt';
  
  if (!existsSync(SKIPLIST_FILE)) {
    return [];
  }
  
  try {
    const content = readFileSync(SKIPLIST_FILE, 'utf-8');
    const lines = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'));
    
    // Convert file paths to glob patterns for exclusion
    return lines.map(path => `**/${path}`);
  } catch (error) {
    console.warn('Warning: Could not read skiplist file:', error.message);
    return [];
  }
}

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: [
      "**/?(*.)+(vitest.test).[jt]s?(x)", // Busca archivos con sufijo .vitest.test.ts o .vitest.test.tsx
    ],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress}.config.*",
      ...getExcludePatterns() // Dynamically exclude files from skiplist
    ],
  },
});
