-- Beveiliging: Schakel Row Level Security (RLS) in voor publieke tafels
ALTER TABLE IF EXISTS public.hermes_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.hermes_memory ENABLE ROW LEVEL SECURITY;
