import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-signature',
};

interface LeadData {
  name: string;
  email: string;
  source?: string;
  notes?: string;
  org_id?: string;
  company?: string;
}

interface WorkflowContext {
  lead: any;
  route: 'high' | 'standard';
  score: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Lead workflow triggered');

    // Step 1: Parse and validate input
    const body = await req.json();
    const { name, email, source, notes, org_id, company } = body as LeadData;

    if (!name || !email) {
      throw new Error('Missing required fields: name and email');
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    console.log('Processing lead:', { name, email: normalizedEmail, source });

    // Step 2: Dedupe & Enrich - Find or create lead
    const { data: existingLead, error: findError } = await supabase
      .from('leads')
      .select('*')
      .eq('email', normalizedEmail)
      .maybeSingle();

    let leadId: string;
    let isNew = false;

    if (existingLead) {
      // Update existing lead
      const { data: updated, error: updateError } = await supabase
        .from('leads')
        .update({
          name,
          source: source || existingLead.source,
          notes: notes ? `${existingLead.notes || ''}\n${notes}`.trim() : existingLead.notes,
          company: company || existingLead.company,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingLead.id)
        .select()
        .single();

      if (updateError) throw updateError;
      leadId = existingLead.id;
      console.log('Updated existing lead:', leadId);
    } else {
      // Create new lead
      const { data: created, error: createError } = await supabase
        .from('leads')
        .insert({
          name,
          email: normalizedEmail,
          source: source || 'webhook',
          notes,
          company,
          status: 'new',
        })
        .select()
        .single();

      if (createError) throw createError;
      leadId = created.id;
      isNew = true;
      console.log('Created new lead:', leadId);
    }

    // Step 3: Score and route
    const score = calculateLeadScore({ name, email: normalizedEmail, source, company, notes });
    const route = score >= 70 ? 'high' : 'standard';

    console.log('Lead score:', score, 'Route:', route);

    // Fetch the updated lead with all fields
    const { data: fullLead } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    const context: WorkflowContext = {
      lead: { 
        ...fullLead,
        id: leadId, 
        name, 
        email: normalizedEmail, 
        source, 
        company, 
        score 
      },
      route,
      score,
    };

    // Step 4: Execute route-specific actions
    if (route === 'standard') {
      await handleStandardRoute(supabase, context);
    } else {
      await handleHighPriorityRoute(supabase, context);
    }

    // Prepare standardized response
    const response = {
      leadId,
      crmDealUrl: context.lead.crm_deal_url || null,
      enrichment: context.lead.enrichment || { company: company || null },
      status: context.lead.status,
      step: route === 'high' ? 'lead_qualified' : 'lead_enriched',
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Workflow error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function calculateLeadScore(lead: LeadData): number {
  let score = 50; // Base score

  // Email domain scoring
  const domain = lead.email.split('@')[1];
  const businessDomains = ['company', 'corp', 'inc', 'enterprise'];
  if (businessDomains.some(bd => domain?.includes(bd))) {
    score += 20;
  }

  // Source scoring
  const highValueSources = ['referral', 'partner', 'event', 'demo'];
  if (lead.source && highValueSources.includes(lead.source.toLowerCase())) {
    score += 15;
  }

  // Company provided
  if (lead.company && lead.company.length > 0) {
    score += 10;
  }

  // Notes/message length (indicates engagement)
  if (lead.notes && lead.notes.length > 100) {
    score += 5;
  }

  return Math.min(score, 100);
}

async function handleStandardRoute(supabase: any, context: WorkflowContext) {
  console.log('Executing standard route actions');

  // Update lead with nurture tag and enrichment
  const enrichment = {
    company: context.lead.company || null,
    score: context.score,
    route: 'standard',
    processed_at: new Date().toISOString(),
  };

  const { data: updated } = await supabase
    .from('leads')
    .update({
      status: 'nurture',
      enrichment,
    })
    .eq('id', context.lead.id)
    .select()
    .single();

  if (updated) {
    context.lead.status = updated.status;
    context.lead.enrichment = updated.enrichment;
  }

  // Send Slack notification (if webhook configured)
  const slackWebhook = Deno.env.get('SLACK_WEBHOOK_URL');
  if (slackWebhook) {
    try {
      await fetch(slackWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `📋 New lead: ${context.lead.name} (${context.lead.email})`,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*New Lead Captured*\n*Name:* ${context.lead.name}\n*Email:* ${context.lead.email}\n*Source:* ${context.lead.source || 'unknown'}\n*Score:* ${context.score}/100`,
              },
            },
          ],
        }),
      });
      console.log('Slack notification sent (standard)');
    } catch (error) {
      console.error('Slack notification failed:', error);
    }
  }

  // Create follow-up task
  await supabase.from('tasks').insert({
    title: `Follow up with ${context.lead.name}`,
    description: `New lead from ${context.lead.source || 'website'}. Email: ${context.lead.email}`,
    lead_email: context.lead.email,
    status: 'pending',
    priority: 'normal',
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days
  });
}

async function handleHighPriorityRoute(supabase: any, context: WorkflowContext) {
  console.log('Executing high priority route actions');

  // Generate mock CRM deal URL (replace with actual CRM integration)
  const crmDealUrl = `https://crm.example.com/deals/${context.lead.id}`;

  // Update lead status with enrichment and CRM link
  const enrichment = {
    company: context.lead.company || null,
    score: context.score,
    route: 'high_priority',
    qualified_at: new Date().toISOString(),
  };

  const { data: updated } = await supabase
    .from('leads')
    .update({
      status: 'qualified',
      crm_deal_url: crmDealUrl,
      enrichment,
    })
    .eq('id', context.lead.id)
    .select()
    .single();

  if (updated) {
    context.lead.status = updated.status;
    context.lead.crm_deal_url = updated.crm_deal_url;
    context.lead.enrichment = updated.enrichment;
  }

  // Send priority Slack notification
  const slackWebhook = Deno.env.get('SLACK_WEBHOOK_URL');
  if (slackWebhook) {
    try {
      await fetch(slackWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🚨 HIGH PRIORITY LEAD: ${context.lead.name}`,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*🚨 HIGH PRIORITY LEAD*\n*Name:* ${context.lead.name}\n*Email:* ${context.lead.email}\n*Company:* ${context.lead.company || 'N/A'}\n*Source:* ${context.lead.source || 'unknown'}\n*Score:* ${context.score}/100`,
              },
            },
            {
              type: 'actions',
              elements: [
                {
                  type: 'button',
                  text: { type: 'plain_text', text: '👤 Assign to Me' },
                  style: 'primary',
                  value: context.lead.id,
                },
                {
                  type: 'button',
                  text: { type: 'plain_text', text: '📞 Schedule Call' },
                  value: context.lead.id,
                },
              ],
            },
          ],
        }),
      });
      console.log('Slack notification sent (high priority)');
    } catch (error) {
      console.error('Slack notification failed:', error);
    }
  }

  // Create urgent task
  await supabase.from('tasks').insert({
    title: `🔥 URGENT: Contact ${context.lead.name}`,
    description: `High-value lead (score: ${context.score}/100). Immediate follow-up required.\nEmail: ${context.lead.email}\nCompany: ${context.lead.company || 'N/A'}`,
    lead_email: context.lead.email,
    status: 'pending',
    priority: 'urgent',
    due_date: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours
  });

  console.log('High priority workflow completed');
}
