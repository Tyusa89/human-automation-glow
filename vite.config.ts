import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api/templates': {
        target: 'https://rqldulvkwzvrmcvwttep.supabase.co/functions/v1/templates',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/templates/, ''),
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxbGR1bHZrd3p2cm1jdnd0dGVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5NzgzMzMsImV4cCI6MjA0ODU1NDMzM30.lu2hZFsEPLrHXPksXqxGR4K5zaIUbJ5bcXQncoh52dQ'
        }
      },
      '/api/scaffold': {
        target: 'https://rqldulvkwzvrmcvwttep.supabase.co/functions/v1/scaffold',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/scaffold/, ''),
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxbGR1bHZrd3p2cm1jdnd0dGVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5NzgzMzMsImV4cCI6MjA0ODU1NDMzM30.lu2hZFsEPLrHXPksXqxGR4K5zaIUbJ5bcXQncoh52dQ'
        }
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
