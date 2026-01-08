import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";

function withTimeout<T>(p: Promise<T>, ms = 10000): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("Request timed out")), ms);
    p.then((v) => { clearTimeout(t); resolve(v); })
     .catch((e) => { clearTimeout(t); reject(e); });
  });
}

// Helper to execute Supabase queries with timeout
function executeWithTimeout<T>(queryBuilder: unknown, ms = 10000): Promise<T> {
  return withTimeout(queryBuilder as Promise<T>, ms);
}

type ContactRow = {
  id: string;
  user_id: string;
  name: string | null;
  company: string | null;
  email: string | null;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const glass = "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl";

export default function Contacts() {
  const nav = useNavigate();
  const { user, ready } = useAuth();
  const [debug, setDebug] = useState<string>("init");

  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
  });

  async function load() {
    console.log("🔍 [Contacts] Starting load function...");
    setDebug("load: start");
    setLoading(true);
    setError(null);

    console.log("🌐 [Contacts] ENV URL:", import.meta.env.VITE_SUPABASE_URL);
    console.log("🔗 [Contacts] Supabase client OK?:", !!supabase);
    try {
      console.log("👤 [Contacts] Getting user from context");
      setDebug("load: getUser from context");
      console.log("🔄 [Contacts] Auth ready =", ready);
      console.log("👤 [Contacts] Context user =", user?.id);
      
      // Wait for auth to be ready
      if (!ready) {
        console.log("debug: load: auth not ready, waiting...");
        setDebug("load: auth not ready");
        setLoading(false);
        return;
      }
      
      if (!user) {
        console.log("debug: load: no context user");
        setDebug("load: no context user");
        setContacts([]);
        setLoading(false);
        return;
      }

      console.log("debug: load: testing connection");
      setDebug("load: testing connection");
      
      // First test basic connection with a simple query
      try {
        const testRes = await executeWithTimeout<{data: unknown, error: unknown, count: number}>(
          supabase.from("contacts").select("*", { count: "exact", head: true }), 
          5000
        );
        
        console.log("contacts table test:", { count: testRes.count, error: testRes.error });
        
        if (testRes.error) {
          console.log("contacts table error:", testRes.error);
          throw new Error(`Table error: ${String(testRes.error)}`);
        }
        
        setDebug("load: table exists, selecting");
      } catch (e: unknown) {
        const error = e as Error;
        console.log("contacts table does not exist or no access:", error);
        throw new Error(`Cannot access contacts table: ${error.message}`);
      }
      
      const selRes = await executeWithTimeout<{data: ContactRow[], error: unknown}>(
        supabase.from("contacts").select("id, user_id, name, company, email").order("name", { ascending: true }),
        8000
      );
      setDebug("load: selected");

      console.log("contacts select:", { data: selRes.data, error: selRes.error });
      if (selRes.error) throw new Error(String(selRes.error));

      setContacts((selRes.data ?? []) as ContactRow[]);
      setDebug("load: done");
    } catch (e: unknown) {
      const error = e as Error;
      setDebug("load: error");
      setError(error?.message ?? "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (ready) {
      load();
    }

    // TEMP: disable realtime until stable
    // const channel = supabase
    //   .channel("contacts-realtime")
    //   .on("postgres_changes", { event: "*", schema: "public", table: "contacts" }, () => load())
    //   .subscribe();
    //
    // return () => {
    //   supabase.removeChannel(channel);
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return contacts;

    return contacts.filter((c) => {
      return (
        (c.name ?? "").toLowerCase().includes(qq) ||
        (c.email ?? "").toLowerCase().includes(qq) ||
        (c.company ?? "").toLowerCase().includes(qq)
      );
    });
  }, [contacts, q]);

  async function createContact() {
    console.log("🆕 [Contacts] Starting contact creation...");
    setDebug("create: start");
    setSaving(true);
    setError(null);

    try {
      console.log("🔍 [Contacts] Getting user from context");
      setDebug("create: getUser from context");
      console.log("👤 [Contacts] Context user =", user?.id);
      
      if (!user) {
        console.log("❌ [Contacts] No user found for contact creation");
        throw new Error("You must be signed in to add contacts.");
      }

      const payload = {
        user_id: user.id,
        name: form.name.trim() || "Unnamed",
        company: form.company.trim() || null,
        email: form.email.trim() || null,
      };

      console.log("📡 [Contacts] INSERT payload:", payload);
      setDebug("create: insert()");
      console.log("🔄 [Contacts] About to insert into contacts table");
      const insRes = await executeWithTimeout<{data: ContactRow[], error: unknown}>(
        supabase.from("contacts").insert(payload), 
        8000
      );
      console.log("✅ [Contacts] Insert completed");
      setDebug("create: inserted");
      console.log("📋 [Contacts] Insert result:", { data: insRes.data, error: insRes.error });
      if (insRes.error) {
        console.error("❌ [Contacts] SUPABASE INSERT ERROR:", insRes.error);
        console.error("SUPABASE INSERT ERROR:", insRes.error);
        throw new Error(String(insRes.error));
      }

      setShowAdd(false);
      setForm({ name: "", company: "", email: "" });
      setDebug("create: reload()");
      await load();
      setDebug("create: done");
    } catch (e: unknown) {
      const error = e as Error;
      console.error("CREATE CONTACT ERROR:", error);
      console.error("Error message:", error?.message);
      console.error("Error details:", error);
      setDebug("create: error");
      setError(error?.message ?? "Failed to add contact");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050A14] text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-1 text-sm text-white/60">CRM</div>
          <h1 className="text-3xl font-semibold tracking-tight">Contacts</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/60">
            Store leads and clients here. (Simple version: name, company, email.)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            className={cn(glass, "px-4 py-2 text-sm hover:bg-white/10")}
            onClick={() => nav("/")}
          >
            Back to Home
          </button>
          <button
            className={cn(glass, "px-4 py-2 text-sm hover:bg-white/10")}
            onClick={() => nav("/dashboard")}
          >
            Go to Dashboard
          </button>
          <button
            className={cn(
              "rounded-2xl px-4 py-2 text-sm font-medium",
              "bg-white text-black hover:opacity-90"
            )}
            onClick={() => setShowAdd(true)}
          >
            + Add Contact
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className={cn(glass, "mb-4 p-4")}>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs text-white/60">Search</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, email, company…"
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>

          <div className="flex items-end justify-between gap-2">
            <div className="text-xs text-white/60">
              {loading ? "Loading…" : `${filtered.length} contact(s)`}
            </div>
            <button
              className={cn(glass, "px-3 py-1.5 text-xs hover:bg-white/10")}
              onClick={load}
            >
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}
        
        <div className="mt-2 text-xs text-white/50">debug: {debug}</div>
      </div>

      {/* Table */}
      {loading ? (
        <div className={cn(glass, "p-8 text-center text-sm text-white/60")}>
          Loading contacts…
        </div>
      ) : filtered.length === 0 ? (
        <div className={cn(glass, "p-10 text-center")}>
          <div className="text-xl font-semibold">No contacts yet</div>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/60">
            Click <span className="text-white">Add Contact</span> to create your first entry.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              className={cn(
                "rounded-2xl bg-white px-4 py-2 text-sm font-medium text-black hover:opacity-90"
              )}
              onClick={() => setShowAdd(true)}
            >
              + Add Contact
            </button>
          </div>
        </div>
      ) : (
        <div className={cn(glass, "overflow-hidden")}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-white/10 text-xs text-white/60">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Email</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 font-medium">{c.name || "—"}</td>
                    <td className="px-4 py-3">{c.company || "—"}</td>
                    <td className="px-4 py-3">{c.email || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-[9999] bg-black/60 p-4">
          <div className="absolute inset-0" onClick={() => !saving && setShowAdd(false)} />
          <div className="relative z-10 flex items-center justify-center h-full pointer-events-none">
            <div className={cn(glass, "w-full max-w-xl p-5 pointer-events-auto")}>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-lg font-semibold">Add Contact</div>
              <button
                type="button"
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
                onClick={() => setShowAdd(false)}
              >
                Close
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                createContact();
              }}
            >
              <div className="grid gap-3 sm:grid-cols-2">
              <input
                className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              />
              <input
                className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Company"
                value={form.company}
                onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
              />
              <input
                className="sm:col-span-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
            </form>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                className={cn(glass, "px-4 py-2 text-sm hover:bg-white/10")}
                onClick={() => setShowAdd(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={cn(
                  "rounded-2xl px-4 py-2 text-sm font-medium",
                  "bg-white text-black hover:opacity-90 disabled:opacity-60"
                )}
                onClick={createContact}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save Contact"}
              </button>
            </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}