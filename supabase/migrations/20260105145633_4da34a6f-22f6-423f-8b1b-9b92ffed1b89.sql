-- Enable realtime for marketing_campaigns table
ALTER TABLE public.marketing_campaigns REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.marketing_campaigns;

-- Enable realtime for campaign_message_logs table
ALTER TABLE public.campaign_message_logs REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.campaign_message_logs;