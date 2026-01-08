import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

// Lovable does not support Vite env vars at runtime; use the project constants instead.
// This is a public (anon) key and safe to ship in the frontend.
const supabaseUrl = "https://rqldulvkwzvrmcvwttep.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxbGR1bHZrd3p2cm1jdnd0dGVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MzUzMzQsImV4cCI6MjA3MDIxMTMzNH0.rbgipKLn_obCtSP7sKOf-1k40twWwgi2sEesLBJrGNw";

// HMR-safe singleton pattern to prevent "Multiple GoTrueClient instances" warning
const globalForSupabase = globalThis as unknown as {
  __supabase?: ReturnType<typeof createClient<Database>>;
};

export const supabase =
  globalForSupabase.__supabase ??
  createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      storageKey: "econest-auth",
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

// Store the client globally to prevent recreation during HMR
globalForSupabase.__supabase = supabase;
