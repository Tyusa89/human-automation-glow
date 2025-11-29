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

    const { op, owner_id, payload } = await req.json();

    if (!owner_id) {
      return new Response(
        JSON.stringify({ error: 'owner_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[agentkit-leads] Operation: ${op}, Owner: ${owner_id}`);

    // Get lead summary stats
    if (op === 'get_summary') {
      const [total, fresh, warm, customers] = await Promise.all([
        supabase
          .from('leads')
          .select('id', { count: 'exact', head: true })
          .eq('owner_id', owner_id),
        supabase
          .from('leads')
          .select('id', { count: 'exact', head: true })
          .eq('owner_id', owner_id)
          .eq('status', 'new'),
        supabase
          .from('leads')
          .select('id', { count: 'exact', head: true })
          .eq('owner_id', owner_id)
          .eq('status', 'warm'),
        supabase
          .from('leads')
          .select('id', { count: 'exact', head: true })
          .eq('owner_id', owner_id)
          .eq('status', 'customer'),
      ]);

      return new Response(
        JSON.stringify({
          total: total.count ?? 0,
          new: fresh.count ?? 0,
          warm: warm.count ?? 0,
          customers: customers.count ?? 0,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a new lead
    if (op === 'create_lead') {
      const { email, name, source, notes } = payload ?? {};
      
      const { data, error } = await supabase
        .from('leads')
        .insert({
          owner_id,
          email,
          name,
          source: source ?? 'agent',
          notes: notes ?? null,
        })
        .select('id, email, status, name')
        .single();

      if (error) {
        console.error('[agentkit-leads] Create error:', error);
        throw error;
      }

      console.log('[agentkit-leads] Lead created:', data.id);

      return new Response(
        JSON.stringify({ success: true, lead: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Unknown operation. Use: get_summary, create_lead' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[agentkit-leads] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message ?? 'Unexpected error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
