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
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxbGR1bHZrd3p2cm1jdnd0dGVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExOTI1OTMsImV4cCI6MjA3Njc2ODU5M30._yLYTkxlGHpO-qZzEfLwKHBOp6rXDsDJlzVmuSIDhJs'
        }
      },
      '/api/scaffold': {
        target: 'https://rqldulvkwzvrmcvwttep.supabase.co/functions/v1/scaffold',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/scaffold/, ''),
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxbGR1bHZrd3p2cm1jdnd0dGVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExOTI1OTMsImV4cCI6MjA3Njc2ODU5M30._yLYTkxlGHpO-qZzEfLwKHBOp6rXDsDJlzVmuSIDhJs'
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
