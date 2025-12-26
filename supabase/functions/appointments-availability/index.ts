import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Business hours config (9am-5pm)
const BUSINESS_START_HOUR = 9;
const BUSINESS_END_HOUR = 17;
const SLOT_INTERVAL_MINUTES = 15;

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const serviceId = url.searchParams.get('serviceId');
    const dateStr = url.searchParams.get('date'); // YYYY-MM-DD

    if (!serviceId || !dateStr) {
      return new Response(
        JSON.stringify({ error: 'Missing serviceId or date parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) {
      return new Response(
        JSON.stringify({ error: 'Invalid date format. Use YYYY-MM-DD' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!
    );

    // Get service duration
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

    // Get existing appointments for the day
    const dayStart = `${dateStr}T00:00:00Z`;
    const dayEnd = `${dateStr}T23:59:59Z`;

    const { data: appointments, error: apptError } = await supabase
      .from('appointments')
      .select('start_time, end_time')
      .gte('start_time', dayStart)
      .lte('start_time', dayEnd)
      .in('status', ['booked', 'rescheduled']);

    if (apptError) {
      console.error('Error fetching appointments:', apptError);
      return new Response(
        JSON.stringify({ error: 'Error fetching appointments' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate available slots
    const slots: { time: string; available: boolean }[] = [];
    const serviceDuration = service.duration_minutes;
    const now = new Date();

    // Create slots from business start to end
    for (let hour = BUSINESS_START_HOUR; hour < BUSINESS_END_HOUR; hour++) {
      for (let minute = 0; minute < 60; minute += SLOT_INTERVAL_MINUTES) {
        const slotStart = new Date(`${dateStr}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00Z`);
        const slotEnd = new Date(slotStart.getTime() + serviceDuration * 60 * 1000);

        // Check if slot end goes past business hours
        const businessEnd = new Date(`${dateStr}T${BUSINESS_END_HOUR.toString().padStart(2, '0')}:00:00Z`);
        if (slotEnd > businessEnd) continue;

        // Check if slot is in the past
        if (slotStart < now) {
          slots.push({ time: slotStart.toISOString(), available: false });
          continue;
        }

        // Check for conflicts with existing appointments
        const hasConflict = appointments?.some(appt => {
          const apptStart = new Date(appt.start_time);
          const apptEnd = new Date(appt.end_time);
          // Overlap check: slot overlaps if it starts before appt ends AND ends after appt starts
          return slotStart < apptEnd && slotEnd > apptStart;
        });

        slots.push({ time: slotStart.toISOString(), available: !hasConflict });
      }
    }

    console.log(`Availability for ${dateStr}, service ${service.name}: ${slots.filter(s => s.available).length} available slots`);

    return new Response(
      JSON.stringify({
        service,
        date: dateStr,
        slots,
        availableCount: slots.filter(s => s.available).length
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Availability error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
