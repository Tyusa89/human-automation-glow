import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

type RunBody = { task: "daily_kpi" | "generate_sop"; params?: Record<string, unknown> };

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-auth',
};

function ok(payload: unknown, logs: string[] = []) {
  return new Response(JSON.stringify({ status: "ok", payload, logs }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function bad(msg: string, code = 400) {
  return new Response(JSON.stringify({ status: "error", error: msg }), {
    status: code,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Health check endpoint
  if (req.method === 'GET' && req.url.endsWith('/healthz')) {
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Require POST + JSON for main functionality
  if (req.method !== "POST") return bad("POST only", 405);
  
  let body: RunBody;
  try { 
    body = await req.json(); 
  } catch { 
    return bad("Invalid JSON"); 
  }
  
  if (!body?.task) return bad("Missing task");

  // Extract JWT for potential future auth requirements
  const authHeader = req.headers.get("Authorization") || "";
  const jwt = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  console.log(`Running task: ${body.task}`, body.params);

  // Implement tasks
  if (body.task === "daily_kpi") {
    const payload = {
      date: new Date().toISOString().slice(0, 10),
      leads_today: 7,
      tasks_run: 14,
      avg_response_min: 9,
      anomalies: ["Leads from FB Ads spiked 3x", "CRM sync skipped 2 rows"],
    };
    return ok(payload, ["task=daily_kpi"]);
  }

  if (body.task === "generate_sop") {
    const topic = (body.params?.topic as string) || "Untitled";
    const payload = {
      title: `SOP: ${topic}`,
      steps: [
        "Define objective & owner",
        "Collect inputs & constraints",
        "Run the automation",
        "QA output & handle exceptions",
        "Log result to Supabase",
      ],
    };
    return ok(payload, ["task=generate_sop"]);
  }

  return bad("Unknown task");
});