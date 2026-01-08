import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://rqldulvkwzvrmcvwttep.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxbGR1bHZrd3p2cm1jdnd0dGVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MzUzMzQsImV4cCI6MjA3MDIxMTMzNH0.rbgipKLn_obCtSP7sKOf-1k40twWwgi2sEesLBJrGNw";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storageKey: "econest-auth",
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});