-- Create traces table for storing evaluation traces
CREATE TABLE public.traces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  intent TEXT NOT NULL,
  plan TEXT,
  tools_used TEXT,
  confidence NUMERIC NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  solved BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.traces ENABLE ROW LEVEL SECURITY;

-- Create policies for traces access (publicly readable for this use case)
CREATE POLICY "Traces are publicly readable" 
ON public.traces 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create traces" 
ON public.traces 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update traces" 
ON public.traces 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_traces_updated_at
BEFORE UPDATE ON public.traces
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_traces_intent ON public.traces(intent);
CREATE INDEX idx_traces_solved ON public.traces(solved);
CREATE INDEX idx_traces_confidence ON public.traces(confidence);
CREATE INDEX idx_traces_created_at ON public.traces(created_at);