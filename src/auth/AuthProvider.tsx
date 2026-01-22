import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";

type Profile = {
  user_id: string | null;
  email: string;
  full_name: string | null;
  company: string | null;
  assistant_level: string | null;
  business_type: string | null;
  client_volume: string | null;
} | null;

type AuthCtx = {
  ready: boolean;
  user: User | null;
  profile: Profile;
  isOwner: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

// Optional: toggle in .env for local dev if you ever want a bypass
const DEV_OWNER_BYPASS = import.meta.env.VITE_DEV_OWNER_BYPASS === "true";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile>(null);
  const [isOwner, setIsOwner] = useState(false);

  // StrictMode/dev safe guards
  const didInit = useRef(false);
  const lastCheckedUserId = useRef<string | null>(null);
  const ownerCache = useRef<Map<string, boolean>>(new Map());

  // Used to ignore stale async results when user changes rapidly
  const authVersion = useRef(0);

  async function loadProfile(u: User | null, version: number) {
    if (!u) {
      setProfile(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id,email,full_name,company,assistant_level,business_type,client_volume")
        .eq("user_id", u.id)
        .maybeSingle();

      if (version !== authVersion.current) return; // ignore stale
      if (error) throw error;

      setProfile(data ?? null);
    } catch (error) {
      if (version !== authVersion.current) return;
      console.error("Error loading profile:", error);
      setProfile(null);
    }
  }

  async function checkIsOwner(u: User | null, version: number): Promise<boolean> {
    if (!u) return false;

    if (DEV_OWNER_BYPASS) return true;

    // Cache per user id to prevent repeated calls
    const cached = ownerCache.current.get(u.id);
    if (cached !== undefined) return cached;

    console.log("🔍 Checking owner status for user:", u.id);

    try {
      // Preferred: RPC
      const { data, error } = await supabase.rpc("is_owner");
      if (!error) {
        const result = Boolean(data);
        ownerCache.current.set(u.id, result);
        if (version === authVersion.current) console.log("RPC is_owner result:", result);
        return result;
      }

      console.warn("RPC is_owner not available, using fallback:", error.message);

      // Fallback #1: user_roles table (this matches your screenshot)
      const { data: roleRow, error: roleErr } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.id)
        .maybeSingle();

      if (!roleErr && roleRow?.role) {
        const result = roleRow.role === "owner";
        ownerCache.current.set(u.id, result);
        return result;
      }



      // If we can’t determine, default to false (safe)
      ownerCache.current.set(u.id, false);
      return false;
    } catch (error) {
      console.error("Error in owner check:", error);
      // Safe default: false. (Don’t grant access on error.)
      ownerCache.current.set(u.id, false);
      return false;
    }
  }

  async function applyAuthState(u: User | null) {
    // increment version so any in-flight calls become stale
    authVersion.current += 1;
    const version = authVersion.current;

    setUser(u);

    if (!u) {
      setProfile(null);
      setIsOwner(false);
      lastCheckedUserId.current = null;
      return;
    }

    // Start profile load (async)
    void loadProfile(u, version);

    // Owner check: run once per user id, with cache
    if (lastCheckedUserId.current !== u.id) {
      lastCheckedUserId.current = u.id;
      const ownerStatus = await checkIsOwner(u, version);
      if (version === authVersion.current) setIsOwner(ownerStatus);
    } else {
      // still set from cache if present
      const cached = ownerCache.current.get(u.id);
      if (cached !== undefined) setIsOwner(cached);
    }
  }

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    let alive = true;

    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        console.log("[AUTH] getSession()", {
          error: error?.message ?? null,
          hasSession: !!data.session,
          userId: data.session?.user?.id ?? null,
        });

        if (!alive) return;
        await applyAuthState(data.session?.user ?? null);
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        if (alive) setReady(true);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[AUTH] onAuthStateChange", {
        event,
        hasSession: !!session,
        userId: session?.user?.id ?? null,
        expiresAt: session?.expires_at ?? null,
      });

      const keys = Object.keys(localStorage).filter((k) =>
        k.includes("econest") || k.includes("sb-") || k.includes("supabase") || k.includes("auth")
      );
      console.log("[AUTH] storage keys", keys);

      void applyAuthState(session?.user ?? null);
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({
      ready,
      user,
      profile,
      isOwner,
      refreshProfile: async () => {
        if (!user) return;
        const version = authVersion.current; // don’t bump version on refresh
        await loadProfile(user, version);

        // Re-check owner (uses cache unless you want to force refresh)
        const ownerStatus = await checkIsOwner(user, version);
        if (version === authVersion.current) setIsOwner(ownerStatus);
      },
      signOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    [ready, user, profile, isOwner]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside <AuthProvider />");
  return v;
}
