-- Create results table for task execution logging
CREATE TABLE public.results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task TEXT NOT NULL,
  params JSONB DEFAULT '{}'::jsonb,
  payload JSONB,
  logs TEXT[],
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- Create policies for results table
CREATE POLICY "Results are publicly readable" 
ON public.results 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create results" 
ON public.results 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update results" 
ON public.results 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_results_updated_at
BEFORE UPDATE ON public.results
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();