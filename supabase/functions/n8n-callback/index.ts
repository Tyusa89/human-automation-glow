import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-signature',
};

interface CallbackPayload {
  leadId: string;
  crmDealUrl?: string;
  enrichment?: any;
  status: 'qualified' | 'disqualified' | 'needs_info';
  step?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const n8nCallbackSecret = Deno.env.get('N8N_CALLBACK_SECRET');

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('n8n callback received');

    // Step 1: Verify HMAC signature
    const signature = req.headers.get('x-signature');
    const rawBody = await req.text();

    if (n8nCallbackSecret && signature) {
      const isValid = await verifyHmacSignature(rawBody, signature, n8nCallbackSecret);
      if (!isValid) {
        console.error('Invalid HMAC signature');
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      console.log('HMAC signature verified');
    } else {
      console.warn('No signature verification configured');
    }

    const payload: CallbackPayload = JSON.parse(rawBody);
    const { leadId, crmDealUrl, enrichment, status, step } = payload;

    if (!leadId || !status) {
      throw new Error('Missing required fields: leadId and status');
    }

    console.log('Processing callback:', { leadId, status, step });

    // Step 2: Apply basic updates
    const baseUpdates: any = {
      updated_at: new Date().toISOString(),
    };

    if (crmDealUrl) baseUpdates.crm_deal_url = crmDealUrl;
    if (enrichment) baseUpdates.enrichment = enrichment;

    await supabase
      .from('leads')
      .update(baseUpdates)
      .eq('id', leadId);

    console.log('Base updates applied');

    // Step 3: Route based on status
    const slackWebhook = Deno.env.get('SLACK_WEBHOOK_URL');

    switch (status) {
      case 'qualified':
        await handleQualifiedLead(supabase, leadId, crmDealUrl, slackWebhook);
        break;

      case 'disqualified':
        await handleDisqualifiedLead(supabase, leadId);
        break;

      case 'needs_info':
        await handleNeedsInfoLead(supabase, leadId, slackWebhook);
        break;

      default:
        console.warn('Unknown status:', status);
    }

    return new Response(
      JSON.stringify({
        success: true,
        leadId,
        status,
        message: `Lead ${leadId} updated to ${status}`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Callback error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function verifyHmacSignature(
  rawBody: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBytes = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(rawBody)
    );

    const expectedSignature = Array.from(new Uint8Array(signatureBytes))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Use constant-time comparison to prevent timing attacks
    return timingSafeEqual(signature.toLowerCase(), expectedSignature.toLowerCase());
  } catch (error) {
    console.error('HMAC verification error:', error);
    return false;
  }
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  const aBytes = new TextEncoder().encode(a);
  const bBytes = new TextEncoder().encode(b);
  
  let result = 0;
  for (let i = 0; i < aBytes.length; i++) {
    result |= aBytes[i] ^ bBytes[i];
  }
  
  return result === 0;
}

async function handleQualifiedLead(
  supabase: any,
  leadId: string,
  crmDealUrl: string | undefined,
  slackWebhook: string | undefined
) {
  console.log('Handling qualified lead:', leadId);

  // Update lead to qualified with sales owner
  const { data: lead } = await supabase
    .from('leads')
    .update({
      status: 'qualified',
    })
    .eq('id', leadId)
    .select()
    .single();

  if (!lead) {
    console.error('Lead not found:', leadId);
    return;
  }

  // Create high-priority task
  await supabase.from('tasks').insert({
    title: `🎯 Qualified Lead: ${lead.name || 'Contact'}`,
    description: `Lead has been qualified by n8n workflow.\nEmail: ${lead.email}\nCRM: ${crmDealUrl || 'N/A'}`,
    lead_email: lead.email,
    status: 'pending',
    priority: 'urgent',
    due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day
  });

  // Send Slack notification
  if (slackWebhook) {
    try {
      await fetch(slackWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `✅ Qualified → ${leadId}`,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Lead Qualified*\n*Name:* ${lead.name || 'Unknown'}\n*Email:* ${lead.email}\n*CRM Deal:* ${crmDealUrl ? `<${crmDealUrl}|View Deal>` : 'N/A'}`,
              },
            },
            {
              type: 'actions',
              elements: [
                {
                  type: 'button',
                  text: { type: 'plain_text', text: '👤 Assign to Me' },
                  style: 'primary',
                  value: leadId,
                },
              ],
            },
          ],
        }),
      });
      console.log('Slack notification sent for qualified lead');
    } catch (error) {
      console.error('Slack notification failed:', error);
    }
  }
}

async function handleDisqualifiedLead(supabase: any, leadId: string) {
  console.log('Handling disqualified lead:', leadId);

  await supabase
    .from('leads')
    .update({
      status: 'disqualified',
    })
    .eq('id', leadId);

  console.log('Lead marked as disqualified');
}

async function handleNeedsInfoLead(
  supabase: any,
  leadId: string,
  slackWebhook: string | undefined
) {
  console.log('Handling needs-info lead:', leadId);

  const { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .single();

  if (!lead) {
    console.error('Lead not found:', leadId);
    return;
  }

  // Create task for information gathering
  await supabase.from('tasks').insert({
    title: `📋 Request Info: ${lead.name || 'Contact'}`,
    description: `Additional information needed for this lead.\nEmail: ${lead.email}`,
    lead_email: lead.email,
    status: 'pending',
    priority: 'normal',
    due_date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 2 days
  });

  // Send Slack notification
  if (slackWebhook) {
    try {
      await fetch(slackWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `ℹ️ Need more info → ${leadId}`,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Additional Information Needed*\n*Name:* ${lead.name || 'Unknown'}\n*Email:* ${lead.email}\n*Company:* ${lead.company || 'N/A'}`,
              },
            },
          ],
        }),
      });
      console.log('Slack notification sent for needs-info lead');
    } catch (error) {
      console.error('Slack notification failed:', error);
    }
  }
}
