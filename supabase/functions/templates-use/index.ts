import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ ok: false, error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { templateId } = await req.json();
    
    if (!templateId || typeof templateId !== 'string') {
      return new Response(
        JSON.stringify({ ok: false, error: 'Invalid templateId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing template usage request for: ${templateId}`);

    // Here you would implement the actual template usage logic
    // For now, we'll simulate the process
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate work

    // Log successful template usage
    console.log(`Template ${templateId} used successfully`);

    return new Response(
      JSON.stringify({ 
        ok: true, 
        message: 'Template used successfully',
        templateId,
        next: `/dashboard?template=${templateId}` // Optional redirect
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error processing template usage:', error);
    
    return new Response(
      JSON.stringify({ 
        ok: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});