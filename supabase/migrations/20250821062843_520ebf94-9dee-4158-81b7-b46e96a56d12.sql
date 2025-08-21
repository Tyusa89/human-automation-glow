-- Enable real-time for results table
ALTER TABLE public.results REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.results;