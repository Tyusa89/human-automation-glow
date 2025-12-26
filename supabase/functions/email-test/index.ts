import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TestEmailRequest {
  to: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY is missing (check Secrets)" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { to }: TestEmailRequest = await req.json();

    if (!to || typeof to !== "string") {
      return new Response(
        JSON.stringify({ error: 'Missing "to" email in request body' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Sending test email to: ${to}`);

    const resend = new Resend(resendApiKey);
    const from = Deno.env.get("RESEND_FROM_EMAIL") || "onboarding@resend.dev";

    const result = await resend.emails.send({
      from,
      to: [to],
      subject: "EcoNest Test Email ✅",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h1>EcoNest Email is working ✅</h1>
          <p>If you got this, your RESEND_API_KEY is configured correctly.</p>
        </div>
      `,
    });

    if ((result as any)?.error) {
      console.error("Resend error:", (result as any).error);
      return new Response(
        JSON.stringify({ error: (result as any).error }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Email sent successfully:", result);
    return new Response(
      JSON.stringify({ ok: true, result }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (e: any) {
    console.error("Error in email-test function:", e);
    return new Response(
      JSON.stringify({ error: e?.message ?? "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
