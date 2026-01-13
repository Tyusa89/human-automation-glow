import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";

function cn(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

export default function AuthReset() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [hasSession, setHasSession] = useState(false);

  const canSubmit = useMemo(() => {
    if (busy) return false;
    if (!hasSession) return false;
    if (password.length < 6) return false;
    if (password !== confirm) return false;
    return true;
  }, [busy, hasSession, password, confirm]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const type = url.searchParams.get("type");

    // Nice UX hint
    if (type === "recovery") {
      setMsg("✅ Recovery link verified. Set your new password below.");
    }

    supabase.auth.getSession().then(({ data }) => {
      const ok = !!data.session;
      setHasSession(ok);
      if (!ok) {
        setMsg("⚠️ Open the password reset link from your email to continue.");
      }
    });
  }, []);

  async function updatePassword() {
    setBusy(true);
    setMsg(null);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setMsg("✅ Password updated. You can sign in now.");
      // Give a beat then go to auth
      setTimeout(() => navigate("/auth", { replace: true }), 800);
    } catch (e: unknown) {
      const error = e as Error;
      setMsg(`⚠️ ${error?.message ?? "Failed to update password."}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#07112a] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/6 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500/15 text-2xl font-bold text-emerald-200">
              E
            </div>
            <h1 className="text-2xl font-semibold">Reset password</h1>
            <p className="mt-1 text-sm text-white/60">
              Enter your new password twice.
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-sm text-white/70">New password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              disabled={!hasSession || busy}
              className="w-full rounded-2xl border border-white/10 bg-[#0b1735]/70 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-500/10 disabled:opacity-50"
              placeholder="••••••••"
            />

            <label className="block text-sm text-white/70">Confirm password</label>
            <input
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              type="password"
              disabled={!hasSession || busy}
              className="w-full rounded-2xl border border-white/10 bg-[#0b1735]/70 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-500/10 disabled:opacity-50"
              placeholder="••••••••"
            />

            <button
              onClick={updatePassword}
              disabled={!hasSession || !canSubmit}
              className="mt-2 w-full rounded-2xl bg-emerald-500 px-4 py-3 font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
            >
              {busy ? "Updating..." : "Update password"}
            </button>
          </div>

          {msg && (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              {msg}
            </div>
          )}

          <button
            onClick={() => navigate("/auth", { replace: true })}
            className="mt-6 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 hover:bg-white/10"
          >
            ← Back to sign in
          </button>
        </div>
      </div>
    </div>
  );
}