import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MINUTES = 1; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute

const SYSTEM_PROMPT = `You are EcoNest AI's expert customer service agent. You're knowledgeable, helpful, and can assist with all aspects of EcoNest's AI automation platform.

## ABOUT ECONEST AI
EcoNest AI provides cutting-edge AI automation solutions that feel human and integrate seamlessly with existing business operations.

## SERVICES & PRODUCTS
**Core Services:**
- AI-powered workflow automation
- Intelligent data analysis and insights
- Customer support automation
- Inventory and supply chain management
- Document processing and analysis
- Predictive analytics and forecasting

**Templates Available:**
- Appointment Booker - Automated scheduling with calendar integration
- Customer Support Widget - AI chat support for websites
- Inventory Manager - Smart inventory tracking and reordering
- Lead Qualifier - Automated lead scoring and routing
- Document Processor - Extract and analyze document data
- Email Responder - Intelligent email automation
- Data Analyzer - Advanced analytics and reporting
- Meeting Scheduler - Smart meeting coordination
- Task Automator - Workflow automation tools
- Content Generator - AI content creation tools

## PRICING PLANS

**Free Tier:** $0/mo
- Up to 1 template
- 100 monthly automations
- Basic support
- Community access

**Growth:** $29/mo ($290/year)
- Up to 3 templates
- 1,000 monthly automations
- Email support
- Basic integrations
- Template customization

**Business:** $79/mo ($790/year) - MOST POPULAR
- Unlimited templates
- 10,000 monthly automations
- Priority support
- Advanced integrations
- Custom workflows
- Team collaboration
- Analytics dashboard

**Pro:** $199/mo ($1,990/year)
- Unlimited templates
- 100,000 monthly automations
- Dedicated support
- Enterprise integrations
- White-label solutions
- API access
- Custom development

**Add-ons Available:**
- Extra automations: $10/1,000 additional
- Premium integrations: $25/mo
- White-label branding: $50/mo
- Dedicated support: $100/mo
- Custom development: $500/project

## INTEGRATIONS
EcoNest connects with 100+ popular tools including:
- CRM: Salesforce, HubSpot, Pipedrive
- Communication: Slack, Microsoft Teams, Discord
- Email: Gmail, Outlook, Mailchimp
- Productivity: Asana, Trello, Monday.com
- E-commerce: Shopify, WooCommerce, Magento
- Analytics: Google Analytics, Mixpanel
- Cloud Storage: Google Drive, Dropbox, OneDrive

## YOUR CAPABILITIES
You can help customers with:

**Plan Selection & Management:**
- Compare pricing tiers and recommend best fit
- Explain add-ons and their benefits
- Help upgrade/downgrade plans
- Calculate cost savings and ROI

**Template Guidance:**
- Explain how each template works
- Help choose the right templates for their needs
- Guide through template setup and customization
- Troubleshoot template issues

**Technical Support:**
- Integration setup and configuration
- API documentation and usage
- Troubleshooting connection issues
- Performance optimization tips

**Account Management:**
- Profile setup and configuration
- Team member management
- Billing and subscription changes
- Usage monitoring and limits

**Appointment Scheduling:**
- Schedule demos and consultations
- Book technical support calls
- Arrange callback requests
- Coordinate with sales team

**FAQ & General Support:**
- Answer product questions
- Explain features and capabilities
- Provide best practices
- Share case studies and examples

## GUIDELINES
- Always be warm, professional, and solution-focused
- Ask clarifying questions to understand their specific needs
- Provide concrete examples and use cases
- If you need to schedule something, ask for their preferred time and contact info
- For complex technical issues, offer to connect them with a specialist
- Always try to demonstrate value and ROI
- Keep responses helpful but concise
- Use a conversational, friendly tone

## ESCALATION
For issues you cannot resolve:
- Complex custom development requests → Connect with Solutions Architect
- Enterprise sales inquiries → Transfer to Sales team
- Technical bugs or system issues → Create support ticket
- Billing disputes → Connect with Billing department

Remember: Your goal is to help customers succeed with EcoNest AI and ensure they get maximum value from our platform.`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role for rate limiting
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract and verify authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(JSON.stringify({ 
        error: 'Authentication required. Please log in to use this service.' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify user authentication
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Authentication failed:', authError?.message);
      return new Response(JSON.stringify({ 
        error: 'Invalid or expired authentication token. Please log in again.' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Authenticated user:', user.id);

    // Check rate limiting
    const now = new Date();
    const windowStart = new Date(now.getTime() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000);
    
    // Check current request count in the window
    const { data: rateLimitData, error: rateLimitError } = await supabase
      .from('api_rate_limits')
      .select('request_count, window_start')
      .eq('user_id', user.id)
      .eq('endpoint', 'customer-service-ai')
      .gte('window_start', windowStart.toISOString())
      .maybeSingle();

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
    }

    if (rateLimitData && rateLimitData.request_count >= MAX_REQUESTS_PER_WINDOW) {
      const resetTime = new Date(new Date(rateLimitData.window_start).getTime() + RATE_LIMIT_WINDOW_MINUTES * 60 * 1000);
      const secondsUntilReset = Math.ceil((resetTime.getTime() - now.getTime()) / 1000);
      
      console.log('Rate limit exceeded for user:', user.id);
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded. Please try again in a moment.',
        retryAfter: secondsUntilReset,
        limit: MAX_REQUESTS_PER_WINDOW,
        window: `${RATE_LIMIT_WINDOW_MINUTES} minute(s)`
      }), {
        status: 429,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Retry-After': String(secondsUntilReset)
        },
      });
    }

    // Update rate limit counter
    if (rateLimitData) {
      await supabase
        .from('api_rate_limits')
        .update({ 
          request_count: rateLimitData.request_count + 1,
          updated_at: now.toISOString()
        })
        .eq('user_id', user.id)
        .eq('endpoint', 'customer-service-ai')
        .gte('window_start', windowStart.toISOString());
    } else {
      await supabase
        .from('api_rate_limits')
        .insert({ 
          user_id: user.id,
          endpoint: 'customer-service-ai',
          request_count: 1,
          window_start: now.toISOString()
        });
    }

    const { message, conversationHistory = [] } = await req.json();
    console.log('Received customer service request:', { 
      userId: user.id, 
      messageLength: message?.length || 0, 
      historyLength: conversationHistory.length 
    });

    if (!message) {
      throw new Error('Message is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not found in environment variables');
      throw new Error('OpenAI API key not configured');
    }

    // Build conversation with system prompt and history
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    console.log('Sending request to OpenAI...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: messages,
        max_completion_tokens: 1000,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received successfully');

    const aiResponse = data.choices[0].message.content;

    // Log the interaction for analytics (sanitized - no PII)
    console.log('Customer service interaction:', {
      userId: user.id,
      messageLength: message.length,
      responseLength: aiResponse.length,
      timestamp: new Date().toISOString()
    });

    return new Response(JSON.stringify({ 
      response: aiResponse,
      conversationId: crypto.randomUUID()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in customer service AI function:', error);
    return new Response(JSON.stringify({ 
      error: 'Unable to process your request at the moment. Please try again or contact our support team.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});