import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Body = {
  report_type: "monthly" | "weekly" | "custom";
  title?: string;
  params?: Record<string, unknown>;
};

function htmlTemplate(opts: {
  title: string;
  reportType: string;
  createdAt: string;
  summaryLines: string[];
}) {
  const items = opts.summaryLines.map((s) => `<li>${s}</li>`).join("");
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${opts.title}</title>
  <style>
    body { font-family: ui-sans-serif, system-ui; background:#050B16; color:#fff; margin:0; padding:32px; }
    .card { max-width: 880px; margin: 0 auto; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.14); border-radius: 20px; padding: 24px; }
    .muted { color: rgba(255,255,255,0.65); }
    h1 { margin: 0 0 8px; font-size: 28px; }
    ul { margin: 12px 0 0; line-height: 1.7; }
    .pill { display:inline-block; padding:6px 10px; border-radius: 999px; background: rgba(16,185,129,0.18); border:1px solid rgba(16,185,129,0.28); color:#A7F3D0; font-size: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="pill">${opts.reportType.toUpperCase()}</div>
    <h1>${opts.title}</h1>
    <div class="muted">Generated: ${opts.createdAt}</div>
    <h3 style="margin-top:18px;">Summary</h3>
    <ul>${items}</ul>
  </div>
</body>
</html>`;
}

serve(async (req: Request) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing Authorization" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // verify user
    const jwt = authHeader.replace("Bearer ", "");
    const supabaseAuthed = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });

    const { data: userData, error: userErr } = await supabaseAuthed.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    const body = (await req.json()) as Body;
    const reportType = body.report_type;
    const title =
      body.title ||
      (reportType === "monthly"
        ? "Monthly Summary"
        : reportType === "weekly"
          ? "Weekly Activity"
          : "Custom Report");

    const now = new Date();
    const createdAt = now.toISOString();

    // TODO: Replace these with real metrics pulled from your tables
    const summaryLines = [
      "Data sources: contacts, leads, appointments (placeholder).",
      `Params: ${JSON.stringify(body.params ?? {})}`,
      "Next: add real aggregates (counts, growth, pipeline).",
    ];

    const html = htmlTemplate({
      title,
      reportType,
      createdAt,
      summaryLines,
    });

    // upload to private storage
    const filePath = `${userId}/${reportType}/${now.getTime()}-${crypto.randomUUID()}.html`;

    const uploadRes = await supabaseAdmin.storage
      .from("reports")
      .upload(filePath, new Blob([html], { type: "text/html" }), {
        upsert: false,
        contentType: "text/html",
      });

    if (uploadRes.error) {
      return new Response(JSON.stringify({ error: uploadRes.error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // insert row
    const { data: reportRow, error: insertErr } = await supabaseAdmin
      .from("reports")
      .insert({
        user_id: userId,
        report_type: reportType,
        title,
        params: body.params ?? {},
        file_bucket: "reports",
        file_path: filePath,
        status: "ready",
      })
      .select()
      .single();

    if (insertErr) {
      return new Response(JSON.stringify({ error: insertErr.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ report: reportRow }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});