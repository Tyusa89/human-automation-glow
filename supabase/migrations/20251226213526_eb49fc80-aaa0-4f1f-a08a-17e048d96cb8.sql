-- Create appointment_services table
CREATE TABLE IF NOT EXISTS public.appointment_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  duration_minutes int NOT NULL CHECK (duration_minutes > 0),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES public.appointment_services(id) ON DELETE RESTRICT,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_phone text NULL,
  notes text NULL,
  status text NOT NULL DEFAULT 'booked' CHECK (status IN ('booked','rescheduled','canceled')),
  cancel_token text NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  reschedule_token text NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Prevent double booking (unique start time for active bookings)
CREATE UNIQUE INDEX IF NOT EXISTS appointments_unique_start_active
ON public.appointments (start_time)
WHERE status IN ('booked','rescheduled');

-- Enable RLS
ALTER TABLE public.appointment_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- RLS for appointment_services: Anyone can view active services
CREATE POLICY "Services are publicly viewable"
ON public.appointment_services FOR SELECT
USING (active = true);

-- RLS for appointments: Public can book (insert)
CREATE POLICY "Public can book appointments"
ON public.appointments FOR INSERT
WITH CHECK (true);

-- RLS for appointments: Only authenticated users can read
CREATE POLICY "Authenticated can read appointments"
ON public.appointments FOR SELECT
TO authenticated
USING (true);

-- RLS for appointments: Only admin/owner can update
CREATE POLICY "Admin can update appointments"
ON public.appointments FOR UPDATE
USING (is_admin_or_owner());

-- RLS for appointments: Only admin/owner can delete
CREATE POLICY "Admin can delete appointments"
ON public.appointments FOR DELETE
USING (is_admin_or_owner());

-- Insert default services
INSERT INTO public.appointment_services (name, duration_minutes)
VALUES
  ('15-min Quick Call', 15),
  ('30-min Consultation', 30),
  ('60-min Strategy Session', 60)
ON CONFLICT DO NOTHING;