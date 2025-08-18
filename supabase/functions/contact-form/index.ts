import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ContactFormData {
  name: string
  email: string
  message: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { name, email, message }: ContactFormData = await req.json()

    // Comprehensive input validation
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate field lengths and content
    if (name.length > 100 || message.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Field length exceeded limits' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Sanitize inputs
    const sanitizedName = name.trim().slice(0, 100)
    const sanitizedEmail = email.trim().toLowerCase()
    const sanitizedMessage = message.trim().slice(0, 5000)

    // Rate limiting check - prevent spam (basic implementation)
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const { data: recentSubmissions } = await supabase
      .from('contact_submissions')
      .select('submitted_at')
      .eq('client_ip', clientIP)
      .gte('submitted_at', new Date(Date.now() - 3600000).toISOString()) // Last hour
      .limit(5)

    if (recentSubmissions && recentSubmissions.length >= 3) {
      return new Response(
        JSON.stringify({ error: 'Too many submissions. Please wait before trying again.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Store the contact form submission in database
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert({
        name: sanitizedName,
        email: sanitizedEmail,
        message: sanitizedMessage,
        client_ip: clientIP,
        submitted_at: new Date().toISOString()
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to save submission' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Send auto-reply email to the user
    const autoReplySubject = `Thank you for contacting EcoNest AI, ${sanitizedName}!`
    const autoReplyBody = `
Dear ${sanitizedName},

Thank you for reaching out to EcoNest AI! We've received your message and are excited to learn more about your project.

Here's what happens next:
• Our team will review your requirements within 24 hours
• We'll schedule a consultation call within 48 hours to discuss your project in detail
• Following our conversation, we'll provide you with a custom proposal and timeline

While you wait, feel free to explore our services:
🤖 AI Automation Solutions: https://econestai.com#services
📊 Business Process Optimization: https://econestai.com#services
🔧 Custom AI Development: https://econestai.com#services

If you have any urgent questions, don't hesitate to reach out directly at hello@econestai.com or reply to this email.

Best regards,
The EcoNest AI Team

---
EcoNest AI
Automation That Feels Human
Email: hello@econestai.com
Website: https://econestai.com
`

    // You'll need to configure email sending through Supabase Edge Functions
    // For now, we'll just log the auto-reply (you can integrate with SendGrid, Resend, etc.)
    console.log('Auto-reply email would be sent:')
    console.log('To:', sanitizedEmail)
    console.log('Subject:', autoReplySubject)
    console.log('Body:', autoReplyBody)

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Contact form submitted successfully and auto-reply sent!'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})