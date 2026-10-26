import {
  Profile,
  Subject,
  Chapter,
  Note,
  LearningRecord,
  PracticeSession,
  RevisionTask,
  Batch,
  Lesson,
  Question,
  Answer,
  Assignment,
  Submission,
  AppNotification,
  AIGenerationHistory,
  UserRole,
  LearningStatus,
  ClassLog
} from '@/types';
import {
  SEED_PROFILES,
  SEED_SUBJECTS,
  SEED_CHAPTERS,
  SEED_NOTES,
  SEED_LEARNING_RECORDS,
  SEED_REVISIONS,
  SEED_BATCHES,
  SEED_LESSONS,
  SEED_QUESTIONS,
  SEED_ANSWERS,
  SEED_ASSIGNMENTS,
  SEED_SUBMISSIONS,
  SEED_NOTIFICATIONS
} from './seedData';
import { isSupabaseConfigured, supabase } from './client';

const STORAGE_KEY_PREFIX = 'knowly_yo_';

function getStored<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return fallback;
    }
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

class AppStore {
  private listeners: Set<() => void> = new Set();

  public profiles: Profile[] = getStored('profiles', SEED_PROFILES);
  public currentUserId: string = getStored('current_user_id', 'user-teacher-revanth');

  public subjects: Subject[] = getStored('subjects', SEED_SUBJECTS);
  public chapters: Chapter[] = getStored('chapters', SEED_CHAPTERS);
  public notes: Note[] = getStored('notes', SEED_NOTES);
  public learningRecords: LearningRecord[] = getStored('learning_records', SEED_LEARNING_RECORDS);
  public practiceSessions: PracticeSession[] = getStored('practice_sessions', []);
  public revisions: RevisionTask[] = getStored('revisions', SEED_REVISIONS);
  public batches: Batch[] = getStored('batches', SEED_BATCHES);
  public lessons: Lesson[] = getStored('lessons', SEED_LESSONS);
  public questions: Question[] = getStored('questions', SEED_QUESTIONS);
  public answers: Answer[] = getStored('answers', SEED_ANSWERS);
  public assignments: Assignment[] = getStored('assignments', SEED_ASSIGNMENTS);
  public submissions: Submission[] = getStored('submissions', SEED_SUBMISSIONS);
  public notifications: AppNotification[] = getStored('notifications', SEED_NOTIFICATIONS);
  public aiGenerations: AIGenerationHistory[] = getStored('ai_generations', []);

