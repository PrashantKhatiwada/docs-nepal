-- Insert sample template usage data for analytics
INSERT INTO public.template_usage (template_id, user_id) VALUES
('cv-resume', gen_random_uuid()),
('leave-application', gen_random_uuid()),
('marriage-affidavit', gen_random_uuid()),
('rent-agreement', gen_random_uuid()),
('cv-resume', gen_random_uuid()),
('leave-application', gen_random_uuid()),
('character-certificate', gen_random_uuid()),
('job-application', gen_random_uuid());

-- Note: In a real application, you would have actual user IDs here
-- This is just for demonstration purposes
