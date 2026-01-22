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
  "";

// ✅ HARD STOP with a clear message instead of Supabase crashing
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("[SUPABASE] Missing env vars", {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_PUBLIC_SUPABASE_URL: import.meta.env.VITE_PUBLIC_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    VITE_PUBLIC_SUPABASE_ANON_KEY: import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY,
  });

  // Show a readable error in the UI rather than blank screen
  throw new Error(
    "Supabase config missing in Lovable preview. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or PUBLISHABLE_KEY)."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
