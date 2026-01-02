import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import EcoNestSidebar from "../components/EcoNestSidebar";
import { supabase } from "../lib/supabase";
import { useAuth } from "../auth/AuthProvider";

function cn(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

export default function AppLayout() {
  const { user, ready, isOwner, profile } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      {/* Top header */}
      <header className="sticky top-0 z-50 h-14 border-b border-white/10 bg-[#070b18]/60 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="text-sm font-semibold text-white/90">EcoNest</div>
            {ready && (
              <div className="hidden md:flex items-center gap-2 text-xs text-white/50">
                {user ? (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>Signed in as</span>
                    <span className="text-white/70">{profile?.email ?? user.email}</span>
                    {isOwner && (
                      <span className="ml-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[11px] text-emerald-200">
                        Owner
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                    <span>Signed out</span>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Optional quick links */}
            <button
              onClick={() => nav("/")}
              className={cn(
                "rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10",
                location.pathname === "/" && "bg-white/10"
              )}
            >
              Home
            </button>
            <button
              onClick={() => nav("/dashboard")}
              className={cn(
                "rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10",
                location.pathname.startsWith("/dashboard") && "bg-white/10"
              )}
            >
              Dashboard
            </button>

            {/* ✅ Single source of truth for auth button */}
            {ready && user ? (
              <button
                onClick={() => supabase.auth.signOut()}
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10"
              >
                Sign out
              </button>
            ) : (
              <button
                onClick={() => nav("/auth")}
                className="rounded-2xl bg-white px-3 py-1.5 text-xs font-medium text-slate-950 hover:opacity-95"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto flex w-full">
        <EcoNestSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((v) => !v)}
        />

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}