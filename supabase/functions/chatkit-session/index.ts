import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;
const WORKFLOW_ID = Deno.env.get("OPENAI_AGENT_WORKFLOW_ID")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Only POST allowed" }, 405);
  }

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      console.error("Missing or invalid Authorization header");
      return json({ error: "Missing or invalid Authorization header" }, 401);
    }

    // 1) Create Supabase client with user context
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: { Authorization: authHeader },
      },
      auth: { persistSession: false },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("getUser error", userError);
      return json({ error: "Not authenticated" }, 401);
    }

    console.log("User authenticated:", user.id, user.email);

    // 2) Get role from user_roles (or default)
    const { data: roleRow, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (roleError) {
      console.error("user_roles error", roleError);
    }

    const role = (roleRow?.role as string) ?? "user";
    console.log("User role:", role);

    // 3) Build instruction string for the agent
    const instructions = `
You are the EcoNest automation assistant.

The current authenticated user has:
- id: ${user.id}
- email: ${user.email ?? "unknown"}
- role: "${role}"

When calling tools, ALWAYS:
- pass "owner_id": "${user.id}" in the payload
- respect the role: "owner" can see/manage all their data, 
  non-owners should avoid owner-only operations like global stats or billing.
`.trim();

    console.log("Creating ChatKit session for user:", user.id);

    // 4) Create ChatKit session via OpenAI
    const res = await fetch(
      "https://api.openai.com/v1/realtime/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-realtime-preview",
          workflow_id: WORKFLOW_ID,
          instructions,
        }),
      },
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("OpenAI session error", res.status, text);
      throw new Error(`OpenAI error ${res.status}: ${text}`);
    }

    const data = await res.json();
    console.log("ChatKit session created successfully");
    
    return json({ client_secret: data.client_secret });
  } catch (err: any) {
    console.error("chatkit-session error", err);
    return json(
      { error: err.message ?? "Failed to create ChatKit session" },
      500,
    );
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}
