import { createClient } from "@supabase/supabase-js";

// Try all likely Lovable + Vite env names
const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  (import.meta.env.VITE_PUBLIC_SUPABASE_URL as string) ||
  "";

const SUPABASE_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) ||
  (import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY as string) ||
  (import.meta.env.VITE_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string) ||
  "";

// Hard stop with a readable error (avoids "supabaseUrl is required" crash)
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("[SUPABASE] Missing env vars", {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_PUBLIC_SUPABASE_URL: import.meta.env.VITE_PUBLIC_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    VITE_PUBLIC_SUPABASE_ANON_KEY: import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY,
    VITE_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      import.meta.env.VITE_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });

  throw new Error(
    "Supabase env missing: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or one of the supported VITE_PUBLIC_* variants)."
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
