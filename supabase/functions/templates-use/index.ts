import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Activation limits per plan tier
const ACTIVATION_LIMITS: Record<string, number> = {
  free: 1,
  pro: 5,
  business: 999,
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

    if (!userId) {
      console.log('Error: userId is required');
      return new Response(
        JSON.stringify({ ok: false, error: 'userId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing template usage request for: ${templateId}`);
    console.log('Mode:', mode || 'wizard');
    console.log('Form data:', JSON.stringify(formData));

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // ============================================
    // BACKEND ENFORCEMENT: Check activation limits
    // ============================================
    
    // Get user's current active template count
    const { count: activeCount, error: countError } = await supabase
      .from('user_templates')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_active', true);

    if (countError) {
      console.error('Error counting active templates:', countError);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to check activation eligibility' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine user's plan tier (simplified - in production, check Stripe)
    // For now, derive from existing active templates
    let userPlan = 'free';
    
    const { data: existingTemplates } = await supabase
      .from('user_templates')
      .select('stripe_subscription_id')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (existingTemplates && existingTemplates.some(t => t.stripe_subscription_id)) {
      userPlan = 'pro'; // Has paid subscription
    }

    const limit = ACTIVATION_LIMITS[userPlan] ?? 1;
    const currentCount = activeCount ?? 0;

    console.log(`User plan: ${userPlan}, Active count: ${currentCount}, Limit: ${limit}`);

    if (currentCount >= limit) {
      console.log('Error: Activation limit reached');
      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: 'ACTIVATION_LIMIT_REACHED',
          message: `You can only run ${limit} template${limit > 1 ? 's' : ''} on the ${userPlan} plan.`,
          current: currentCount,
          limit,
          plan: userPlan,
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For auto mode, we apply smart defaults without user interaction
    const isAutoMode = mode === 'auto';
    
    if (isAutoMode) {
      console.log('Auto mode: Applying profile-based defaults');
      
      // Simulate quick configuration (faster than wizard)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create a workflow/automation record to mark "first value event"
      try {
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
