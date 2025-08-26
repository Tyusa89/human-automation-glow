import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are EcoNest AI's customer service agent. You are helpful, professional, and knowledgeable about EcoNest's AI automation services.

About EcoNest AI:
- We provide AI automation solutions that feel human
- We help businesses automate workflows, analyze data, and improve efficiency
- Our services include: workflow automation, data analysis, customer support automation, inventory management, and intelligent insights
- We integrate with existing tools and systems
- We offer demos and consultations

Your capabilities:
- Answer questions about EcoNest's services and pricing
- Help troubleshoot basic issues
- Schedule demos and consultations
- Provide technical guidance
- Escalate complex issues to human support when needed

Guidelines:
- Be warm, professional, and helpful
- Ask clarifying questions when needed
- Provide specific, actionable advice
- If you don't know something, say so and offer to connect them with a specialist
- Always aim to solve the customer's problem or guide them to the right solution
- Keep responses concise but thorough
- Use a conversational, friendly tone`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();
    console.log('Received customer service request:', { message, historyLength: conversationHistory.length });

    if (!message) {
      throw new Error('Message is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    console.log('Checking for OpenAI API key:', openAIApiKey ? 'Found' : 'Not found');
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
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    console.log('OpenAI response received successfully');

    const aiResponse = data.choices[0].message.content;

    // Log the interaction for analytics
    console.log('Customer service interaction:', {
      userMessage: message,
      aiResponse: aiResponse.substring(0, 100) + '...',
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
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});