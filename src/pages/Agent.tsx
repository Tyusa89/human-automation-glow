import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

// --- Fast timeout helper ---
async function withTimeout(promise, ms, label) {
  let t;
  const timeout = new Promise((_, reject) => {
    t = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(t);
  }
}

// --- Auth + owner role loader ---
async function loadAuthAndRole(setUser, setIsOwner) {
  const started = Date.now();
  let sessionData, sessionErr;
  try {
    ({ data: sessionData, error: sessionErr } = await withTimeout(
      supabase.auth.getSession(),
      8000,
      "getSession"
    ));
  } catch (err) {
    console.log("[Agent] getSession error", err);
    setUser(null);
    setIsOwner(false);
    return;
  }
  const session = sessionData?.session ?? null;
  console.log("[Agent] getSession", {
    ms: Date.now() - started,
    hasSession: !!session,
    email: session?.user?.email,
    userId: session?.user?.id,
    err: sessionErr?.message,
    origin: window.location.origin,
  });
  const u = session?.user ?? null;
  setUser(u);
  if (!u) {
    setIsOwner(false);
    return;
  }
  const t2 = Date.now();
  let roleRow, roleErr;
  try {
    ({ data: roleRow, error: roleErr } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", u.id)
      .maybeSingle());
  } catch (err) {
    console.log("[Agent] role fetch error", err);
    setIsOwner(false);
    return;
  }
  console.log("[Agent] role fetch", {
    ms: Date.now() - t2,
    role: roleRow?.role ?? null,
    err: roleErr?.message ?? null,
  });
  setIsOwner(roleRow?.role === "owner");
}

// --- Chat Modes ---

type ChatModeId = "business_assistant" | "owner_agent";

type AgentProps = {
  defaultMode?: ChatModeId;
  ownerOnly?: boolean;
  title?: string;
};

const CHAT_MODES = [
  {
    id: "business_assistant" as const,
    label: "Business Assistant",
    description: "Day-to-day business help, planning, ops, writing, etc.",
    speaker: "EcoNest Steward",
    ownerOnly: false,
  },
  {
    id: "owner_agent" as const,
    label: "Owner Agent",
    description: "Owner-level decisions, governance, system actions, escalation.",
    speaker: "EcoNest Owner",
    ownerOnly: true,
  },
];

type Msg = { role: "user" | "assistant" | "system"; content: string };

export default function Agent({ defaultMode, ownerOnly, title }: AgentProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [fnName, setFnName] = useState("generate-sop");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [modeId, setModeId] = useState<ChatModeId>(defaultMode ?? "business_assistant");
  const [user, setUser] = useState<User | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const isOwnerTheme = ownerOnly || modeId === "owner_agent";

  const roles = ["Background", "Operator", "Analyst", "Architect"];

  // Only show owner agent if owner
  const visibleModes = ownerOnly
    ? CHAT_MODES.filter((m) => m.id === "owner_agent")
    : CHAT_MODES.filter((m) => !m.ownerOnly || isOwner);
  const selectedMode = CHAT_MODES.find((m) => m.id === modeId) ?? CHAT_MODES[0];

  useEffect(() => {
    if (ownerOnly) setModeId("owner_agent");
  }, [ownerOnly]);

  // Protect /owner-agent route (redirect non-owners)
  useEffect(() => {
    if (!ownerOnly) return;
    if (user && !isOwner) navigate("/dashboard");
  }, [ownerOnly, user, isOwner, navigate]);

  // Default to Owner Agent in Owner Dashboard
  useEffect(() => {
    if (isOwner && location.pathname.includes("owner-dashboard")) {
      setModeId("owner_agent");
    }
  }, [isOwner, location.pathname]);

  // Timeout fallback for loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) setLoadError("Session check timed out. Please refresh or re-login.");
    }, 8000);
    return () => clearTimeout(timeout);
  }, [loading]);

  useEffect(() => {
    loadAuthAndRole(setUser, setIsOwner);
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadAuthAndRole(setUser, setIsOwner);
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Only redirect if not loading and not owner
  useEffect(() => {
    if (loading) return;
    if (!ownerOnly) return;
    if (user && !isOwner) {
      if (loadError) return; // Don't redirect if showing error
      navigate("/dashboard");
    }
  }, [ownerOnly, user, isOwner, navigate, loading, loadError]);

  // Fast debug check
  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("session?", !!data.session, data.session?.user?.email, data.session?.access_token?.slice(0, 20));
    };
    check();
  }, []);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;

    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setBusy(true);

    try {
      // Use supabase.functions.invoke() for better authentication handling
      const { data: responseData, error } = await supabase.functions.invoke(fnName, {
        body: { message: text, mode: modeId },
      });

      if (error) {
        throw new Error(`Edge Function Error: ${error.message || JSON.stringify(error)}`);
      }

      // Handle response data
      let assistantText = "";
      if (typeof responseData === "string") {
        assistantText = responseData;
      } else if (responseData) {
        assistantText = responseData?.reply || responseData?.message || responseData?.output || responseData?.response || JSON.stringify(responseData, null, 2);
      } else {
        assistantText = "Function executed successfully but returned no data.";
      }

      setMessages((m) => [...m, { role: "assistant", content: assistantText }]);
    } catch (e: unknown) {
      const error = e as Error;
      let errorMessage = `⚠️ Agent error: ${error?.message ?? String(e)}`;
      
      // Provide helpful error messages for common issues
      if (e?.message?.includes("Missing authorization header") || e?.message?.includes("401")) {
        errorMessage = "⚠️ Authentication required: Please sign in to use the agent.";
      } else if (e?.message?.includes("Not found") || e?.message?.includes("404")) {
        errorMessage = `⚠️ Edge Function '${fnName}' not found. Available functions: contact-form, generate-sop, run-task`;
      }

      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: errorMessage,
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] w-full bg-gradient-to-b from-[#071a3a] via-[#06142e] to-[#050b1c] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
        {loadError && (
          <div className="mt-4 text-red-400 text-base">{loadError}</div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-gradient-to-b from-[#071a3a] via-[#06142e] to-[#050b1c]">
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <div
          className={`rounded-3xl p-4 shadow-2xl shadow-black/40 backdrop-blur border ${
            isOwnerTheme ? "border-amber-400/20" : "border-white/10"
          } ${isOwnerTheme ? "bg-amber-500/5" : "bg-white/5"}`}
        >
          {/* Inner console */}
          <div className="rounded-2xl border border-white/10 bg-slate-950/30 overflow-hidden">
            {/* Top bar inside console */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-3">
                  <span
                    className={`h-2 w-2 rounded-full ${isOwnerTheme ? "bg-amber-400" : "bg-emerald-400"}`}
                  />
                  <h1 className="text-lg font-semibold">
                    {title ?? (user ? "EcoNest Steward" : "EcoNest Agent")}
                  </h1>
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] ${
                      isOwnerTheme
                        ? "border-amber-400/25 bg-amber-500/10 text-amber-100"
                        : "border-white/10 bg-white/5 text-slate-200"
                    }`}
                  >
                    {user ? (isOwner ? "Owner" : "Client") : "Signed out"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-300 italic">
                  {isOwnerTheme
                    ? "“Command with clarity. Govern with calm.” — EcoNest Owner"
                    : "“Nothing moves without intent.” — EcoNest Steward"}
                </p>
              </div>

              {/* Mode + Function (only when signed in) */}
              {user && (
                <div className="flex items-center gap-3">
                  <select
                    value={modeId}
                    onChange={(e) => setModeId(e.target.value as ChatModeId)}
                    className={`rounded-2xl border bg-slate-950/30 px-3 py-2 text-sm text-slate-100 outline-none ${
                      isOwnerTheme ? "border-amber-400/20" : "border-white/10"
                    }`}
                    aria-label="Select AI agent mode"
                  >
                    {visibleModes.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                  <span className="text-sm text-white/80 ml-4">
                    <span className="font-semibold text-white">Mode:</span> {selectedMode.label}
                    <span className="mx-2 text-white/30">•</span>
                    <span className="font-semibold text-white">Speaker:</span> {selectedMode.speaker}
                  </span>
                  <select
                    value={fnName}
                    onChange={(e) => setFnName(e.target.value)}
                    title="Select function type"
                    className="rounded-2xl border border-white/10 bg-slate-950/30 px-3 py-2 text-sm text-slate-100 outline-none"
                  >
                    <option value="generate-sop">Generate SOP</option>
                    <option value="contact-form">Contact Form</option>
                    <option value="run-task">Run Task</option>
                  </select>
                </div>
              )}
            </div>

            {/* Main body */}
            <div className="p-6">
              {!user ? (
                // Logged-out state (still framed, not huge blank screen)
                <div className="flex min-h-[calc(100vh-56px-220px)] items-center justify-center">
                  <div className="max-w-md text-center">
                    <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-2xl border border-white/10 bg-white/5">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <h3 className="text-lg font-semibold">Authentication required</h3>
                    <p className="mt-2 text-sm text-slate-300">
                      Sign in to use the EcoNest Agent.
                    </p>
                    <div className="mt-6 flex justify-center gap-3">
                      <button
                        onClick={() => navigate("/auth")}
                        className={`rounded-2xl px-5 py-2.5 text-sm font-medium text-white ${
                          isOwnerTheme
                            ? "bg-amber-600 hover:bg-amber-700"
                            : "bg-emerald-600 hover:bg-emerald-700"
                        }`}
                      >
                        Go to Sign in
                      </button>
                      <button
                        onClick={() => navigate("/")}
                        className="rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-slate-100 hover:bg-white/10"
                      >
                        Back home
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Signed-in chat layout (tight like Lovable)
                <div className="flex min-h-[calc(100vh-56px-220px)] flex-col">
                  {/* Messages */}
                  <div className="flex-1 overflow-auto rounded-2xl border border-white/10 bg-slate-950/20 p-5">
                    {messages.length === 0 ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="max-w-md text-center">
                          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-2xl border border-white/10 bg-white/5">
                            <span className="text-2xl">💬</span>
                          </div>
                          <h3 className="text-lg font-semibold">
                            Ready to chat. Type your message below.
                          </h3>
                          <p className="mt-2 text-sm text-slate-300">
                            Signed in as: {user?.email || user?.id || "Anonymous"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 max-w-4xl">
                        {messages.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                                msg.role === "user"
                                  ? "bg-emerald-600 text-white"
                                  : "bg-white/5 border border-white/10"
                              }`}
                            >
                              <div className="text-xs font-medium mb-1 opacity-70">
                                {msg.role === "user" ? "You" : selectedMode.speaker}
                              </div>
                              <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/20 p-4">
                    <div className="relative">
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            send();
                          }
                        }}
                        placeholder="Type your message..."
                        disabled={busy}
                        className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 pr-24 text-slate-100 outline-none focus:border-emerald-400/40"
                        rows={2}
                      />
                      <button
                        onClick={send}
                        disabled={busy || !input.trim()}
                        className={`absolute right-3 top-3 rounded-xl px-5 py-2 text-sm font-medium text-white disabled:opacity-50 ${
                          isOwnerTheme
                            ? "bg-amber-600 hover:bg-amber-700"
                            : "bg-emerald-600 hover:bg-emerald-700"
                        }`}
                      >
                        {busy ? "Sending..." : "Send"}
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-xs text-slate-400">
                        Press Enter to send, Shift+Enter for new line
                      </p>
                      <div className="flex items-center gap-2">
                        {roles.map((r) => (
                          <button
                            key={r}
                            type="button"
                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200 hover:bg-white/10"
                          >
                            {r}
                          </button>
                        ))}
                        <button
                          type="button"
                          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200 hover:bg-white/10"
                        >
                          +2 more
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}