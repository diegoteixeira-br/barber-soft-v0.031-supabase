
-- Create trigger to execute the loyalty sync function on appointment completion
CREATE TRIGGER trigger_sync_client_on_appointment_complete
  AFTER INSERT OR UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_client_on_appointment_complete();
