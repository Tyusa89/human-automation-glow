import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }: { mode: string }) => ({
  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "./src") },
      { find: "@", replacement: path.resolve(__dirname, "./srcsetupTeststs") }
    ],
  },
  test: {
  globals: true,
  environment: "jsdom",
  setupFiles: "./src/setupTests.ts",
    include: [
      "srcsetupTeststs/src/__tests__/**/*.test.{ts,tsx,js,jsx}",
      "src/__tests__/**/*.test.{ts,tsx,js,jsx}",
      "srcsetupTeststs/components/__tests__/**/*.test.{ts,tsx,js,jsx}"
    ]
  },
}));
// ...existing code...

