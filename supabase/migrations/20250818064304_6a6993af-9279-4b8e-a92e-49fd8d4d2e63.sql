-- Create daily_notes table
CREATE TABLE public.daily_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  note_date DATE NOT NULL,
  description TEXT NOT NULL,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(agent_id, note_date)
);

-- Create points_system table
CREATE TABLE public.points_system (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role agent_role NOT NULL UNIQUE,
  daily_points INTEGER NOT NULL DEFAULT 0,
  bonus_points_allowed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.daily_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_system ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations on daily_notes" 
ON public.daily_notes 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on points_system" 
ON public.points_system 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_daily_notes_updated_at
BEFORE UPDATE ON public.daily_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_points_system_updated_at
BEFORE UPDATE ON public.points_system
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default points for each role
INSERT INTO public.points_system (role, daily_points, bonus_points_allowed) VALUES
('coordinator', 100, true),
('supervisor', 75, true),
('group_leader', 50, true),
('pro', 25, true);