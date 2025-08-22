-- Create notes table for storing notes linked to leads
CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  lead_email TEXT,
  category TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Create policies for notes access (publicly readable for this use case)
CREATE POLICY "Notes are publicly readable" 
ON public.notes 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create notes" 
ON public.notes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update notes" 
ON public.notes 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_notes_updated_at
BEFORE UPDATE ON public.notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_notes_lead_email ON public.notes(lead_email);
CREATE INDEX idx_notes_category ON public.notes(category);
CREATE INDEX idx_notes_tags ON public.notes USING gin(tags);