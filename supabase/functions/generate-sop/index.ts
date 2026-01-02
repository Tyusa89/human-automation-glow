import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-auth',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { document, searchQuery } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch related policies from knowledge base
    let relatedPolicies = '';
    if (searchQuery) {
      const { data: kbData, error: kbError } = await supabase
        .from('knowledge_base')
        .select('title, content, category')
        .or(`content.ilike.%${searchQuery}%,title.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`)
        .limit(5);

      if (!kbError && kbData && kbData.length > 0) {
        relatedPolicies = kbData.map(item => 
          `**${item.title}** (${item.category})\n${item.content}`
        ).join('\n\n---\n\n');
      }
    }

    // Generate SOP using OpenAI
    const prompt = `
You are an expert business process analyst. Convert the following document into a comprehensive Standard Operating Procedure (SOP) with numbered steps and clear ownership assignments.

Document to convert:
${document}

${relatedPolicies ? `Related company policies to consider:
${relatedPolicies}` : ''}

Requirements:
1. Create 5-10 numbered steps that cover the complete process
2. Assign a specific owner/role for each step (e.g., "Sales Manager", "Customer Success", "Operations Team")
3. Include clear acceptance criteria for each step
4. Make steps actionable and measurable
5. Follow this format:

**Step X: [Step Title]**
- **Owner:** [Role/Department]
- **Action:** [Detailed description of what needs to be done]
- **Acceptance Criteria:** [How to know the step is complete]
- **Timeline:** [Expected duration or deadline]

Provide a clear, professional SOP that could be immediately implemented.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert business process analyst who creates clear, actionable Standard Operating Procedures. Always provide numbered steps with specific owners and measurable outcomes.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const sopContent = data.choices[0].message.content;

    // Extract the first step for task creation
    const firstStepMatch = sopContent.match(/\*\*Step 1:([^*]+)\*\*/);
    const firstStepTitle = firstStepMatch ? `Step 1:${firstStepMatch[1].trim()}` : 'Begin SOP Implementation';

    console.log('SOP generated successfully');
    console.log('Related policies found:', relatedPolicies ? 'Yes' : 'None');

    return new Response(JSON.stringify({ 
      sopContent,
      firstStepTitle,
      relatedPolicies: relatedPolicies || null,
      stepsCount: (sopContent.match(/\*\*Step \d+:/g) || []).length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-sop function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to generate SOP. Please check your OpenAI API key and try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});