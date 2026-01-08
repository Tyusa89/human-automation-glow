import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Tab = "magic" | "password" | "sms";

function cn(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

export default function Auth() {
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    if (busy) return false;
    if (tab === "magic") return email.trim().includes("@");
    if (tab === "password") return email.trim().includes("@") && password.length >= 6;
    if (tab === "sms") return phone.trim().length >= 8;
    return false;
  }, [tab, email, password, phone, busy]);

  useEffect(() => {
    // If already signed in, go home (or dashboard)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/", { replace: true });
    });
  }, [navigate]);

  async function sendMagicLink() {
    setBusy(true);
    setMsg(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          // IMPORTANT: set this in Supabase Auth URL config too
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      setMsg("✅ Magic link sent. Check your email.");
    } catch (e: unknown) {
      const error = e as Error;
      setMsg(`⚠️ ${error?.message ?? "Failed to send magic link."}`);
    } finally {
      setBusy(false);
    }
  }

  async function signInPassword() {
    setBusy(true);
    setMsg(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      navigate("/", { replace: true });
    } catch (e: unknown) {
      const error = e as Error;
      setMsg(`⚠️ ${error?.message ?? "Sign-in failed."}`);
    } finally {
      setBusy(false);
    }
  }

  async function signUpPassword() {
    setBusy(true);
    setMsg(null);
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      setMsg("✅ Check your email to confirm your account.");
    } catch (e: unknown) {
      const error = e as Error;
      setMsg(`⚠️ ${error?.message ?? "Sign-up failed."}`);
    } finally {
      setBusy(false);
    }
  }

  async function sendSmsOtp() {
    setBusy(true);
    setMsg(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone.trim(),
      });
      if (error) throw error;
      setMsg("✅ Code sent. Enter the OTP below.");
    } catch (e: unknown) {
      const error = e as Error;
      setMsg(`⚠️ ${error?.message ?? "Failed to send code."}`);
    } finally {
      setBusy(false);
    }
  }

  async function verifySmsOtp() {
    setBusy(true);
    setMsg(null);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: phone.trim(),
        token: otp.trim(),
        type: "sms",
      });
      if (error) throw error;
      navigate("/", { replace: true });
    } catch (e: unknown) {
      const error = e as Error;
      setMsg(`⚠️ ${error?.message ?? "OTP verification failed."}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#07112a] text-white">
      {/* Ambient */}
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
            <h1 className="text-2xl font-semibold">EcoNest</h1>
            <p className="mt-1 text-sm text-white/60">
              Your AI-powered business assistant
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-6 grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setTab("magic")}
              className={cn(
                "rounded-xl px-3 py-2 text-sm transition",
                tab === "magic" ? "bg-emerald-500/25 text-white" : "text-white/70 hover:bg-white/5"
              )}
            >
              Magic link
            </button>
            <button
              onClick={() => setTab("password")}
              className={cn(
                "rounded-xl px-3 py-2 text-sm transition",
                tab === "password" ? "bg-emerald-500/25 text-white" : "text-white/70 hover:bg-white/5"
              )}
            >
              Email + password
            </button>
            <button
              onClick={() => setTab("sms")}
              className={cn(
                "rounded-xl px-3 py-2 text-sm transition",
                tab === "sms" ? "bg-emerald-500/25 text-white" : "text-white/70 hover:bg-white/5"
              )}
            >
              SMS
            </button>
          </div>

          {/* Forms */}
          {tab !== "sms" && (
            <div className="space-y-3">
              <label className="block text-sm text-white/70">Email address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-2xl border border-white/10 bg-[#0b1735]/70 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-500/10"
              />

              {tab === "password" && (
                <>
                  <label className="block text-sm text-white/70">Password</label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-white/10 bg-[#0b1735]/70 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-500/10"
                  />
                </>
              )}
            </div>
          )}

          {tab === "sms" && (
            <div className="space-y-3">
              <label className="block text-sm text-white/70">Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 123 4567"
                className="w-full rounded-2xl border border-white/10 bg-[#0b1735]/70 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-500/10"
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={sendSmsOtp}
                  disabled={busy || phone.trim().length < 8}
                  className="rounded-2xl border border-white/10 bg-white/7 px-4 py-3 text-sm text-white/90 hover:bg-white/10 disabled:opacity-50"
                >
                  Send code
                </button>

                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="OTP"
                  className="w-full rounded-2xl border border-white/10 bg-[#0b1735]/70 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>

              <button
                onClick={verifySmsOtp}
                disabled={busy || otp.trim().length < 4}
                className="w-full rounded-2xl bg-emerald-500 px-4 py-3 font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
              >
                Verify & sign in
              </button>
            </div>
          )}

          {/* Primary action */}
          {tab === "magic" && (
            <button
              onClick={sendMagicLink}
              disabled={!canSubmit}
              className="mt-6 w-full rounded-2xl bg-emerald-500 px-4 py-3 font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
            >
              {busy ? "Sending..." : "Send magic link"}
            </button>
          )}

          {tab === "password" && (
            <div className="mt-6 grid grid-cols-2 gap-2">
              <button
                onClick={signInPassword}
                disabled={!canSubmit}
                className="rounded-2xl bg-emerald-500 px-4 py-3 font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
              >
                Sign in
              </button>
              <button
                onClick={signUpPassword}
                disabled={!canSubmit}
                className="rounded-2xl border border-white/10 bg-white/7 px-4 py-3 font-medium text-white hover:bg-white/10 disabled:opacity-50"
              >
                Sign up
              </button>
            </div>
          )}

          {msg && (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              {msg}
            </div>
          )}

          <button
            onClick={() => navigate("/")}
            className="mt-6 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 hover:bg-white/10"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
