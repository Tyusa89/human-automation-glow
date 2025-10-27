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
    console.log('=== Template Use Function Called ===');
    console.log('Method:', req.method);
    
    if (req.method !== 'POST') {
      console.log('Error: Method not allowed');
      return new Response(
        JSON.stringify({ ok: false, error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    console.log('Request body:', JSON.stringify(body));
    
    const { templateId, formData } = body;
    
    if (!templateId || typeof templateId !== 'string') {
      console.log('Error: Invalid templateId');
      return new Response(
        JSON.stringify({ ok: false, error: 'Invalid templateId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing template usage request for: ${templateId}`);
    console.log('Form data:', JSON.stringify(formData));

    // Simulate template generation
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log(`Template ${templateId} used successfully`);

    return new Response(
      JSON.stringify({ 
        ok: true, 
        message: 'Template used successfully',
        templateId,
        formData,
        next: `/template-success?template=${templateId}`
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('=== Error in Template Use Function ===');
    console.error('Error details:', error);
    
    return new Response(
      JSON.stringify({ 
        ok: false, 
        error: error instanceof Error ? error.message : 'Internal server error',
        details: error instanceof Error ? error.stack : String(error)
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});