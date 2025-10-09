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
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      return Response.redirect(`${Deno.env.get('APP_URL')}/integrations?error=${error}`);
    }

    if (!code || !state) {
      return Response.redirect(`${Deno.env.get('APP_URL')}/integrations?error=missing_params`);
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Find integration by state (CSRF check)
    const { data: integration, error: fetchError } = await supabaseAdmin
      .from('integrations')
      .select('*')
      .eq('metadata->>state', state)
      .single();

    if (fetchError || !integration) {
      console.error('State validation failed:', fetchError);
      return Response.redirect(`${Deno.env.get('APP_URL')}/integrations?error=invalid_state`);
    }

    const provider = integration.provider;
    const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/integration-callback`;

    // Exchange code for tokens
    let tokenResponse;
    const clientId = Deno.env.get(`${provider.toUpperCase().replace('-', '_')}_CLIENT_ID`);
    const clientSecret = Deno.env.get(`${provider.toUpperCase().replace('-', '_')}_CLIENT_SECRET`);

    if (provider === 'slack') {
      tokenResponse = await fetch('https://slack.com/api/oauth.v2.access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId!,
          client_secret: clientSecret!,
          code,
          redirect_uri: redirectUri
        })
      });
    } else if (provider === 'gmail' || provider === 'google-sheets') {
      tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId!,
          client_secret: clientSecret!,
          code,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        })
      });
    } else if (provider === 'hubspot') {
      tokenResponse = await fetch('https://api.hubapi.com/oauth/v1/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: clientId!,
          client_secret: clientSecret!,
          redirect_uri: redirectUri,
          code
        })
      });
    }

    const tokens = await tokenResponse!.json();
    console.log('Token exchange successful for:', provider);

    // Update integration with tokens
    const { error: updateError } = await supabaseAdmin
      .from('integrations')
      .update({
        status: 'connected',
        encrypted_tokens: tokens,
        last_sync: new Date().toISOString(),
        error_message: null,
        metadata: { connected_at: new Date().toISOString() }
      })
      .eq('id', integration.id);

    if (updateError) throw updateError;

    // Redirect back to integrations page
    return Response.redirect(`${Deno.env.get('APP_URL')}/integrations?connected=${provider}`);

  } catch (error: any) {
    console.error('OAuth callback error:', error);
    return Response.redirect(`${Deno.env.get('APP_URL')}/integrations?error=connection_failed`);
  }
});
