import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import { hardSignOut, hardReset } from "../../lib/authActions";
import { useState } from "react";

export default function SidebarAccountFooter() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [resetting, setResetting] = useState(false);

  if (!user) {
    return (
      <div className="mt-auto border-t border-white/10 p-3">
        <Link
          to="/auth"
          className="flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white font-medium hover:bg-white/20 hover:border-white/30 transition-all"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-auto border-t border-white/10 p-3 space-y-2">
      <Link
        to="/profile"
        className="flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white font-medium hover:bg-white/20 hover:border-white/30 transition-all"
      >
        Profile
      </Link>

      <button
        disabled={signingOut}
        onClick={async () => {
          if (signingOut) return;
          console.log("✅ SidebarAccountFooter sign out clicked");
          setSigningOut(true);
          await hardSignOut("/auth");
        }}
        className="flex w-full items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 font-medium hover:bg-red-500/20 hover:border-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {signingOut ? "Signing out..." : "Sign out"}
      </button>

      <button
        disabled={resetting}
        onClick={async () => {
          if (resetting) return;
          const ok = window.confirm("This will log you out and clear local data. Continue?");
          if (!ok) return;
          console.log("🧼 SidebarAccountFooter reset session clicked");
          setResetting(true);
          await hardReset("/auth");
        }}
        className="flex w-full items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-300 font-medium hover:bg-orange-500/20 hover:border-orange-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {resetting ? "Clearing..." : "Sign out + clear cache"}
      </button>

      <button
        onClick={async () => {
          try {
            const { supabase } = await import("@/integrations/supabase/client");
            await supabase.auth.signOut({ scope: "global" });
          } catch (e) {
            console.warn("Reset signOut failed (continuing):", e);
          }
          try {
            localStorage.clear();
            sessionStorage.clear();
          } catch {}
          window.location.href = "/auth";
        }}
        className="flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white font-medium hover:bg-white/20 hover:border-white/30 transition-all"
      >
        Reset
      </button>
    </div>
  );
}
