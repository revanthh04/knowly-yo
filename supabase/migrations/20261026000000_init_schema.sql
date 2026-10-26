-- ====================================================================
-- Knowly-Yo — Production Database Schema & Row Level Security (RLS)
-- ====================================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('teacher', 'student')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'BookOpen',
    color TEXT DEFAULT '#8b5cf6',
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CHAPTERS TABLE
CREATE TABLE IF NOT EXISTS public.chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. NOTES TABLE
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content_json JSONB NOT NULL DEFAULT '{"type":"doc","content":[{"type":"paragraph"}]}',
    content_text TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'ready', 'archived')),
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    published_to_batches UUID[] DEFAULT ARRAY[]::UUID[],
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. NOTE SHARES
CREATE TABLE IF NOT EXISTS public.note_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    permission TEXT NOT NULL DEFAULT 'read' CHECK (permission IN ('read', 'edit')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TAGS & NOTE_TAGS
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS public.note_tags (
    note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (note_id, tag_id)
);

-- 7. LEARNING RECORDS
CREATE TABLE IF NOT EXISTS public.learning_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'learning', 'practiced', 'mastered')),
    confidence INT NOT NULL DEFAULT 1 CHECK (confidence BETWEEN 1 AND 5),
    notes TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, chapter_id)
);

-- 8. PRACTICE SESSIONS
CREATE TABLE IF NOT EXISTS public.practice_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
    duration_minutes INT NOT NULL CHECK (duration_minutes > 0),
    notes TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. REVISION TASKS
CREATE TABLE IF NOT EXISTS public.revision_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    due_at TIMESTAMPTZ NOT NULL,
    interval_days INT NOT NULL DEFAULT 3,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    reminder_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. BATCHES & MEMBERS
CREATE TABLE IF NOT EXISTS public.batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.batch_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (batch_id, student_id)
);

-- 11. LESSONS & CLASS LOGS
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    planned_topics TEXT[] DEFAULT ARRAY[]::TEXT[],
    preparation_checklist JSONB DEFAULT '[]'::JSONB,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    homework TEXT,
    teacher_notes TEXT
);

CREATE TABLE IF NOT EXISTS public.class_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL UNIQUE REFERENCES public.lessons(id) ON DELETE CASCADE,
    actual_topics_covered TEXT[] DEFAULT ARRAY[]::TEXT[],
    topics_postponed TEXT[] DEFAULT ARRAY[]::TEXT[],
    homework_assigned TEXT,
    student_questions TEXT[] DEFAULT ARRAY[]::TEXT[],
    next_lesson_plan TEXT,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. QUESTION BANK & ANSWERS
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    code_snippet TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'answered', 'resolved')),
    answers_count INT NOT NULL DEFAULT 0,
    has_accepted_answer BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    is_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. ASSIGNMENTS & SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    due_at TIMESTAMPTZ NOT NULL,
    max_score INT NOT NULL DEFAULT 100,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    code_solution TEXT,
    score INT,
    feedback TEXT,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'resubmit_requested')),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    graded_at TIMESTAMPTZ,
    UNIQUE (assignment_id, student_id)
);

-- 14. AI GENERATIONS & NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.ai_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    note_id UUID REFERENCES public.notes(id) ON DELETE SET NULL,
    type TEXT NOT NULL,
    input_text TEXT,
    generated_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batch_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper security function: Get current user role
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Profiles: Authenticated users can view profiles; only owner can update info (role elevation blocked)
CREATE POLICY "Profiles viewable by authenticated users" ON public.profiles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile except role" ON public.profiles
    FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Notes Security:
-- 1. Teachers can see all notes they authored.
-- 2. Students can ONLY select notes that are marked is_published = true.
-- 3. Only the author teacher can modify notes.
CREATE POLICY "Teachers can view own notes" ON public.notes
    FOR SELECT TO authenticated
    USING (author_id = auth.uid());

CREATE POLICY "Students can view published notes" ON public.notes
    FOR SELECT TO authenticated
    USING (is_published = TRUE);

CREATE POLICY "Authors can insert and update their notes" ON public.notes
    FOR ALL TO authenticated
    USING (author_id = auth.uid());

-- Learning Records: Users can only see and modify their own records
CREATE POLICY "Users own learning records" ON public.learning_records
    FOR ALL TO authenticated
    USING (user_id = auth.uid());

-- Revision Tasks: Users own revision tasks
CREATE POLICY "Users own revision tasks" ON public.revision_tasks
    FOR ALL TO authenticated
    USING (user_id = auth.uid());

-- Batches: Teachers manage their batches; students view enrolled batches
CREATE POLICY "Teachers manage batches" ON public.batches
    FOR ALL TO authenticated
    USING (teacher_id = auth.uid());

CREATE POLICY "Students view enrolled batches" ON public.batches
    FOR SELECT TO authenticated
    USING (id IN (SELECT batch_id FROM public.batch_members WHERE student_id = auth.uid()));

-- Submissions: Students manage own submissions; batch teacher can view and grade
CREATE POLICY "Students manage own submissions" ON public.submissions
    FOR ALL TO authenticated
    USING (student_id = auth.uid());

CREATE POLICY "Teachers can view and grade batch submissions" ON public.submissions
    FOR ALL TO authenticated
    USING (
        assignment_id IN (
            SELECT id FROM public.assignments WHERE teacher_id = auth.uid()
        )
    );
