INSERT INTO public.appointment_services (name, duration_minutes, active)
VALUES
  ('15-min Quick Call', 15, true),
  ('30-min Consultation', 30, true),
  ('60-min Strategy Session', 60, true)
ON CONFLICT DO NOTHING;