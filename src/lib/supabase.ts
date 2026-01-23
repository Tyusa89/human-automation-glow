import { createClient, SupabaseClient } from "@supabase/supabase-js";


const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ?? "https://YOUR_PROJECT.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? "YOUR_ANON_KEY";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase env vars (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)");
}

declare global {
  // eslint-disable-next-line no-var
  var __econest_supabase__: SupabaseClient | undefined;
}

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

console.log("[SUPABASE] instance", globalThis.__econest_supabase__ ? "reused" : "new");
