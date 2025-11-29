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
    const { owner_id } = await req.json();

    if (!owner_id) {
      return new Response(
        JSON.stringify({ error: 'owner_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Fetching dashboard stats for owner: ${owner_id}`);

    // Get lead statistics
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('status, created_at, name, email, company')
      .eq('owner_id', owner_id);

    if (leadsError) {
      console.error('Error fetching leads:', leadsError);
      throw leadsError;
    }

    // Count leads by status
    const leadsByStatus = leads?.reduce((acc: any, lead) => {
      const status = lead.status || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {}) || {};

    // Get recent leads (last 5)
    const recentLeads = leads
      ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
      .map(l => ({
        name: l.name,
        email: l.email,
        company: l.company,
        status: l.status,
        created_at: l.created_at
      })) || [];

    // Get task statistics
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('status, priority')
      .eq('user_id', owner_id);

    if (tasksError) {
      console.error('Error fetching tasks:', tasksError);
    }

    const tasksByStatus = tasks?.reduce((acc: any, task) => {
      const status = task.status || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {}) || {};

    const tasksByPriority = tasks?.reduce((acc: any, task) => {
      const priority = task.priority || 'normal';
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {}) || {};

    // Get template statistics
    const { data: userTemplates, error: templatesError } = await supabase
      .from('user_templates')
      .select('template_id, last_used_at, is_active')
      .eq('user_id', owner_id);

    if (templatesError) {
      console.error('Error fetching templates:', templatesError);
    }

    const activeTemplates = userTemplates?.filter(t => t.is_active).length || 0;
    const totalTemplates = userTemplates?.length || 0;

    // Build response
    const stats = {
      leads: {
        total: leads?.length || 0,
        by_status: leadsByStatus,
        recent: recentLeads
      },
      tasks: {
        total: tasks?.length || 0,
        by_status: tasksByStatus,
        by_priority: tasksByPriority
      },
      templates: {
        active: activeTemplates,
        total: totalTemplates
      },
      summary: `You have ${leads?.length || 0} leads (${leadsByStatus.new || 0} new, ${leadsByStatus.qualified || 0} qualified, ${leadsByStatus.contacted || 0} contacted), ${tasks?.length || 0} tasks (${tasksByStatus.pending || 0} pending), and ${activeTemplates} active templates.`
    };

    console.log('Dashboard stats generated successfully');

    return new Response(
      JSON.stringify(stats),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in get_owner_dashboard_stats:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
