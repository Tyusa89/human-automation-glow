import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

serve(async (req: Request) => {
  // CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (req.method !== "POST") {
    return json({ error: "Only POST allowed" }, 405);
  }

  try {
    const { op, owner_id, payload } = await req.json() as {
      op: "get_summary" | "create_lead";
      owner_id: string;
      payload?: any;
    };

    if (!owner_id) {
      return json({ error: "owner_id required" }, 400);
    }

    if (op === "get_summary") {
      const [total, fresh, warm, customers] = await Promise.all([
        supabase
          .from("leads")
          .select("id", { count: "exact", head: true })
          .eq("owner_id", owner_id),
        supabase
          .from("leads")
          .select("id", { count: "exact", head: true })
          .eq("owner_id", owner_id)
          .eq("status", "new"),
        supabase
          .from("leads")
          .select("id", { count: "exact", head: true })
          .eq("owner_id", owner_id)
          .eq("status", "warm"),
        supabase
          .from("leads")
          .select("id", { count: "exact", head: true })
          .eq("owner_id", owner_id)
          .eq("status", "customer"),
      ]);

      return json({
        total: total.count ?? 0,
        new: fresh.count ?? 0,
        warm: warm.count ?? 0,
        customers: customers.count ?? 0,
      });
    }

    if (op === "create_lead") {
      const { email, name, source, notes } = payload ?? {};
      const { data, error } = await supabase
        .from("leads")
        .insert({
          owner_id,
          email,
          name,
          source: source ?? "agent",
          notes: notes ?? null,
        })
        .select("id, email, status")
        .single();

      if (error) throw error;
      return json({ success: true, lead: data });
    }

    return json({ error: "Unknown op" }, 400);
  } catch (err: any) {
    console.error("econest-leads error", err);
    return json({ error: err.message ?? "unexpected error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