  constructor() {
    this.syncFromSupabaseIfAvailable();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn());
  }

  private persistAll(): void {
    setStored('profiles', this.profiles);
    setStored('current_user_id', this.currentUserId);
    setStored('subjects', this.subjects);
    setStored('chapters', this.chapters);
    setStored('notes', this.notes);
    setStored('learning_records', this.learningRecords);
    setStored('practice_sessions', this.practiceSessions);
    setStored('revisions', this.revisions);
    setStored('batches', this.batches);
    setStored('lessons', this.lessons);
    setStored('questions', this.questions);
    setStored('answers', this.answers);
    setStored('assignments', this.assignments);
    setStored('submissions', this.submissions);
    setStored('notifications', this.notifications);
    setStored('ai_generations', this.aiGenerations);
    this.notify();
  }

  private async syncFromSupabaseIfAvailable() {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data: supaSubjects } = await supabase.from('subjects').select('*');
      if (supaSubjects && supaSubjects.length > 0) {
        this.subjects = supaSubjects;
        this.notify();
      }
    } catch (e) {
      console.warn('Supabase sync skipped/failed, using local storage state.', e);
    }
  }

  // --- Auth & Profile ---
  public getCurrentUser(): Profile {
    const user = this.profiles.find((p) => p.id === this.currentUserId);
    return user || this.profiles[0];
  }

  public switchUser(userId: string): void {
    if (this.profiles.some((p) => p.id === userId)) {
      this.currentUserId = userId;
      setStored('current_user_id', userId);
      this.notify();
    }
  }

  public setRole(role: UserRole): void {
    const user = this.getCurrentUser();
    if (user) {
      user.role = role;
      this.persistAll();
    }
  }

  // --- Subjects ---
  public getSubjects(): Subject[] {
    return this.subjects.filter((s) => !s.is_archived);
  }

  public getAllSubjects(): Subject[] {
    return this.subjects;
  }

  public getSubject(id: string): Subject | undefined {
    return this.subjects.find((s) => s.id === id);
  }

  public createSubject(data: Omit<Subject, 'id' | 'created_at' | 'updated_at' | 'owner_id'>): Subject {
    const user = this.getCurrentUser();
    const newSubject: Subject = {
      ...data,
      id: 'sub-' + Date.now(),
      owner_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.subjects.unshift(newSubject);
    this.persistAll();
    return newSubject;
  }

  public updateSubject(id: string, updates: Partial<Subject>): Subject | undefined {
    const index = this.subjects.findIndex((s) => s.id === id);
    if (index === -1) return undefined;
    this.subjects[index] = {
      ...this.subjects[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.persistAll();
    return this.subjects[index];
  }

  public deleteSubject(id: string): void {
    this.subjects = this.subjects.filter((s) => s.id !== id);
    this.chapters = this.chapters.filter((c) => c.subject_id !== id);
    this.notes = this.notes.filter((n) => n.subject_id !== id);
    this.persistAll();
  }

  // --- Chapters ---
  public getChapters(subjectId?: string): Chapter[] {
    const list = subjectId
      ? this.chapters.filter((c) => c.subject_id === subjectId)
      : this.chapters;
    return [...list].sort((a, b) => a.sort_order - b.sort_order);
  }

  public createChapter(data: Omit<Chapter, 'id' | 'created_at'>): Chapter {
    const newChapter: Chapter = {
      ...data,
      id: 'chap-' + Date.now(),
      created_at: new Date().toISOString()
    };
    this.chapters.push(newChapter);
    this.persistAll();
    return newChapter;
  }

  public updateChapter(id: string, updates: Partial<Chapter>): Chapter | undefined {
    const index = this.chapters.findIndex((c) => c.id === id);
    if (index === -1) return undefined;
    this.chapters[index] = { ...this.chapters[index], ...updates };
    this.persistAll();
    return this.chapters[index];
  }

  public deleteChapter(id: string): void {
    this.chapters = this.chapters.filter((c) => c.id !== id);
    this.notes = this.notes.filter((n) => n.chapter_id !== id);
    this.persistAll();
  }

  // --- Notes ---
  public getNotes(filters?: { subjectId?: string; chapterId?: string; search?: string; tag?: string }): Note[] {
    const user = this.getCurrentUser();
    let result = [...this.notes];

    // Authorization rule: Students can read only published notes
    if (user.role === 'student') {
      result = result.filter((n) => n.is_published);
    }

    if (filters?.subjectId) {
      result = result.filter((n) => n.subject_id === filters.subjectId);
    }
    if (filters?.chapterId) {
      result = result.filter((n) => n.chapter_id === filters.chapterId);
    }
    if (filters?.tag) {
      result = result.filter((n) => n.tags.includes(filters.tag!));
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content_json.toLowerCase().includes(q) ||
          (n.content_text && n.content_text.toLowerCase().includes(q))
      );
    }

    return result.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }

  public getNote(id: string): Note | undefined {
    const user = this.getCurrentUser();
    const note = this.notes.find((n) => n.id === id);
    if (!note) return undefined;
    // Security check: if student, must be published
    if (user.role === 'student' && !note.is_published && note.author_id !== user.id) {
      return undefined;
    }
    return note;
  }

  public saveNote(noteData: Partial<Note> & { title: string; chapter_id: string; subject_id: string }): Note {
    const user = this.getCurrentUser();
    const now = new Date().toISOString();

    if (noteData.id) {
      const index = this.notes.findIndex((n) => n.id === noteData.id);
      if (index !== -1) {
        this.notes[index] = {
          ...this.notes[index],
          ...noteData,
          updated_at: now
        };
        this.persistAll();
        return this.notes[index];
      }
    }

    // Create new note
    const newNote: Note = {
      id: 'note-' + Date.now(),
      chapter_id: noteData.chapter_id,
      subject_id: noteData.subject_id,
      author_id: user.id,
      title: noteData.title,
      content_json: noteData.content_json || '{"type":"doc","content":[{"type":"paragraph"}]}',
      content_text: noteData.content_text || '',
      status: noteData.status || 'draft',
      is_published: noteData.is_published ?? false,
      published_to_batches: noteData.published_to_batches || [],
      tags: noteData.tags || [],
      created_at: now,
      updated_at: now
    };
    this.notes.unshift(newNote);
    this.persistAll();
    return newNote;
  }

  public deleteNote(id: string): void {
    this.notes = this.notes.filter((n) => n.id !== id);
    this.persistAll();
  }

  public publishNote(id: string, isPublished: boolean, batchIds: string[] = []): Note | undefined {
    const note = this.notes.find((n) => n.id === id);
    if (!note) return undefined;
    note.is_published = isPublished;
    note.published_to_batches = batchIds;
    note.updated_at = new Date().toISOString();
    this.persistAll();
    return note;
  }

  // --- Learning Records & Mastery ---
  public getLearningRecords(): LearningRecord[] {
    const user = this.getCurrentUser();
    return this.learningRecords.filter((r) => r.user_id === user.id);
  }

  public updateLearningRecord(chapterId: string, subjectId: string, updates: Partial<LearningRecord>): LearningRecord {
    const user = this.getCurrentUser();
    const existingIndex = this.learningRecords.findIndex(
      (r) => r.user_id === user.id && r.chapter_id === chapterId
    );

    const now = new Date().toISOString();
    if (existingIndex !== -1) {
      this.learningRecords[existingIndex] = {
        ...this.learningRecords[existingIndex],
        ...updates,
        updated_at: now
      };
      this.persistAll();
      return this.learningRecords[existingIndex];
    } else {
      const newRec: LearningRecord = {
        id: 'lr-' + Date.now(),
        user_id: user.id,
        chapter_id: chapterId,
        subject_id: subjectId,
        status: updates.status || 'learning',
        confidence: updates.confidence || 3,
        notes: updates.notes,
        updated_at: now
      };
      this.learningRecords.push(newRec);
      this.persistAll();
      return newRec;
    }
  }

  // --- Practice Sessions ---
  public getPracticeSessions(): PracticeSession[] {
    const user = this.getCurrentUser();
    return this.practiceSessions.filter((p) => p.user_id === user.id);
  }

  public logPracticeSession(subjectId: string, chapterId: string, durationMinutes: number, notes: string): PracticeSession {
    const user = this.getCurrentUser();
    const session: PracticeSession = {
      id: 'prac-' + Date.now(),
      user_id: user.id,
      subject_id: subjectId,
      chapter_id: chapterId,
      duration_minutes: durationMinutes,
      notes,
      created_at: new Date().toISOString()
    };
    this.practiceSessions.unshift(session);
    this.persistAll();
    return session;
  }

  // --- Revision Center ---
  public getRevisionTasks(): RevisionTask[] {
    const user = this.getCurrentUser();
    return this.revisions.filter((r) => r.user_id === user.id);
  }

  public createRevisionTask(data: {
    chapterId: string;
    subjectId: string;
    title: string;
    intervalDays: number;
    priority: RevisionTask['priority'];
    notes?: string;
  }): RevisionTask {
    const user = this.getCurrentUser();
    const dueAt = new Date(Date.now() + data.intervalDays * 86400000).toISOString();
    const task: RevisionTask = {
      id: 'rev-' + Date.now(),
      user_id: user.id,
      chapter_id: data.chapterId,
      subject_id: data.subjectId,
      title: data.title,
      due_at: dueAt,
      interval_days: data.intervalDays,
      priority: data.priority,
      is_completed: false,
      reminder_notes: data.notes,
      created_at: new Date().toISOString()
    };
    this.revisions.unshift(task);
    this.persistAll();
    return task;
  }

  public completeRevisionTask(id: string): void {
    const task = this.revisions.find((r) => r.id === id);
    if (task) {
      task.is_completed = true;
      task.completed_at = new Date().toISOString();
      this.persistAll();
    }
  }

  public snoozeRevisionTask(id: string, days: number): void {
    const task = this.revisions.find((r) => r.id === id);
    if (task) {
      task.due_at = new Date(Date.now() + days * 86400000).toISOString();
      task.is_completed = false;
      this.persistAll();
    }
  }

  // --- Batches & Lessons (Teaching Planner) ---
  public getBatches(): Batch[] {
    const user = this.getCurrentUser();
    if (user.role === 'teacher') {
      return this.batches.filter((b) => b.teacher_id === user.id);
    }
    // Student sees batches they belong to
    return this.batches;
  }

  public createBatch(name: string, code: string, description: string): Batch {
    const user = this.getCurrentUser();
    const newBatch: Batch = {
      id: 'batch-' + Date.now(),
      teacher_id: user.id,
      name,
      code: code.toUpperCase(),
      description,
      student_count: 0,
      created_at: new Date().toISOString()
    };
    this.batches.unshift(newBatch);
    this.persistAll();
    return newBatch;
  }

  public getLessons(): Lesson[] {
    return [...this.lessons].sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime());
  }

  public createLesson(lesson: Omit<Lesson, 'id'>): Lesson {
    const newLesson: Lesson = {
      ...lesson,
      id: 'lesson-' + Date.now()
    };
    this.lessons.push(newLesson);
    this.persistAll();
    return newLesson;
  }

  public updateLesson(id: string, updates: Partial<Lesson>): Lesson | undefined {
    const index = this.lessons.findIndex((l) => l.id === id);
    if (index === -1) return undefined;
    this.lessons[index] = { ...this.lessons[index], ...updates };
    this.persistAll();
    return this.lessons[index];
  }

  public recordClassLog(lessonId: string, logData: Omit<ClassLog, 'id' | 'lesson_id' | 'recorded_at'>): ClassLog {
    const lesson = this.lessons.find((l) => l.id === lessonId);
    const newLog: ClassLog = {
      ...logData,
      id: 'log-' + Date.now(),
      lesson_id: lessonId,
      recorded_at: new Date().toISOString()
    };
    if (lesson) {
      lesson.class_log = newLog;
      lesson.status = 'completed';
      this.persistAll();
    }
    return newLog;
  }

  // --- Question Bank ---
  public getQuestions(): Question[] {
    return [...this.questions].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getQuestion(id: string): Question | undefined {
    return this.questions.find((q) => q.id === id);
  }

  public createQuestion(data: { title: string; body: string; subject_id: string; chapter_id?: string; code_snippet?: string; tags: string[] }): Question {
    const user = this.getCurrentUser();
    const newQ: Question = {
      ...data,
      id: 'q-' + Date.now(),
      author_id: user.id,
      author_name: user.full_name,
      author_role: user.role,
      status: 'open',
      answers_count: 0,
      has_accepted_answer: false,
      created_at: new Date().toISOString()
    };
    this.questions.unshift(newQ);

    // Notify teacher if student asked
    if (user.role === 'student') {
      this.notifications.unshift({
        id: 'notif-' + Date.now(),
        user_id: 'user-teacher-revanth',
        type: 'question',
        title: 'New Student Question',
        message: `${user.full_name} asked: "${newQ.title}"`,
        link: '/question-bank',
        created_at: new Date().toISOString()
      });
    }

    this.persistAll();
    return newQ;
  }

  public getAnswers(questionId: string): Answer[] {
    return this.answers.filter((a) => a.question_id === questionId);
  }

  public addAnswer(questionId: string, body: string): Answer {
    const user = this.getCurrentUser();
    const ans: Answer = {
      id: 'ans-' + Date.now(),
      question_id: questionId,
      author_id: user.id,
      author_name: user.full_name,
      author_role: user.role,
      body,
      is_accepted: false,
      created_at: new Date().toISOString()
    };
    this.answers.push(ans);

    const question = this.questions.find((q) => q.id === questionId);
    if (question) {
      question.answers_count += 1;
      if (question.status === 'open') {
        question.status = 'answered';
      }
    }

    this.persistAll();
    return ans;
  }

  public acceptAnswer(questionId: string, answerId: string): void {
    const user = this.getCurrentUser();
    const q = this.questions.find((x) => x.id === questionId);
    // Only author or teacher can mark answer accepted
    if (!q || (q.author_id !== user.id && user.role !== 'teacher')) return;

    this.answers.forEach((a) => {
      if (a.question_id === questionId) {
        a.is_accepted = a.id === answerId;
      }
    });
    q.has_accepted_answer = true;
    q.status = 'resolved';
    this.persistAll();
  }

  // --- Assignments & Submissions ---
  public getAssignments(): Assignment[] {
    return [...this.assignments].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public createAssignment(data: Omit<Assignment, 'id' | 'teacher_id' | 'created_at'>): Assignment {
    const user = this.getCurrentUser();
    const asg: Assignment = {
      ...data,
      id: 'asg-' + Date.now(),
      teacher_id: user.id,
      created_at: new Date().toISOString()
    };
    this.assignments.unshift(asg);
    this.persistAll();
    return asg;
  }

  public getSubmissions(assignmentId?: string): Submission[] {
    const user = this.getCurrentUser();
    let list = [...this.submissions];
    if (assignmentId) {
      list = list.filter((s) => s.assignment_id === assignmentId);
    }
    if (user.role === 'student') {
      list = list.filter((s) => s.student_id === user.id);
    }
    return list;
  }

  public submitAssignment(assignmentId: string, content: string, codeSolution?: string): Submission {
    const user = this.getCurrentUser();
    const asg = this.assignments.find((a) => a.id === assignmentId);
    const existingIndex = this.submissions.findIndex((s) => s.assignment_id === assignmentId && s.student_id === user.id);

    const subm: Submission = {
      id: existingIndex !== -1 ? this.submissions[existingIndex].id : 'subm-' + Date.now(),
      assignment_id: assignmentId,
      assignment_title: asg?.title,
      student_id: user.id,
      student_name: user.full_name,
      content,
      code_solution: codeSolution,
      status: 'submitted',
      submitted_at: new Date().toISOString()
    };

    if (existingIndex !== -1) {
      this.submissions[existingIndex] = subm;
    } else {
      this.submissions.unshift(subm);
    }

    this.persistAll();
    return subm;
  }

  public gradeSubmission(submissionId: string, score: number, feedback: string): void {
    const s = this.submissions.find((sub) => sub.id === submissionId);
    if (s) {
      s.score = score;
      s.feedback = feedback;
      s.status = 'graded';
      s.graded_at = new Date().toISOString();
      this.persistAll();
    }
  }

  // --- Notifications ---
  public getNotifications(): AppNotification[] {
    const user = this.getCurrentUser();
    return this.notifications.filter((n) => n.user_id === user.id);
  }

  public markNotificationRead(id: string): void {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read_at = new Date().toISOString();
      this.persistAll();
    }
  }

  // --- AI Generation History ---
  public getAIGenerations(): AIGenerationHistory[] {
    return this.aiGenerations;
  }

  public recordAIGeneration(type: AIGenerationHistory['prompt_type'], input: string, output: string): void {
    const user = this.getCurrentUser();
    this.aiGenerations.unshift({
      id: 'ai-' + Date.now(),
      user_id: user.id,
      prompt_type: type,
      input_text: input,
      generated_text: output,
      created_at: new Date().toISOString()
    });
    this.persistAll();
  }

  // --- Reset to seed demo state ---
  public resetToDefaults(): void {
    this.profiles = [...SEED_PROFILES];
    this.currentUserId = 'user-teacher-revanth';
    this.subjects = [...SEED_SUBJECTS];
    this.chapters = [...SEED_CHAPTERS];
    this.notes = [...SEED_NOTES];
    this.learningRecords = [...SEED_LEARNING_RECORDS];
    this.practiceSessions = [];
    this.revisions = [...SEED_REVISIONS];
    this.batches = [...SEED_BATCHES];
    this.lessons = [...SEED_LESSONS];
    this.questions = [...SEED_QUESTIONS];
    this.answers = [...SEED_ANSWERS];
    this.assignments = [...SEED_ASSIGNMENTS];
    this.submissions = [...SEED_SUBMISSIONS];
    this.notifications = [...SEED_NOTIFICATIONS];
    this.aiGenerations = [];
    this.persistAll();
  }
}

export const appStore = new AppStore();
