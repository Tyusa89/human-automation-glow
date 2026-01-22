import { supabase } from "../lib/supabase";

function withTimeout<T>(p: Promise<T>, ms = 1200): Promise<T | null> {
  return new Promise((resolve) => {
    const t = setTimeout(() => resolve(null), ms);
    p.then((v) => {
      clearTimeout(t);
      resolve(v);
    }).catch(() => {
      clearTimeout(t);
      resolve(null);
    });
  });
}

export async function hardSignOut(redirectTo = "/auth") {
  console.log("🔴 Hard sign out triggered");
  console.log("🔄 Attempting Supabase sign out...");

  // Fire signOut, but NEVER wait forever
  await withTimeout(supabase.auth.signOut({ scope: "global" }), 1200);

  console.log("🧹 Clearing storage and forcing redirect...");

  // Clear local artifacts regardless of whether signOut completed
  try {
    // Supabase v2 default storage keys can vary; clear broadly
    localStorage.removeItem("econest-auth");
    localStorage.removeItem("supabase.auth.token");
    localStorage.removeItem("sb-rqldulvkwzvrmcvwttep-auth-token");
    sessionStorage.clear();
  } catch {}

  // Hard redirect (stronger than navigate) — works even when React state is stuck
  window.location.replace(redirectTo);
}

export async function hardReset(redirectTo: string = "/auth") {
  console.log("🔴 Hard reset triggered");

  // 1) Best-effort Supabase sign out WITH TIMEOUT (so we never hang)
  try {
    console.log("🔄 Attempting Supabase sign out...");
    await Promise.race([
      supabase.auth.signOut(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("signOut timeout")), 1500)),
    ]);
    console.log("✅ Supabase sign out done");
  } catch (e) {
    console.warn("⚠️ Supabase sign out failed or timed out (continuing reset)", e);
  }

  // 2) Clear browser storage
  try {
    localStorage.clear();
  } catch (e) {
    console.warn("⚠️ localStorage.clear blocked", e);
  }
  try {
    sessionStorage.clear();
  } catch (e) {
    console.warn("⚠️ sessionStorage.clear blocked", e);
  }

  // 3) Clear IndexedDB (deleteDatabase is event-based; wrap in Promises)
  const deleteDb = (name: string) =>
    new Promise<void>((resolve) => {
      try {
        const req = indexedDB.deleteDatabase(name);
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
        req.onblocked = () => resolve();
      } catch {
        resolve();
      }
    });

  await Promise.all([deleteDb("supabase-db"), deleteDb("supabase")]);

  // 4) Force hard navigation (works even if storage clearing is blocked)
  try {
    window.location.assign(redirectTo);
  } catch {
    window.location.href = redirectTo;
  }
}