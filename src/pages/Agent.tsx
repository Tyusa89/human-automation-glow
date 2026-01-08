import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../auth/AuthProvider";
import type { User } from "@supabase/supabase-js";

type Msg = { role: "user" | "assistant" | "system"; content: string };

export default function Agent() {
  const navigate = useNavigate();
  const [fnName, setFnName] = useState("generate-sop");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [mode, setMode] = useState("Business Assistant");
  const [user, setUser] = useState<User | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  const roles = ["Background", "Operator", "Analyst", "Architect"];

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);

      if (u) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("role, is_owner")
          .eq("user_id", u.id)
          .maybeSingle();

        setIsOwner(prof?.is_owner === true || prof?.role === "owner");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null;
      setUser(u);

      if (u) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("role, is_owner")
          .eq("user_id", u.id)
          .maybeSingle();

        setIsOwner(prof?.is_owner === true || prof?.role === "owner");
      } else {
        setIsOwner(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;

    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setBusy(true);

    try {
      // Fast debug check
      const { data } = await supabase.auth.getSession();
      console.log("session?", !!data.session, data.session?.user?.email, data.session?.access_token?.slice(0, 20));

      // Use supabase.functions.invoke() for better authentication handling
      const { data: responseData, error } = await supabase.functions.invoke(fnName, {
        body: { message: text },
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

  return (
    // Outer frame (Lovable-style console card)
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/40 backdrop-blur">
      {/* Inner console */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/30 overflow-hidden">
        {/* Top bar inside console */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <h1 className="text-lg font-semibold">
                {user ? "EcoNest Steward" : "EcoNest Agent"}
              </h1>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-slate-200">
                {user ? (isOwner ? "Owner" : "Client") : "Signed out"}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-300 italic">
              "Nothing moves without intent." — EcoNest Steward
            </p>
          </div>

          {/* Mode + Function (only when signed in) */}
          {user && (
            <div className="flex items-center gap-3">
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="rounded-2xl border border-white/10 bg-slate-950/30 px-3 py-2 text-sm text-slate-100 outline-none"
                aria-label="Select AI agent mode"
              >
                <option value="Business Assistant">Business Assistant</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Strategy Advisor">Strategy Advisor</option>
              </select>

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
                    className="rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
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
                            {msg.role === "user" ? "You" : "EcoNest Steward"}
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
                    className="absolute right-3 top-3 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
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
  );
}