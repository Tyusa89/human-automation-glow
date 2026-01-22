import { createClient } from "@supabase/supabase-js";

// Prefer env vars, fallback to hardcoded (prevents Lovable blank-screen)
const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  "https://rqlldulvkwzvrmcvwttep.supabase.co";

const SUPABASE_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) ||
  ""; // guard below

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("[SUPABASE] Missing config", {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  });
  throw new Error(
    "Supabase env missing: need VITE_SUPABASE_URL and (VITE_SUPABASE_ANON_KEY or VITE_SUPABASE_PUBLISHABLE_KEY)."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storageKey: "econest-auth",
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
