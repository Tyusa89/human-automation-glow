import { createClient, SupabaseClient } from "@supabase/supabase-js";



const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ?? "https://rqldulvkwzvrmcvwttep.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? "PASTE_YOUR_REAL_ANON_KEY_HERE";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase env vars (eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxbGR1bHZrd3p2cm1jdnd0dGVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExOTI1OTMsImV4cCI6MjA3Njc2ODU5M30._yLYTkxlGHpO-qZzEfLwKHBOp6rXDsDJlzVmuSIDhJs)");
}


declare global {
  // eslint-disable-next-line no-var
  var __econest_supabase__: SupabaseClient | undefined;
}

const reused = !!globalThis.__econest_supabase__;
export const supabase =
  globalThis.__econest_supabase__ ??
  (globalThis.__econest_supabase__ = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storageKey: "econest-auth",
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }));

console.log("[SUPABASE] instance", reused ? "reused" : "new");
