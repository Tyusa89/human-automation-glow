import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { owner_id, type, payload } = await req.json();

    if (!owner_id || !type) {
      return new Response(
        JSON.stringify({ error: 'owner_id and type are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[agentkit-events] Logging event: ${type} for user: ${owner_id}`);

    const { error } = await supabase.from('agent_events').insert({
      user_id: owner_id,
      type,
      payload: payload ?? {},
    });

    if (error) {
      console.error('[agentkit-events] Insert error:', error);
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[agentkit-events] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message ?? 'Unexpected error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
