-- Create knowledge base table for EcoNest AI
CREATE TABLE public.knowledge_base (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public read access for KB)
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to knowledge base
CREATE POLICY "Knowledge base is publicly readable" 
ON public.knowledge_base 
FOR SELECT 
USING (true);

-- Create policy for authenticated users to insert KB entries
CREATE POLICY "Authenticated users can create KB entries" 
ON public.knowledge_base 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Create policy for authenticated users to update KB entries
CREATE POLICY "Authenticated users can update KB entries" 
ON public.knowledge_base 
FOR UPDATE 
TO authenticated
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_knowledge_base_updated_at
BEFORE UPDATE ON public.knowledge_base
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample knowledge base entries for EcoNest AI
INSERT INTO public.knowledge_base (title, content, category, tags) VALUES
('Lead Qualification Process', 'EcoNest AI automatically qualifies leads based on company size, budget indicators, and sustainability goals. Key qualification criteria include: 1) Company has 50+ employees, 2) Mentions sustainability, automation, or AI in initial contact, 3) Budget authority identified.', 'Lead Management', ARRAY['leads', 'qualification', 'automation']),

('Custom AI Agent Development', 'EcoNest AI specializes in building custom AI agents for business automation. Our agents can handle customer service, lead scoring, data analysis, and workflow automation. Development typically takes 2-4 weeks depending on complexity.', 'Services', ARRAY['ai-agents', 'custom-development', 'automation']),

('Integration Capabilities', 'EcoNest AI integrates with major platforms including Salesforce, HubSpot, Slack, Microsoft Teams, Google Workspace, and Zapier. Custom integrations available via REST APIs and webhooks. Average integration setup time is 1-2 business days.', 'Integrations', ARRAY['integrations', 'apis', 'platforms']),

('Pricing Structure', 'EcoNest AI pricing starts at $2,500/month for basic automation package. Custom AI agent development ranges from $15,000-$50,000 depending on complexity. Enterprise packages available with volume discounts and dedicated support.', 'Pricing', ARRAY['pricing', 'packages', 'enterprise']),

('Support and Training', 'All EcoNest AI clients receive comprehensive onboarding, training sessions, and ongoing support. Support includes email, chat, and phone during business hours. Premium clients get dedicated account management and priority support.', 'Support', ARRAY['support', 'training', 'onboarding']);

-- Create search index for better performance
CREATE INDEX idx_knowledge_base_content_search ON public.knowledge_base USING gin(to_tsvector('english', title || ' ' || content));
CREATE INDEX idx_knowledge_base_category ON public.knowledge_base(category);
CREATE INDEX idx_knowledge_base_tags ON public.knowledge_base USING gin(tags);