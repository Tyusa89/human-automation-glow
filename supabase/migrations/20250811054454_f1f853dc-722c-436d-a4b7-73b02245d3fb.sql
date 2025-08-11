-- Create tasks table for storing follow-up tasks
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  assignee TEXT,
  lead_email TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for task access (publicly readable for this use case)
CREATE POLICY "Tasks are publicly readable" 
ON public.tasks 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create tasks" 
ON public.tasks 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update tasks" 
ON public.tasks 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_tasks_lead_email ON public.tasks(lead_email);
CREATE INDEX idx_tasks_assignee ON public.tasks(assignee);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_priority ON public.tasks(priority);