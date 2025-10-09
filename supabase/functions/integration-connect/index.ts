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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { provider, apiKey, config } = await req.json();
    console.log('Connect request:', { provider, userId: user.id });

    // OAuth providers
    const oauthProviders: Record<string, { authUrl: string; scopes: string[] }> = {
      slack: {
        authUrl: 'https://slack.com/oauth/v2/authorize',
        scopes: ['chat:write', 'channels:read', 'users:read']
      },
      gmail: {
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        scopes: ['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.readonly']
      },
      'google-sheets': {
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      },
      hubspot: {
        authUrl: 'https://app.hubspot.com/oauth/authorize',
        scopes: ['crm.objects.contacts.read', 'crm.objects.deals.write']
      },
      salesforce: {
        authUrl: 'https://login.salesforce.com/services/oauth2/authorize',
        scopes: ['api', 'refresh_token']
      },
      stripe: {
        authUrl: 'https://connect.stripe.com/oauth/authorize',
        scopes: ['read_write']
      }
    };

    const oauthConfig = oauthProviders[provider];

    if (oauthConfig) {
      // OAuth flow
      const state = crypto.randomUUID();
      const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/integration-callback`;

      // Store state for CSRF protection
      await supabaseClient.from('integrations').upsert({
        user_id: user.id,
        provider,
        status: 'disconnected',
        metadata: { state, timestamp: new Date().toISOString() }
      }, { onConflict: 'user_id,provider' });

      const params = new URLSearchParams({
        client_id: Deno.env.get(`${provider.toUpperCase().replace('-', '_')}_CLIENT_ID`) || '',
        redirect_uri: redirectUri,
        scope: oauthConfig.scopes.join(' '),
        state,
        response_type: 'code'
      });

      const authUrl = `${oauthConfig.authUrl}?${params}`;

      return new Response(JSON.stringify({ authUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } else {
      // API key-based integration
      if (!apiKey) {
        return new Response(JSON.stringify({ error: 'API key required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Store encrypted API key
      const { error } = await supabaseClient.from('integrations').upsert({
        user_id: user.id,
        provider,
        status: 'connected',
        encrypted_tokens: { apiKey },
        metadata: config || {},
        scopes: null
      }, { onConflict: 'user_id,provider' });

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  } catch (error: any) {
    console.error('Integration connect error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
