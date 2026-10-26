import { describe, it, expect, beforeEach } from 'vitest';
import { appStore } from '../src/lib/supabase/store';

describe('Knowly-Yo Store & RLS Authorization Rules', () => {
  beforeEach(() => {
    // Reset to clean default state before each test
    appStore.resetToDefaults();
  });

  it('1. Teacher can create subjects, chapters, and private draft notes', () => {
    appStore.switchUser('user-teacher-revanth');
    const teacher = appStore.getCurrentUser();
    expect(teacher.role).toBe('teacher');

    const subject = appStore.createSubject({
      name: 'System Design & High-Throughput Architecture',
      description: 'Distributed caches, message brokers, and horizontal sharding.',
      icon: 'Server',
      color: '#6366f1'
    });
    expect(subject.id).toBeDefined();

    const chapter = appStore.createChapter({
      subject_id: subject.id,
      title: '01. Consistent Hashing & Distributed Ring',
      sort_order: 1
    });
    expect(chapter.id).toBeDefined();

    const note = appStore.saveNote({
      title: 'Internal Class Script on Consistent Hashing',
      subject_id: subject.id,
      chapter_id: chapter.id,
      status: 'draft',
      is_published: false,
      tags: ['system-design', 'draft']
    });

    expect(note.id).toBeDefined();
    expect(note.is_published).toBe(false);

    // Teacher can read their own private note
    const retrievedTeacherNote = appStore.getNote(note.id);
    expect(retrievedTeacherNote).toBeDefined();
    expect(retrievedTeacherNote?.title).toBe('Internal Class Script on Consistent Hashing');
  });

  it('2. Student cannot access private draft notes (RLS boundary enforced)', () => {
    // 1. Teacher creates an unpublished draft note
    appStore.switchUser('user-teacher-revanth');
    const privateNote = appStore.saveNote({
      title: 'Teacher Secret Exam Outline',
      subject_id: 'sub-java',
      chapter_id: 'chap-java-01',
      status: 'draft',
      is_published: false,
      tags: ['exam-secret']
    });

    // 2. Switch user to student
    appStore.switchUser('user-student-alex');
    const student = appStore.getCurrentUser();
    expect(student.role).toBe('student');

    // Student attempts to get private note directly by ID
    const studentAccessAttempt = appStore.getNote(privateNote.id);
    expect(studentAccessAttempt).toBeUndefined();

    // Student queries list of notes — private note must NOT be in the list
    const studentNotesList = appStore.getNotes();
    const leaked = studentNotesList.some((n) => n.id === privateNote.id);
    expect(leaked).toBe(false);
  });

  it('3. When teacher publishes note, student gains access', () => {
    appStore.switchUser('user-teacher-revanth');
    const draftNote = appStore.saveNote({
      title: 'Java Concurrency Primitives Live Notes',
      subject_id: 'sub-java',
      chapter_id: 'chap-java-04',
      status: 'ready',
      is_published: false
    });

    // Publish the note
    appStore.publishNote(draftNote.id, true, ['batch-2026-java']);

    // Switch to student
    appStore.switchUser('user-student-alex');
    const studentVisibleNote = appStore.getNote(draftNote.id);
    expect(studentVisibleNote).toBeDefined();
    expect(studentVisibleNote?.is_published).toBe(true);
  });

  it('4. Spaced Revision Center correctly schedules intervals and handles snooze', () => {
    appStore.switchUser('user-teacher-revanth');
    const task = appStore.createRevisionTask({
      subjectId: 'sub-sql',
      chapterId: 'chap-sql-03',
      title: 'B-Tree Indexing Deep Dive',
      intervalDays: 7,
      priority: 'high',
      notes: 'Test EXPLAIN ANALYZE cost calculations'
    });

    expect(task.id).toBeDefined();
    expect(task.is_completed).toBe(false);

    // Complete task
    appStore.completeRevisionTask(task.id);
    const completedTask = appStore.revisions.find((r) => r.id === task.id);
    expect(completedTask?.is_completed).toBe(true);

    // Snooze task +3 days
    appStore.snoozeRevisionTask(task.id, 3);
    const snoozedTask = appStore.revisions.find((r) => r.id === task.id);
    expect(snoozedTask?.is_completed).toBe(false);
    expect(new Date(snoozedTask!.due_at).getTime()).toBeGreaterThan(Date.now());
  });

  it('5. Assignment submission and grading lifecycle preserves data integrity', () => {
    // 1. Teacher publishes assignment
    appStore.switchUser('user-teacher-revanth');
    const asg = appStore.createAssignment({
      title: 'Implement Custom ThreadPoolExecutor',
      description: 'Bounded task queue with rejection execution policy.',
      batch_id: 'batch-2026-java',
      subject_id: 'sub-java',
      due_at: new Date(Date.now() + 86400000).toISOString(),
      max_score: 100
    });

    // 2. Student submits assignment
    appStore.switchUser('user-student-alex');
    const subm = appStore.submitAssignment(
      asg.id,
      'Implemented fixed capacity ArrayBlockingQueue worker thread pool.',
      'public class CustomThreadPool { ... }'
    );
    expect(subm.status).toBe('submitted');

    // 3. Teacher reviews and grades submission
    appStore.switchUser('user-teacher-revanth');
    appStore.gradeSubmission(subm.id, 98, 'Flawless worker interruption handling.');
    const graded = appStore.submissions.find((s) => s.id === subm.id);
    expect(graded?.status).toBe('graded');
    expect(graded?.score).toBe(98);
    expect(graded?.feedback).toContain('Flawless');
  });
});
