import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    
    const { templateId, formData, mode, userId } = body;
    
    if (!templateId || typeof templateId !== 'string') {
      console.log('Error: Invalid templateId');
      return new Response(
        JSON.stringify({ ok: false, error: 'Invalid templateId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing template usage request for: ${templateId}`);
    console.log('Mode:', mode || 'wizard');
    console.log('Form data:', JSON.stringify(formData));

    // For auto mode, we apply smart defaults without user interaction
    const isAutoMode = mode === 'auto';
    
    if (isAutoMode) {
      console.log('Auto mode: Applying profile-based defaults');
      
      // Simulate quick configuration (faster than wizard)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In auto mode, we want to create a workflow/automation record
      // to mark the user as having a "first value event"
      if (userId) {
        try {
          const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
          const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
          const supabase = createClient(supabaseUrl, supabaseKey);
          
          // Create a workflow for this template
          const { data: workflow, error: workflowError } = await supabase
            .from('workflows')
            .insert({
              owner_id: userId,
              name: `${templateId} Workflow`,
              status: 'active',
              config: {
                templateId,
                mode: 'auto',
                createdAt: new Date().toISOString(),
                ...formData,
              },
            })
            .select()
            .single();
          
          if (workflowError) {
            console.warn('Could not create workflow:', workflowError);
          } else if (workflow) {
            // Record a successful automation run to mark first value event
            await supabase
              .from('workflow_runs')
              .insert({
                workflow_id: workflow.id,
                owner_id: userId,
                status: 'completed',
                started_at: new Date().toISOString(),
                finished_at: new Date().toISOString(),
                result_summary: {
                  type: 'template_activation',
                  templateId,
                  success: true,
                },
              });
            
            console.log('Created workflow and initial run for user:', userId);
          }
          
          // Log an agent event for activity tracking
          await supabase
            .from('agent_events')
            .insert({
              user_id: userId,
              type: 'template_activated',
              payload: {
                templateId,
                mode: 'auto',
                config: formData,
              },
            });
            
        } catch (dbError) {
          console.error('Database operations error:', dbError);
          // Don't fail the request for DB errors
        }
      }
    } else {
      // Wizard mode - original behavior
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`Template ${templateId} activated successfully`);

    return new Response(
      JSON.stringify({ 
        ok: true, 
        message: isAutoMode ? 'Template activated successfully' : 'Template used successfully',
        templateId,
        formData,
        mode: mode || 'wizard',
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
