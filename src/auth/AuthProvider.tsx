import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
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
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile>(null);
  const [isOwner, setIsOwner] = useState(false);

  async function loadProfile(u: User | null) {
    if (!u) {
      setProfile(null);
      return;
    }
    try {
      const { data } = await supabase
        .from("profiles")
        .select("user_id,email,full_name,company,assistant_level,business_type,client_volume")
        .eq("user_id", u.id)
        .maybeSingle();

      setProfile(data ?? null);
    } catch (error) {
      console.error("Error loading profile:", error);
      setProfile(null);
    }
  }

  async function checkIsOwner(u: User | null): Promise<boolean> {
    if (!u) return false;
    
    try {
      const { data, error } = await supabase.rpc('is_owner');
      if (error) {
        console.error("Error checking owner status:", error);
        return false;
      }
      return Boolean(data);
    } catch (error) {
      console.error("Error in owner check:", error);
      return false;
    }
  }

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        
        const u = data.session?.user ?? null;
        setUser(u);
        
        if (u) {
          await loadProfile(u);
          const ownerStatus = await checkIsOwner(u);
          setIsOwner(ownerStatus);
        }
        
        setReady(true);
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (mounted) {
          setReady(true);
        }
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      
      if (u) {
        await loadProfile(u);
        const ownerStatus = await checkIsOwner(u);
        setIsOwner(ownerStatus);
      } else {
        setProfile(null);
        setIsOwner(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({
      ready,
      user,
      profile,
      isOwner,
      refreshProfile: async () => {
        if (user) {
          await loadProfile(user);
          const ownerStatus = await checkIsOwner(user);
          setIsOwner(ownerStatus);
        }
      },
    }),
    [ready, user, profile, isOwner]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) {
    throw new Error("useAuth must be used inside <AuthProvider />");
  }
  return v;
}