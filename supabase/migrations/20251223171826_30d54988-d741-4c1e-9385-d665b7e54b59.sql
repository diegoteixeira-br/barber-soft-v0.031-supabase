-- ===========================================
-- CRM MODULE: clients table + sync trigger
-- ===========================================

-- 1. Create clients table
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  birth_date DATE,
  last_visit_at TIMESTAMPTZ,
  total_visits INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT unique_phone_per_unit UNIQUE (unit_id, phone)
);

-- 2. Enable RLS on clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies for clients (using existing user_owns_unit function)
CREATE POLICY "Users can view clients from their units" 
ON public.clients FOR SELECT 
USING (user_owns_unit(unit_id));

CREATE POLICY "Users can create clients in their units" 
ON public.clients FOR INSERT 
WITH CHECK (user_owns_unit(unit_id));

CREATE POLICY "Users can update clients in their units" 
ON public.clients FOR UPDATE 
USING (user_owns_unit(unit_id));

CREATE POLICY "Users can delete clients from their units" 
ON public.clients FOR DELETE 
USING (user_owns_unit(unit_id));

-- 4. Add client_birth_date column to appointments
ALTER TABLE public.appointments ADD COLUMN client_birth_date DATE;

-- 5. Create trigger function for automatic client sync
CREATE OR REPLACE FUNCTION public.sync_client_on_appointment_complete()
RETURNS TRIGGER AS $$
BEGIN
  -- Only execute when status changes TO 'completed'
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    
    -- Only sync if phone is provided
    IF NEW.client_phone IS NOT NULL AND NEW.client_phone != '' THEN
      -- Upsert client
      INSERT INTO public.clients (company_id, unit_id, name, phone, birth_date, last_visit_at, total_visits)
      VALUES (
        NEW.company_id,
        NEW.unit_id,
        NEW.client_name,
        NEW.client_phone,
        NEW.client_birth_date,
        NOW(),
        1
      )
      ON CONFLICT (unit_id, phone) DO UPDATE SET
        name = EXCLUDED.name,
        birth_date = COALESCE(EXCLUDED.birth_date, clients.birth_date),
        last_visit_at = NOW(),
        total_visits = clients.total_visits + 1,
        updated_at = NOW();
    END IF;
      
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 6. Create trigger on appointments table
CREATE TRIGGER trigger_sync_client_on_complete
AFTER UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.sync_client_on_appointment_complete();

-- 7. Create index for performance
CREATE INDEX idx_clients_unit_phone ON public.clients(unit_id, phone);
CREATE INDEX idx_clients_last_visit ON public.clients(unit_id, last_visit_at);