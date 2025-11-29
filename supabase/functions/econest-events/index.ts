import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return cors("ok");
  }
  if (req.method !== "POST") {
    return json({ error: "Only POST allowed" }, 405);
  }

  try {
    const { owner_id, type, payload } = await req.json() as {
      owner_id: string;
      type: string;
      payload?: any;
    };

    if (!owner_id || !type) {
      return json({ error: "owner_id and type required" }, 400);
    }

    const { error } = await supabase.from("agent_events").insert({
      user_id: owner_id,
      type,
      payload: payload ?? {},
    });

    if (error) throw error;
    return json({ success: true });
  } catch (err: any) {
    console.error("econest-events error", err);
    return json({ error: err.message ?? "unexpected error" }, 500);
  }
});

function cors(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
