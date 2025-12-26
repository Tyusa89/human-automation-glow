import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await req.json();
    const { serviceId, startTime, clientName, clientEmail, clientPhone, notes } = body;

    // Validate required fields
    if (!serviceId || !startTime || !clientName || !clientEmail) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: serviceId, startTime, clientName, clientEmail' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // Use service role for insert
    );

    // Get service to calculate end time
    const { data: service, error: serviceError } = await supabase
      .from('appointment_services')
      .select('id, name, duration_minutes')
      .eq('id', serviceId)
      .eq('active', true)
      .single();

    if (serviceError || !service) {
      console.error('Service not found:', serviceError);
      return new Response(
        JSON.stringify({ error: 'Service not found or inactive' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate end time
    const startDate = new Date(startTime);
    const endDate = new Date(startDate.getTime() + service.duration_minutes * 60 * 1000);

    // Check if slot is still available (double-booking prevention)
    const { data: existing, error: existingError } = await supabase
      .from('appointments')
      .select('id')
      .eq('start_time', startTime)
      .in('status', ['booked', 'rescheduled'])
      .maybeSingle();

    if (existingError) {
      console.error('Error checking existing appointments:', existingError);
      return new Response(
        JSON.stringify({ error: 'Error checking availability' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (existing) {
      return new Response(
        JSON.stringify({ error: 'This time slot is no longer available. Please select another time.' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert appointment
    const { data: appointment, error: insertError } = await supabase
      .from('appointments')
      .insert({
        service_id: serviceId,
        start_time: startTime,
        end_time: endDate.toISOString(),
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone || null,
        notes: notes || null,
        status: 'booked'
      })
      .select('id, cancel_token, reschedule_token, start_time, end_time')
      .single();

    if (insertError) {
      console.error('Error inserting appointment:', insertError);
      // Handle unique constraint violation (double booking)
      if (insertError.code === '23505') {
        return new Response(
          JSON.stringify({ error: 'This time slot is no longer available. Please select another time.' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({ error: 'Error booking appointment' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Appointment booked: ${appointment.id} for ${clientEmail} at ${startTime}`);

    // TODO: Send confirmation email (phase 2)

    return new Response(
      JSON.stringify({
        success: true,
        appointment: {
          id: appointment.id,
          service: service.name,
          startTime: appointment.start_time,
          endTime: appointment.end_time,
          cancelUrl: `/book/manage?token=${appointment.cancel_token}&action=cancel`,
          rescheduleUrl: `/book/manage?token=${appointment.reschedule_token}&action=reschedule`
        }
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Booking error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
