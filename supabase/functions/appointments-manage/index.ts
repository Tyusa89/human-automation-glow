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
    const { token, action, newStartTime } = body;

    if (!token || !action) {
      return new Response(
        JSON.stringify({ error: 'Missing token or action' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!['cancel', 'reschedule'].includes(action)) {
      return new Response(
        JSON.stringify({ error: 'Invalid action. Must be "cancel" or "reschedule"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Find appointment by token
    const tokenColumn = action === 'cancel' ? 'cancel_token' : 'reschedule_token';
    const { data: appointment, error: findError } = await supabase
      .from('appointments')
      .select('id, service_id, start_time, end_time, status, client_email')
      .eq(tokenColumn, token)
      .single();

    if (findError || !appointment) {
      console.error('Appointment not found:', findError);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if already canceled
    if (appointment.status === 'canceled') {
      return new Response(
        JSON.stringify({ error: 'This appointment has already been canceled' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'cancel') {
      // Cancel the appointment
      const { error: updateError } = await supabase
        .from('appointments')
        .update({ status: 'canceled' })
        .eq('id', appointment.id);

      if (updateError) {
        console.error('Error canceling appointment:', updateError);
        return new Response(
          JSON.stringify({ error: 'Error canceling appointment' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Appointment ${appointment.id} canceled`);

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Appointment canceled successfully',
          appointmentId: appointment.id
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'reschedule') {
      if (!newStartTime) {
        return new Response(
          JSON.stringify({ error: 'Missing newStartTime for reschedule' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get service duration
      const { data: service, error: serviceError } = await supabase
        .from('appointment_services')
        .select('duration_minutes')
        .eq('id', appointment.service_id)
        .single();

      if (serviceError || !service) {
        return new Response(
          JSON.stringify({ error: 'Service not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Calculate new end time
      const newStart = new Date(newStartTime);
      const newEnd = new Date(newStart.getTime() + service.duration_minutes * 60 * 1000);

      // Check if new slot is available
      const { data: conflicting, error: conflictError } = await supabase
        .from('appointments')
        .select('id')
        .eq('start_time', newStartTime)
        .in('status', ['booked', 'rescheduled'])
        .neq('id', appointment.id)
        .maybeSingle();

      if (conflictError) {
        console.error('Error checking conflicts:', conflictError);
        return new Response(
          JSON.stringify({ error: 'Error checking availability' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (conflicting) {
        return new Response(
          JSON.stringify({ error: 'The new time slot is not available' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update appointment
      const { error: updateError } = await supabase
        .from('appointments')
        .update({
          start_time: newStartTime,
          end_time: newEnd.toISOString(),
          status: 'rescheduled'
        })
        .eq('id', appointment.id);

      if (updateError) {
        console.error('Error rescheduling:', updateError);
        return new Response(
          JSON.stringify({ error: 'Error rescheduling appointment' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Appointment ${appointment.id} rescheduled to ${newStartTime}`);

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Appointment rescheduled successfully',
          appointmentId: appointment.id,
          newStartTime,
          newEndTime: newEnd.toISOString()
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Manage error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
