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

    console.log(`[agentkit-templates] Operation: ${op}, Owner: ${owner_id}`);

    // List all active marketplace templates
    if (op === 'list_templates') {
      const { data, error } = await supabase
        .from('templates')
        .select('id, slug, name, description, category')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('[agentkit-templates] List error:', error);
        throw error;
      }

      return new Response(
        JSON.stringify({ templates: data ?? [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // List templates owned by user
    if (op === 'list_owned') {
      const { data, error } = await supabase
        .from('user_templates')
        .select(`
          template_id,
          is_active,
          purchased_at,
          templates (
            name,
            slug,
            category
          )
        `)
        .eq('user_id', owner_id)
        .eq('is_active', true);

      if (error) {
        console.error('[agentkit-templates] List owned error:', error);
        throw error;
      }

      return new Response(
        JSON.stringify({ user_templates: data ?? [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Install/activate a template for user
    if (op === 'install_template') {
      const { template_id, source, override_config } = payload ?? {};

      if (!template_id) {
        return new Response(
          JSON.stringify({ error: 'template_id is required for install_template' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data, error } = await supabase
        .from('user_templates')
        .insert({
          user_id: owner_id,
          template_id,
          source: source ?? 'agent_install',
          agent_config_override: override_config ?? {},
          is_active: true,
        })
        .select('id')
        .single();

      if (error) {
        console.error('[agentkit-templates] Install error:', error);
        throw error;
      }

      console.log('[agentkit-templates] Template installed:', data.id);

      return new Response(
        JSON.stringify({ success: true, id: data.id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Unknown operation. Use: list_templates, list_owned, install_template' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[agentkit-templates] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message ?? 'Unexpected error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
