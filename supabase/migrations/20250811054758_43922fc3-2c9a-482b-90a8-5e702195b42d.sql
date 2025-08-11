-- Create meetings table for storing scheduled meetings
CREATE TABLE public.meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_email TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  end_time TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
  meeting_link TEXT,
  title TEXT DEFAULT 'Meeting',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create function to calculate end time
CREATE OR REPLACE FUNCTION public.calculate_meeting_end_time()
RETURNS TRIGGER AS $$
BEGIN
  NEW.end_time = NEW.start_time + INTERVAL '1 minute' * NEW.duration_minutes;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to calculate end time
CREATE TRIGGER calculate_meeting_end_time_trigger
BEFORE INSERT OR UPDATE ON public.meetings
FOR EACH ROW
EXECUTE FUNCTION public.calculate_meeting_end_time();

-- Enable Row Level Security
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- Create policies for meeting access (publicly readable for this use case)
CREATE POLICY "Meetings are publicly readable" 
ON public.meetings 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create meetings" 
ON public.meetings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update meetings" 
ON public.meetings 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_meetings_updated_at
BEFORE UPDATE ON public.meetings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_meetings_lead_email ON public.meetings(lead_email);
CREATE INDEX idx_meetings_start_time ON public.meetings(start_time);
CREATE INDEX idx_meetings_status ON public.meetings(status);