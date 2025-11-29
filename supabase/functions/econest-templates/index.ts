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
    const { op, owner_id, payload } = await req.json() as {
      op: "list_templates" | "list_owned" | "install_template";
      owner_id: string;
      payload?: any;
    };

    if (!owner_id) return json({ error: "owner_id required" }, 400);

    if (op === "list_templates") {
      const { data, error } = await supabase
        .from("templates")
        .select(
          "id, slug, name, description, category"
        )
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      return json({ templates: data ?? [] });
    }

    if (op === "list_owned") {
      const { data, error } = await supabase
        .from("user_templates")
        .select(
          "template_id, is_active, purchased_at, templates(name, slug, category)"
        )
        .eq("user_id", owner_id)
        .eq("is_active", true);

      if (error) throw error;
      return json({ user_templates: data ?? [] });
    }

    if (op === "install_template") {
      const { template_id, source, override_config } = payload ?? {};
      const { data, error } = await supabase
        .from("user_templates")
        .insert({
          user_id: owner_id,
          template_id,
          source: source ?? "agent_install",
          agent_config_override: override_config ?? {},
          is_active: true,
        })
        .select("id")
        .single();

      if (error) throw error;
      return json({ success: true, id: data.id });
    }

    return json({ error: "Unknown op" }, 400);
  } catch (err: any) {
    console.error("econest-templates error", err);
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
