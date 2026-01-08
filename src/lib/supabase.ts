import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// HMR-safe singleton pattern to prevent "Multiple GoTrueClient instances" warning
const globalForSupabase = globalThis as unknown as {
  __supabase?: ReturnType<typeof createClient>;
};

export const supabase =
  globalForSupabase.__supabase ??
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storageKey: "econest-auth",
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

// Store the client globally to prevent recreation during HMR
globalForSupabase.__supabase = supabase;
