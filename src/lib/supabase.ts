import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables: VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY');
}

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
      storageKey: "econest-auth",
    },
  });

// Store the client globally to prevent recreation during HMR
globalForSupabase.__supabase = supabase;