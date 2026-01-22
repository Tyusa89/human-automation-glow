import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

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
