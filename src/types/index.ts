// Core Type Definitions for Knowly-Yo

export type UserRole = 'teacher' | 'student';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface Subject {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon identifier (e.g. 'Code', 'Database', 'Cpu', 'Layers', 'Globe')
  color: string;
  is_archived?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Chapter {
  id: string;
  subject_id: string;
  parent_id?: string | null;
  title: string;
  sort_order: number;
  created_at: string;
}

export type NoteStatus = 'draft' | 'in_review' | 'ready' | 'archived';

export interface Note {
  id: string;
  chapter_id: string;
  subject_id: string;
  author_id: string;
  title: string;
  content_json: string; // Serialized Tiptap JSON or markdown string
  content_text?: string;
  status: NoteStatus;
  is_published: boolean;
  published_to_batches?: string[]; // Batch IDs
  tags: string[];
  created_at: string;
  updated_at: string;
}

export type LearningStatus = 'not_started' | 'learning' | 'practiced' | 'mastered';

export interface LearningRecord {
  id: string;
  user_id: string;
  chapter_id: string;
  subject_id: string;
  status: LearningStatus;
  confidence: number; // 1 to 5
  notes?: string;
  updated_at: string;
}

export interface PracticeSession {
  id: string;
  user_id: string;
  subject_id: string;
  chapter_id: string;
  duration_minutes: number;
  notes: string;
  created_at: string;
}

export type RevisionPriority = 'low' | 'medium' | 'high';

export interface RevisionTask {
  id: string;
  user_id: string;
  chapter_id: string;
  subject_id: string;
  title: string;
  due_at: string;
  interval_days: number;
  priority: RevisionPriority;
  is_completed: boolean;
  completed_at?: string;
  reminder_notes?: string;
  created_at: string;
}

export interface Batch {
  id: string;
  teacher_id: string;
  name: string;
  code: string;
  description: string;
  created_at: string;
  student_count?: number;
}

export interface BatchMember {
  id: string;
  batch_id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  joined_at: string;
}

export type LessonStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface Lesson {
  id: string;
  batch_id: string;
  batch_name?: string;
  teacher_id: string;
  subject_id: string;
  title: string;
  starts_at: string; // ISO string
  ends_at: string;
  planned_topics: string[];
  preparation_checklist: { id: string; label: string; checked: boolean }[];
  status: LessonStatus;
  homework?: string;
  teacher_notes?: string;
  class_log?: ClassLog;
}

export interface ClassLog {
  id: string;
  lesson_id: string;
  actual_topics_covered: string[];
  topics_postponed: string[];
  homework_assigned: string;
  student_questions: string[];
  next_lesson_plan: string;
  recorded_at: string;
}

export type QuestionStatus = 'open' | 'answered' | 'resolved';

export interface Question {
  id: string;
  author_id: string;
  author_name: string;
  author_role: UserRole;
  subject_id: string;
  chapter_id?: string;
  title: string;
  body: string;
  code_snippet?: string;
  tags: string[];
  status: QuestionStatus;
  answers_count: number;
  has_accepted_answer: boolean;
  created_at: string;
}

export interface Answer {
  id: string;
  question_id: string;
  author_id: string;
  author_name: string;
  author_role: UserRole;
  body: string;
  is_accepted: boolean;
  created_at: string;
}

export interface Assignment {
  id: string;
  batch_id: string;
  teacher_id: string;
  subject_id: string;
  title: string;
  description: string;
  due_at: string;
  max_score: number;
  created_at: string;
}

export type SubmissionStatus = 'submitted' | 'graded' | 'resubmit_requested';

export interface Submission {
  id: string;
  assignment_id: string;
  assignment_title?: string;
  student_id: string;
  student_name: string;
  content: string;
  code_solution?: string;
  score?: number;
  feedback?: string;
  status: SubmissionStatus;
  submitted_at: string;
  graded_at?: string;
}

export interface AppNotification {
  id: string;
  user_id: string;
  type: 'revision' | 'assignment' | 'question' | 'system' | 'lesson';
  title: string;
  message: string;
  link?: string;
  read_at?: string;
  created_at: string;
}

export interface AIGenerationHistory {
  id: string;
  user_id: string;
  prompt_type: 'structure_notes' | 'explain' | 'generate_examples' | 'quiz' | 'summarize' | 'mistakes';
  input_text: string;
  generated_text: string;
  created_at: string;
}
