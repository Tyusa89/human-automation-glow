import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Supported template IDs for scaffolding
const supportedTemplates = [
  'inventory-manager',
  'data-enrichment',
];

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method === 'POST') {
      const { templateId } = await req.json()
      
      if (!templateId) {
        return new Response(
          JSON.stringify({ ok: false, error: 'templateId is required' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        )
      }

      if (!supportedTemplates.includes(templateId)) {
        return new Response(
          JSON.stringify({ ok: false, error: `Unknown templateId: ${templateId}` }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        )
      }

      // Simulate scaffolding process
      console.log(`Scaffolding template: ${templateId}`)
      
      // In a real implementation, this would:
      // 1. Create database tables/schemas for the template
      // 2. Set up initial data
      // 3. Configure permissions
      // 4. Generate starter files
      // 5. Return a redirect URL to the new project

      // For now, return success with optional next step
      return new Response(
        JSON.stringify({ 
          ok: true, 
          message: `Template ${templateId} scaffolded successfully`,
          next: `/dashboard?template=${templateId}` // Optional redirect
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    return new Response(
      JSON.stringify({ ok: false, error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Scaffold error:', error)
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})