
-- Enable UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: decisions
CREATE TABLE IF NOT EXISTS public.decisions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    decision_type text NOT NULL,
    comments text
);
ALTER TABLE public.decisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable insert for anonymous and authenticated users" ON public.decisions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Enable select for service_role only" ON public.decisions FOR SELECT USING (auth.role() = 'service_role');


-- Table: lead_magnet_signups
CREATE TABLE IF NOT EXISTS public.lead_magnet_signups (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now() NOT NULL,
    email text NOT NULL
);
ALTER TABLE public.lead_magnet_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable insert for anonymous and authenticated users" ON public.lead_magnet_signups FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Enable select for service_role only" ON public.lead_magnet_signups FOR SELECT USING (auth.role() = 'service_role');


-- Table: visit_requests
CREATE TABLE IF NOT EXISTS public.visit_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    message text
);
ALTER TABLE public.visit_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable insert for anonymous and authenticated users" ON public.visit_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Enable select for service_role only" ON public.visit_requests FOR SELECT USING (auth.role() = 'service_role');


-- Table: exit_intent_offers
CREATE TABLE IF NOT EXISTS public.exit_intent_offers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now() NOT NULL,
    email text NOT NULL
);
ALTER TABLE public.exit_intent_offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable insert for anonymous and authenticated users" ON public.exit_intent_offers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Enable select for service_role only" ON public.exit_intent_offers FOR SELECT USING (auth.role() = 'service_role');


-- Table: weekly_updates_signups
CREATE TABLE IF NOT EXISTS public.weekly_updates_signups (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now() NOT NULL,
    email text NOT NULL
);
ALTER TABLE public.weekly_updates_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable insert for anonymous and authenticated users" ON public.weekly_updates_signups FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Enable select for service_role only" ON public.weekly_updates_signups FOR SELECT USING (auth.role() = 'service_role');


-- Table: financial_partner_signups
CREATE TABLE IF NOT EXISTS public.financial_partner_signups (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now() NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    phone_number text,
    country text
);
ALTER TABLE public.financial_partner_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable insert for anonymous and authenticated users" ON public.financial_partner_signups FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Enable select for service_role only" ON public.financial_partner_signups FOR SELECT USING (auth.role() = 'service_role');


-- Table: prayer_partner_signups
CREATE TABLE IF NOT EXISTS public.prayer_partner_signups (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now() NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    committed_to_pray boolean DEFAULT false
);
ALTER TABLE public.prayer_partner_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable insert for anonymous and authenticated users" ON public.prayer_partner_signups FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Enable select for service_role only" ON public.prayer_partner_signups FOR SELECT USING (auth.role() = 'service_role');


-- Table: volunteer_partner_signups
CREATE TABLE IF NOT EXISTS public.volunteer_partner_signups (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now() NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    interests_skills text
);
ALTER TABLE public.volunteer_partner_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable insert for anonymous and authenticated users" ON public.volunteer_partner_signups FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Enable select for service_role only" ON public.volunteer_partner_signups FOR SELECT USING (auth.role() = 'service_role');


-- Table: UserCourseProgress (using quotes to match PascalCase in src/types/supabase.ts)
CREATE TABLE IF NOT EXISTS public."UserCourseProgress" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now() NOT NULL,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id text NOT NULL,
    completed_lessons integer[] DEFAULT ARRAY[]::integer[],
    last_accessed timestamptz DEFAULT now() NOT NULL,
    progress_percentage integer DEFAULT 0 NOT NULL CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    CONSTRAINT user_course_progress_user_id_course_id_key UNIQUE (user_id, course_id) -- Ensure a user has only one progress entry per course
);
ALTER TABLE public."UserCourseProgress" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable ALL for own data" ON public."UserCourseProgress"
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

