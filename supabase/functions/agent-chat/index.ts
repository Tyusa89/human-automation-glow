import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CHAT_MODEL = "google/gemini-2.5-flash";

// System prompts (same as you had)
const OWNER_SYSTEM_PROMPT = `You are EcoNest Agent with OWNER access.

## Identity & Access
- Role: owner
- Access Level: OWNER
- You have full access to business operations, analytics, and configuration.

## Personality
Be concise, technical, and decisive.
Assume the user understands system concepts.
Focus on actionable insights and high-impact decisions.

## Boundaries
If asked about something outside your knowledge, acknowledge it clearly.
Never fabricate data or metrics.`;

const CLIENT_SYSTEM_PROMPT = `You are EcoNest Agent with CLIENT access.

## Identity & Access
- Role: user
- Access Level: CLIENT
- You have access to client-facing features only.

## Personality
Be helpful, clear, and non-technical.
Explain concepts simply and focus on next actions.
Be friendly and supportive.

## Boundaries
If a request requires tools or access outside your level, clearly explain that the action is restricted.
Never discuss internal business operations, revenue, or administrative functions.`;

type ChatRole = "system" | "user" | "assistant";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    if (!SUPABASE_URL) throw new Error("SUPABASE_URL is not configured");
    if (!SERVICE_KEY) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");

    const body = await req.json();
    const input: string = (body?.input ?? "").toString();
    const requestedMode: "owner" | "client" = body?.mode === "owner" ? "owner" : "client";
    const threadId: string | null = body?.thread_id ? String(body.thread_id) : null;

    if (!input.trim()) {
      return new Response(JSON.stringify({ error: "Missing input" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Service client for DB access + user lookup
    const sb = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

    // Require auth for persistence (Option B)
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: userData, error: userErr } = await sb.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userData.user.id;

    // Determine effective mode (owner requires role)
    let effectiveMode: "owner" | "client" = requestedMode;

    if (requestedMode === "owner") {
      const { data: roleRow } = await sb
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "owner")
        .maybeSingle();

      if (!roleRow) effectiveMode = "client";
    }

    const systemPrompt = effectiveMode === "owner" ? OWNER_SYSTEM_PROMPT : CLIENT_SYSTEM_PROMPT;

    // 1) Resolve/create thread
    let activeThreadId = threadId;

    if (activeThreadId) {
      // Verify thread belongs to user
      const { data: threadRow } = await sb
        .from("agent_threads")
        .select("id,user_id,mode")
        .eq("id", activeThreadId)
        .maybeSingle();

      if (!threadRow || threadRow.user_id !== userId) {
        // Don’t leak existence — just create a new thread
        activeThreadId = null;
      }
    }

    if (!activeThreadId) {
      const { data: newThread, error: threadErr } = await sb
        .from("agent_threads")
        .insert({
          user_id: userId,
          mode: effectiveMode,
          title: null,
        })
        .select("id")
        .single();

      if (threadErr || !newThread) throw new Error("Failed to create thread");
      activeThreadId = newThread.id;
    } else {
      // Keep thread mode in sync (optional)
      await sb.from("agent_threads").update({ mode: effectiveMode }).eq("id", activeThreadId);
    }

    // 2) Load last N messages from DB (build prompt)
    const HISTORY_LIMIT = 30;

    const { data: history } = await sb
      .from("agent_messages")
      .select("role,content,created_at")
      .eq("thread_id", activeThreadId)
      .order("created_at", { ascending: true })
      .limit(HISTORY_LIMIT);

    const messages: Array<{ role: ChatRole; content: string }> = [
      { role: "system", content: systemPrompt },
      ...(history ?? []).map((m: any) => ({ role: m.role as ChatRole, content: m.content })),
      { role: "user", content: input },
    ];

    // 3) Persist the user message immediately
    await sb.from("agent_messages").insert({
      thread_id: activeThreadId,
      user_id: userId,
      role: "user",
      content: input,
      meta: { mode: effectiveMode },
    });

    // 4) Call Lovable AI gateway
    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: CHAT_MODEL,
        messages,
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("[AGENT-CHAT] AI error:", aiRes.status, errText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: aiRes.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiRes.json();
    const content = aiJson?.choices?.[0]?.message?.content || "I couldn't process that request.";

    // 5) Persist assistant message
    await sb.from("agent_messages").insert({
      thread_id: activeThreadId,
      user_id: userId,
      role: "assistant",
      content,
      meta: { mode: effectiveMode, model: CHAT_MODEL },
    });

    // Update thread timestamp (optional)
    await sb.from("agent_threads").update({ updated_at: new Date().toISOString() }).eq("id", activeThreadId);

    return new Response(
      JSON.stringify({
        thread_id: activeThreadId,
        content,
        mode: effectiveMode,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[AGENT-CHAT] Error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
