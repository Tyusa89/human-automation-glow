import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";


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
  // Remove fnName, use agent-chat only
  const [threadId, setThreadId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [modeId, setModeId] = useState<ChatModeId>(defaultMode ?? "business_assistant");
  const { user, isOwner, ready: readyAuth } = useAuth();
  const loading = !readyAuth;
  const [loadError, setLoadError] = useState<string | null>(null);

  const isOwnerTheme = ownerOnly || modeId === "owner_agent";

  const roles = ["Background", "Operator", "Analyst", "Architect"];

  // Only show owner agent if owner
  const visibleModes = ownerOnly
    ? CHAT_MODES.filter((m) => m.id === "owner_agent")
    : CHAT_MODES.filter((m) => !m.ownerOnly || isOwner);
  const selectedMode = CHAT_MODES.find((m) => m.id === modeId) ?? CHAT_MODES[0];


  // Set mode to owner_agent if ownerOnly
  useEffect(() => {
    if (ownerOnly && modeId !== "owner_agent") setModeId("owner_agent");
  }, [ownerOnly, modeId]);

  // Protect /owner-agent route (redirect non-owners)
  useEffect(() => {
    if (ownerOnly && user && !isOwner) {
      setLoadError(
        `You are signed in as ${user.email || user.id}, but do not have 'owner' role.\n` +
        `Check the user_roles table for your user_id (${user.id}).\n` +
        `If you believe this is an error, contact support.`
      );
    } else {
      setLoadError(null);
    }
  }, [ownerOnly, user?.id, user?.email, isOwner]);

  // Default to Owner Agent in Owner Dashboard
  useEffect(() => {
    if (isOwner && location.pathname.includes("owner-dashboard") && modeId !== "owner_agent") {
      setModeId("owner_agent");
    }
  }, [isOwner, location.pathname, modeId]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;

    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setBusy(true);

    try {
      // Use new agent-chat contract
      const { data, error } = await supabase.functions.invoke("agent-chat", {
        body: { thread_id: threadId, input: text, mode: modeId === "owner_agent" ? "owner" : "client" },
      });
      if (error) throw new Error(error.message);
      if (data) {
        setThreadId(data.thread_id);
        setMessages((m) => [...m, { role: "assistant", content: data.content }]);
      }
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `⚠️ Agent error: ${e?.message ?? String(e)}`,
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  // Resume last thread on mount or mode change
  useEffect(() => {
    async function getLatestThread(mode: "owner" | "client") {
      const { data, error } = await supabase
        .from("agent_threads")
        .select("id,mode,updated_at")
        .eq("mode", mode)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) return null;
      return data?.id ?? null;
    }
    async function resumeOrLoad() {
      const mode = modeId === "owner_agent" ? "owner" : "client";
      const latestId = await getLatestThread(mode);
      if (latestId) setThreadId(latestId);
      else setMessages([]);
    }
    resumeOrLoad();
  }, [modeId]);

  // Load thread history if threadId changes
  useEffect(() => {
    async function loadThreadMessages(threadId: string) {
      const { data, error } = await supabase
        .from("agent_messages")
        .select("role,content,created_at")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });
      if (error) return;
      setMessages((data ?? []).map((m: any) => ({ role: m.role, content: m.content })));
    }
    if (threadId) loadThreadMessages(threadId);
  }, [threadId]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] w-full bg-gradient-to-b from-[#071a3a] via-[#06142e] to-[#050b1c] flex flex-col items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
        {loadError && (
          <div className="mt-4 text-red-400 text-base">{loadError}</div>
        )}
        {/* Debug info */}
        <div className="mt-6 p-4 bg-black/40 rounded-xl text-xs text-white max-w-xl w-full">
          <div><b>Debug Info</b></div>
          <div><b>user:</b> {JSON.stringify(user)}</div>
          <div><b>isOwner:</b> {String(isOwner)}</div>
          <div><b>loading:</b> {String(loading)}</div>
        </div>
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
                  {/* Function selection removed for agent-chat */}
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
                    {/* Debug info */}
                    <div className="mt-6 p-4 bg-black/40 rounded-xl text-xs text-white max-w-xl w-full">
                      <div><b>Debug Info</b></div>
                      <div><b>user:</b> {JSON.stringify(user)}</div>
                      <div><b>isOwner:</b> {String(isOwner)}</div>
                      <div><b>loading:</b> {String(loading)}</div>
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