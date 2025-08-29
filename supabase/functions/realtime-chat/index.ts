import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Upgrade': 'websocket',
  'Connection': 'Upgrade',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Realtime chat WebSocket connection requested');
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      throw new Error('OpenAI API key not configured');
    }

    const { socket, response } = Deno.upgradeWebSocket(req);
    let openAIWebSocket: WebSocket | null = null;

    // System instructions for the customer service agent
    const SYSTEM_INSTRUCTIONS = `You are EcoNest AI's voice customer service agent. You are helpful, professional, and knowledgeable about EcoNest's AI automation services.

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
- Get weather information for customers
- Escalate complex issues to human support when needed

Guidelines:
- Be warm, professional, and helpful in your voice responses
- Speak naturally and conversationally
- Ask clarifying questions when needed
- Provide specific, actionable advice
- If you don't know something, say so and offer to connect them with a specialist
- Keep responses concise but thorough
- Use a friendly, conversational tone`;

    socket.onopen = async () => {
      console.log('Client WebSocket opened, connecting to OpenAI...');
      
      try {
        // Connect to OpenAI Realtime API
        openAIWebSocket = new WebSocket(
          'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01',
          {
            headers: {
              'Authorization': `Bearer ${openAIApiKey}`,
              'OpenAI-Beta': 'realtime=v1'
            }
          }
        );

        openAIWebSocket.onopen = () => {
          console.log('Connected to OpenAI Realtime API');
        };

        openAIWebSocket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log('OpenAI message type:', data.type);
          
          // Send session update after receiving session.created
          if (data.type === 'session.created') {
            console.log('Session created, sending session update...');
            const sessionUpdate = {
              type: 'session.update',
              session: {
                modalities: ['text', 'audio'],
                instructions: SYSTEM_INSTRUCTIONS,
                voice: 'alloy',
                input_audio_format: 'pcm16',
                output_audio_format: 'pcm16',
                input_audio_transcription: {
                  model: 'whisper-1'
                },
                turn_detection: {
                  type: 'server_vad',
                  threshold: 0.5,
                  prefix_padding_ms: 300,
                  silence_duration_ms: 1000
                },
                tools: [
                  {
                    type: 'function',
                    name: 'get_weather',
                    description: 'Get the current weather for a location, tell the user you are fetching the weather.',
                    parameters: {
                      type: 'object',
                      properties: {
                        location: { type: 'string' }
                      },
                      required: ['location']
                    }
                  },
                  {
                    type: 'function',
                    name: 'schedule_demo',
                    description: 'Schedule a demo for the customer with EcoNest AI team.',
                    parameters: {
                      type: 'object',
                      properties: {
                        email: { type: 'string' },
                        preferred_time: { type: 'string' },
                        company: { type: 'string' }
                      },
                      required: ['email']
                    }
                  }
                ],
                tool_choice: 'auto',
                temperature: 0.8,
                max_response_output_tokens: 'inf'
              }
            };
            openAIWebSocket!.send(JSON.stringify(sessionUpdate));
          }

          // Handle function calls
          if (data.type === 'response.function_call_arguments.done') {
            console.log('Function call completed:', data.call_id, data.arguments);
            
            let result = '';
            try {
              const args = JSON.parse(data.arguments);
              
              if (data.name === 'get_weather') {
                result = `The weather in ${args.location} is sunny and 72°F. Perfect day to optimize your business workflows with EcoNest AI!`;
              } else if (data.name === 'schedule_demo') {
                result = `I've noted your request to schedule a demo. Our team will reach out to ${args.email} within 24 hours to arrange a convenient time.`;
              }
            } catch (error) {
              console.error('Error parsing function arguments:', error);
              result = 'I encountered an error processing your request. Let me connect you with a human agent.';
            }

            // Send function result back to OpenAI
            const functionResult = {
              type: 'conversation.item.create',
              item: {
                type: 'function_call_output',
                call_id: data.call_id,
                output: result
              }
            };
            openAIWebSocket!.send(JSON.stringify(functionResult));
            openAIWebSocket!.send(JSON.stringify({ type: 'response.create' }));
          }

          // Forward all messages to client
          socket.send(JSON.stringify(data));
        };

        openAIWebSocket.onerror = (error) => {
          console.error('OpenAI WebSocket error:', error);
          socket.send(JSON.stringify({
            type: 'error',
            message: 'Connection to AI service failed'
          }));
        };

        openAIWebSocket.onclose = (event) => {
          console.log('OpenAI WebSocket closed:', event.code, event.reason);
          socket.close();
        };

      } catch (error) {
        console.error('Error connecting to OpenAI:', error);
        socket.send(JSON.stringify({
          type: 'error',
          message: 'Failed to initialize AI service'
        }));
      }
    };

    socket.onmessage = (event) => {
      // Forward client messages to OpenAI
      if (openAIWebSocket && openAIWebSocket.readyState === WebSocket.OPEN) {
        console.log('Forwarding message to OpenAI:', event.data);
        openAIWebSocket.send(event.data);
      } else {
        console.warn('OpenAI WebSocket not ready, message dropped');
      }
    };

    socket.onclose = () => {
      console.log('Client WebSocket closed');
      if (openAIWebSocket) {
        openAIWebSocket.close();
      }
    };

    socket.onerror = (error) => {
      console.error('Client WebSocket error:', error);
      if (openAIWebSocket) {
        openAIWebSocket.close();
      }
    };

    return response;

  } catch (error) {
    console.error('Error in realtime chat function:', error);
    return new Response(JSON.stringify({ 
      error: 'Unable to establish WebSocket connection',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});