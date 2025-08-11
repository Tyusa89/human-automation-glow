import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

  try {
    const { task, params = {} } = await req.json();

    if (!task) {
      return new Response(JSON.stringify({ status: "error", error: "task required" }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Running task: ${task}`, params);

    if (task === "daily_kpi") {
      const payload = {
        date: new Date().toISOString().slice(0, 10),
        leads_today: 7,
        tasks_run: 14,
        avg_response_min: 9,
        anomalies: ["Leads from FB Ads spiked 3x", "CRM sync skipped 2 rows"]
      };
      return new Response(JSON.stringify({ status: "ok", payload }), { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    if (task === "generate_sop") {
      const { topic = "Untitled" } = params;
      const payload = {
        title: `SOP: ${topic}`,
        steps: [
          "Define the objective and owner",
          "Collect inputs and constraints",
          "Run the automation task",
          "QA the output and escalate exceptions",
          "Log result to Supabase `results`"
        ]
      };
      return new Response(JSON.stringify({ status: "ok", payload }), { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    return new Response(JSON.stringify({ status: "error", error: "unknown task" }), { 
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ status: "error", error: "server_error" }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});