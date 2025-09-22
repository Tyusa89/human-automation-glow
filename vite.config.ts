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
        target: 'https://pqpudbekfqbzrrbfgwmh.supabase.co/functions/v1/templates',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/templates/, ''),
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxcHVkYmVrZnFienJyYmZnd21oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5NzQ3OTksImV4cCI6MjA0ODU1MDc5OX0.4UJGz3EdgAr8UP8Mi1KRfrWa5PJfLQYjWdJoF7Y__do'
        }
      },
      '/api/scaffold': {
        target: 'https://pqpudbekfqbzrrbfgwmh.supabase.co/functions/v1/scaffold',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/scaffold/, ''),
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxcHVkYmVrZnFienJyYmZnd21oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5NzQ3OTksImV4cCI6MjA0ODU1MDc5OX0.4UJGz3EdgAr8UP8Mi1KRfrWa5PJfLQYjWdJoF7Y__do'
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
