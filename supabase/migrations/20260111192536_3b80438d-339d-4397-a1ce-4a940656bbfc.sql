-- Enable pgcrypto extension for secure random bytes generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add per-unit API key column to units table for secure agenda API access
ALTER TABLE public.units ADD COLUMN IF NOT EXISTS agenda_api_key TEXT UNIQUE;

-- Create function to generate a secure random API key
CREATE OR REPLACE FUNCTION public.generate_agenda_api_key()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  key TEXT;
BEGIN
  -- Generate a secure random key: prefix + 32 random hex characters
  key := 'agk_' || encode(extensions.gen_random_bytes(16), 'hex');
  RETURN key;
END;
$$;

-- Create trigger function to auto-generate API key on unit creation
CREATE OR REPLACE FUNCTION public.set_unit_agenda_api_key()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only generate if not already set
  IF NEW.agenda_api_key IS NULL THEN
    NEW.agenda_api_key := public.generate_agenda_api_key();
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger to auto-generate API key for new units
DROP TRIGGER IF EXISTS trigger_set_unit_agenda_api_key ON public.units;
CREATE TRIGGER trigger_set_unit_agenda_api_key
  BEFORE INSERT ON public.units
  FOR EACH ROW
  EXECUTE FUNCTION public.set_unit_agenda_api_key();

-- Generate API keys for existing units that don't have one
UPDATE public.units
SET agenda_api_key = public.generate_agenda_api_key()
WHERE agenda_api_key IS NULL;

-- Add index for faster API key lookups
CREATE INDEX IF NOT EXISTS idx_units_agenda_api_key ON public.units(agenda_api_key);