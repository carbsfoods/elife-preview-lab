-- Create panchayaths table
CREATE TABLE public.panchayaths (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    district TEXT NOT NULL,
    number_of_wards INTEGER NOT NULL,
    hierarchy_file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create agents table
CREATE TABLE public.agents (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    panchayath_id UUID NOT NULL REFERENCES public.panchayaths(id) ON DELETE CASCADE,
    role public.agent_role NOT NULL,
    superior_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
    phone_number TEXT NOT NULL,
    ward INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (for future authentication)
ALTER TABLE public.panchayaths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- Create policies (initially allow all operations for testing without auth)
CREATE POLICY "Allow all operations on panchayaths" 
ON public.panchayaths 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations on agents" 
ON public.agents 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_panchayaths_updated_at
    BEFORE UPDATE ON public.panchayaths
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agents_updated_at
    BEFORE UPDATE ON public.agents
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_agents_panchayath_id ON public.agents(panchayath_id);
CREATE INDEX idx_agents_superior_id ON public.agents(superior_id);
CREATE INDEX idx_agents_role ON public.agents(role);