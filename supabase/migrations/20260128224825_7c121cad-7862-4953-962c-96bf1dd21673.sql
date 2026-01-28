-- Função reutilizável para sanitizar telefones brasileiros
CREATE OR REPLACE FUNCTION sanitize_brazilian_phone(
  raw_phone TEXT,
  p_unit_id UUID DEFAULT NULL
) RETURNS TEXT AS $$
DECLARE
  digits TEXT;
  unit_phone TEXT;
  unit_ddd TEXT;
BEGIN
  -- 1. Remover tudo que não for número
  digits := regexp_replace(raw_phone, '\D', '', 'g');
  
  -- Se vazio, retorna NULL
  IF digits IS NULL OR digits = '' THEN
    RETURN NULL;
  END IF;
  
  -- 2. Verificar comprimento e completar
  
  -- Caso completo (12+ dígitos): já tem código de país
  IF length(digits) >= 12 THEN
    IF left(digits, 2) = '55' THEN
      RETURN digits;
    ELSE
      RETURN '55' || digits;
    END IF;
  END IF;
  
  -- Caso com DDD (10-11 dígitos): adiciona apenas 55
  IF length(digits) >= 10 AND length(digits) <= 11 THEN
    RETURN '55' || digits;
  END IF;
  
  -- Caso local (8-9 dígitos): precisa buscar DDD da unidade
  IF length(digits) >= 8 AND length(digits) <= 9 THEN
    IF p_unit_id IS NOT NULL THEN
      SELECT phone INTO unit_phone FROM units WHERE id = p_unit_id;
      
      IF unit_phone IS NOT NULL THEN
        unit_phone := regexp_replace(unit_phone, '\D', '', 'g');
        
        IF left(unit_phone, 2) = '55' AND length(unit_phone) >= 4 THEN
          unit_ddd := substr(unit_phone, 3, 2);
        ELSIF length(unit_phone) >= 2 THEN
          unit_ddd := left(unit_phone, 2);
        END IF;
        
        IF unit_ddd IS NOT NULL AND length(unit_ddd) = 2 THEN
          RETURN '55' || unit_ddd || digits;
        END IF;
      END IF;
    END IF;
    
    RETURN digits;
  END IF;
  
  RETURN digits;
END;
$$ LANGUAGE plpgsql STABLE;

-- Trigger para tabela clients
CREATE OR REPLACE FUNCTION sanitize_client_phone_trigger()
RETURNS TRIGGER AS $$
BEGIN
  NEW.phone := sanitize_brazilian_phone(NEW.phone, NEW.unit_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sanitize_client_phone ON clients;
CREATE TRIGGER trigger_sanitize_client_phone
  BEFORE INSERT OR UPDATE OF phone ON clients
  FOR EACH ROW
  EXECUTE FUNCTION sanitize_client_phone_trigger();

-- Trigger para tabela appointments
CREATE OR REPLACE FUNCTION sanitize_appointment_phone_trigger()
RETURNS TRIGGER AS $$
BEGIN
  NEW.client_phone := sanitize_brazilian_phone(NEW.client_phone, NEW.unit_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sanitize_appointment_phone ON appointments;
CREATE TRIGGER trigger_sanitize_appointment_phone
  BEFORE INSERT OR UPDATE OF client_phone ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION sanitize_appointment_phone_trigger();