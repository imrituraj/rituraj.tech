-- ==============================================================================
-- SUPABASE DATABASE SCHEMA FOR RITURAJ.TECH (IIT PATNA STUDY SUITE)
-- ==============================================================================
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- It will automatically create all tables, indexes, and Row Level Security (RLS) policies.

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. STUDY NOTES TABLE
CREATE TABLE IF NOT EXISTS public.study_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'GENERAL',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. STUDY TODOS TABLE
CREATE TABLE IF NOT EXISTS public.study_todos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    due_date TEXT DEFAULT '',
    course TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. STUDY REMINDERS TABLE
CREATE TABLE IF NOT EXISTS public.study_reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    date_time TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'deadline' CHECK (type IN ('exam', 'assignment', 'lab', 'deadline', 'meeting')),
    completed BOOLEAN NOT NULL DEFAULT false,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.study_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_reminders ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES (Users can only read and mutate their own records)

-- Policies for study_notes
CREATE POLICY "Users can select their own notes" 
    ON public.study_notes FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes" 
    ON public.study_notes FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" 
    ON public.study_notes FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" 
    ON public.study_notes FOR DELETE 
    USING (auth.uid() = user_id);

-- Policies for study_todos
CREATE POLICY "Users can select their own todos" 
    ON public.study_todos FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own todos" 
    ON public.study_todos FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos" 
    ON public.study_todos FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos" 
    ON public.study_todos FOR DELETE 
    USING (auth.uid() = user_id);

-- Policies for study_reminders
CREATE POLICY "Users can select their own reminders" 
    ON public.study_reminders FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reminders" 
    ON public.study_reminders FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders" 
    ON public.study_reminders FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders" 
    ON public.study_reminders FOR DELETE 
    USING (auth.uid() = user_id);

-- 7. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_notes_user ON public.study_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_user ON public.study_todos(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_user ON public.study_reminders(user_id);
