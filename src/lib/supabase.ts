import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// HMR-safe singleton pattern to prevent "Multiple GoTrueClient instances" warning
const globalForSupabase = globalThis as unknown as { 
  __supabase?: ReturnType<typeof createClient<Database>> 
};

export const supabase =
  globalForSupabase.__supabase ??
  createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "econest-auth", // important: consistent key
    },
  });

// Store the client globally to prevent recreation during HMR
globalForSupabase.__supabase = supabase;