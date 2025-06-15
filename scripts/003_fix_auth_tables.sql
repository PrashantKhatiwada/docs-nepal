-- This script fixes potential issues with auth tables and RLS policies

-- Make sure the auth schema exists
CREATE SCHEMA IF NOT EXISTS auth;

-- Ensure the auth.users table exists (if not already created by Supabase)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'auth' AND tablename = 'users'
    ) THEN
        CREATE TABLE auth.users (
            id UUID PRIMARY KEY,
            email TEXT UNIQUE,
            encrypted_password TEXT,
            confirmed_at TIMESTAMP WITH TIME ZONE,
            confirmation_token TEXT,
            confirmation_sent_at TIMESTAMP WITH TIME ZONE,
            recovery_token TEXT,
            recovery_sent_at TIMESTAMP WITH TIME ZONE,
            email_change_token TEXT,
            email_change TEXT,
            email_change_sent_at TIMESTAMP WITH TIME ZONE,
            last_sign_in_at TIMESTAMP WITH TIME ZONE,
            raw_app_meta_data JSONB,
            raw_user_meta_data JSONB,
            created_at TIMESTAMP WITH TIME ZONE,
            updated_at TIMESTAMP WITH TIME ZONE,
            phone TEXT,
            phone_confirmed_at TIMESTAMP WITH TIME ZONE,
            phone_change TEXT,
            phone_change_token TEXT,
            phone_change_sent_at TIMESTAMP WITH TIME ZONE,
            email_change_confirm_status SMALLINT,
            banned_until TIMESTAMP WITH TIME ZONE,
            reauthentication_token TEXT,
            reauthentication_sent_at TIMESTAMP WITH TIME ZONE
        );
    END IF;
END
$$;

-- Fix RLS policies for public.users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- Create new policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Fix RLS policies for documents table
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can insert own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can update own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can delete own documents" ON public.documents;

-- Create new policies
CREATE POLICY "Users can view own documents" ON public.documents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents" ON public.documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents" ON public.documents
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents" ON public.documents
    FOR DELETE USING (auth.uid() = user_id);

-- Fix RLS policies for template_usage table
ALTER TABLE public.template_usage ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own template usage" ON public.template_usage;
DROP POLICY IF EXISTS "Users can insert own template usage" ON public.template_usage;

-- Create new policies
CREATE POLICY "Users can view own template usage" ON public.template_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own template usage" ON public.template_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for anonymous users to view template usage stats
CREATE POLICY "Anyone can view template usage stats" ON public.template_usage
    FOR SELECT USING (true);
