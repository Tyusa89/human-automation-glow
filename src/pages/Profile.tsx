import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../auth/AuthProvider";
import { Database } from "../types/supabase";

type WorkType = Database["public"]["Enums"]["business_type"];
type ClientVolume = Database["public"]["Enums"]["client_volume"];
type TrackingMethod = Database["public"]["Enums"]["tracking_method"];
type Goal90 = Database["public"]["Enums"]["success_goal"];

const CHALLENGES = [
  "Staying organized",
  "Knowing what to focus on",
  "Tracking income & expenses",
  "Client follow-ups",
  "Time management",
  "Feeling behind or overwhelmed",
] as const;

type Challenge = (typeof CHALLENGES)[number];

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"] & {
  work_type?: WorkType | null;
  client_volume?: ClientVolume | null;
  tracking_method?: TrackingMethod | null;
  success_goal?: Goal90 | null;
  primary_challenges?: Challenge[] | null;
};

export default function Profile() {
  const { user, ready } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const [initial, setInitial] = useState<ProfileRow | null>(null);

  // editable fields
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");

  const [workType, setWorkType] = useState<WorkType | "">("");
  const [clientVolume, setClientVolume] = useState<ClientVolume | "">("");
  const [trackingMethod, setTrackingMethod] = useState<TrackingMethod | "">("");
  const [goal90, setGoal90] = useState<Goal90 | "">("");
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (mounted) {
        setLoading(true);
        setError(null);
      }

      try {
        if (!user) {
          if (mounted) setError("You must be signed in to view your profile.");
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select(
            "user_id,email,full_name,company,business_type,client_volume,tracking_method,success_goal,primary_challenges"
          )
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;

        // Set initial state directly from database data
        if (data && mounted) {
          setInitial(data);
          setEmail(data.email || "");
          setFullName(data.full_name || "");
          setCompany(data.company || "");
          setWorkType(data.business_type || "");
          setClientVolume(data.client_volume || "");
          setTrackingMethod(data.tracking_method || "");
          setGoal90(data.success_goal || "");
          setChallenges(data.primary_challenges || []);
        }
      } catch (err: unknown) {
        if (mounted) setError(err instanceof Error ? err.message : "Failed to load profile.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (ready) {
      load();
    }

    return () => {
      mounted = false;
    };
  }, [user, ready]);

  const dirty = useMemo(() => {
    if (!initial) return false;

    const norm = (v: string | null | undefined) => (v ?? "");
    const arrEq = (a: Challenge[], b: Challenge[]) =>
      JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());

    return (
      norm(email) !== norm(initial.email) ||
      norm(fullName) !== norm(initial.full_name) ||
      norm(company) !== norm(initial.company) ||
      norm(workType) !== norm(initial.work_type) ||
      norm(clientVolume) !== norm(initial.client_volume) ||
      norm(trackingMethod) !== norm(initial.tracking_method) ||
      norm(goal90) !== norm(initial.success_goal) ||
      !arrEq(challenges, initial.primary_challenges ?? [])
    );
  }, [initial, email, fullName, company, workType, clientVolume, trackingMethod, goal90, challenges]);

  function toggleChallenge(c: Challenge) {
    setChallenges((prev) => {
      const exists = prev.includes(c);
      if (exists) return prev.filter((x) => x !== c);

      // match Lovable: "up to 2"
      if (prev.length >= 2) return prev;
      return [...prev, c];
    });
  }

  function resetToInitial() {
    if (!initial) return;
    setEmail(initial.email ?? "");
    setFullName(initial.full_name ?? "");
    setCompany(initial.company ?? "");
    setWorkType(initial.work_type ?? "");
    setClientVolume(initial.client_volume ?? "");
    setTrackingMethod(initial.tracking_method ?? "");
    setGoal90(initial.success_goal ?? "");
    setChallenges(initial.primary_challenges ?? []);
    setSavedAt(null);
    setError(null);
  }

  async function save() {
    setSaving(true);
    setError(null);
    setSavedAt(null);

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    if (!user) {
      setSaving(false);
      setError("You must be signed in to save changes.");
      return;
    }

    const payload = {
      user_id: user.id,
      email: email || null,
      full_name: fullName || null,
      company: company || null,
      business_type: workType || null,
      client_volume: clientVolume || null,
      tracking_method: trackingMethod || null,
      success_goal: goal90 || null,
      primary_challenges: challenges.length ? challenges : null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("profiles")
      .upsert(payload, { onConflict: "user_id" });

    if (error) {
      setSaving(false);
      setError(error.message);
      return;
    }

    // refresh initial snapshot
    setInitial((prev) => prev ? { ...prev, ...payload } : payload as ProfileRow);
    setSaving(false);
    setSavedAt(new Date().toLocaleString());
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-1 text-sm text-slate-300">
              Manage your personal info and business context EcoNest uses to personalize the system.
            </p>
          </div>

          {savedAt && (
            <div className="text-xs text-emerald-300">Saved • {savedAt}</div>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="mt-8 space-y-6">
          {/* Personal Information */}
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/40 backdrop-blur">
            <div className="mb-5">
              <h2 className="text-lg font-semibold">Personal Information</h2>
              <p className="text-sm text-slate-300">Your contact details and basic info.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-slate-200">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400/40"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-200">Full name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400/40"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-200">Company</label>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400/40"
                  placeholder="EcoNest AI"
                />
              </div>
            </div>

            {/* role display (read-only) */}
            {initial && (
              <div className="mt-5 text-xs text-slate-400">
                Role:{" "}
                <span className="text-slate-200">
                  {initial.is_owner ? "owner" : initial.role ?? "client"}
                </span>
              </div>
            )}
          </section>

          {/* Business Profile */}
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/40 backdrop-blur">
            <div className="mb-5">
              <h2 className="text-lg font-semibold">Business Profile</h2>
              <p className="text-sm text-slate-300">Help your assistant understand your work better.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-slate-200">Work type</label>
                <select
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value as WorkType | "")}
                  title="Select your work type"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400/40"
                >
                  <option value="">Select work type</option>
                  <option value="consultant">Consultant</option>
                  <option value="coach">Coach</option>
                  <option value="freelancer">Freelancer</option>
                  <option value="creative_designer">Creative Designer</option>
                  <option value="local_service_provider">Local Service Provider</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-200">Client volume</label>
                <select
                  value={clientVolume}
                  onChange={(e) => setClientVolume(e.target.value as ClientVolume | "")}
                  title="Select your client volume"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400/40"
                >
                  <option value="">Select client volume</option>
                  <option value="1_3">1-3</option>
                  <option value="4_10">4-10</option>
                  <option value="11_25">11-25</option>
                  <option value="25_plus">25+</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-200">Tracking method</label>
                <select
                  value={trackingMethod}
                  onChange={(e) => setTrackingMethod(e.target.value as TrackingMethod | "")}
                  title="Select your tracking method"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400/40"
                >
                  <option value="">How do you track?</option>
                  <option value="spreadsheets">Spreadsheets</option>
                  <option value="accounting_software">Accounting Software</option>
                  <option value="notes_memory">Notes & Memory</option>
                  <option value="nothing_consistently">Nothing Consistently</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-200">90-day goal</label>
                <select
                  value={goal90}
                  onChange={(e) => setGoal90(e.target.value as Goal90 | "")}
                  title="Select your 90-day goal"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400/40"
                >
                  <option value="">What's success look like?</option>
                  <option value="consistent_income">Consistent Income</option>
                  <option value="less_stress">Less Stress</option>
                  <option value="fewer_dropped_balls">Fewer Dropped Balls</option>
                  <option value="more_time">More Time</option>
                  <option value="preparing_to_grow">Preparing to Grow</option>
                  <option value="Automate scheduling">Automate scheduling</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-200">
                    Primary challenges (up to 2)
                  </label>
                  <span className="text-xs text-slate-400">{challenges.length}/2</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {CHALLENGES.map((c) => {
                    const active = challenges.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleChallenge(c)}
                        className={[
                          "rounded-full px-3 py-1 text-xs transition",
                          "border border-white/10",
                          active
                            ? "bg-emerald-500/20 text-emerald-100"
                            : "bg-slate-950/20 text-slate-200 hover:bg-white/5",
                        ].join(" ")}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={resetToInitial}
              disabled={!dirty || saving || loading}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-slate-100 hover:bg-white/10 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={!dirty || saving || loading}
              className="rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>

        {loading && (
          <div className="mt-6 text-sm text-slate-300">Loading profile…</div>
        )}
      </div>
    </div>
  );
}