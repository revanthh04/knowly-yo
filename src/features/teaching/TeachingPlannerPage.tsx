import { useState } from 'react';
import {
  CalendarDays,
  List,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  CheckSquare,
  Users,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { useAppStore } from '@/hooks/useAppStore';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { toast } from '@/components/ui/Toast';
import { Lesson, ClassLog } from '@/types';

export function TeachingPlannerPage() {
  const { store, currentUser, isTeacher } = useAppStore();
  const lessons = store.getLessons();
  const batches = store.getBatches();
  const subjects = store.getSubjects();

  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [classLogModalOpen, setClassLogModalOpen] = useState(false);
  const [activeLessonForLog, setActiveLessonForLog] = useState<Lesson | null>(null);

  // New Lesson form state
  const [lessonTitle, setLessonTitle] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [startsAt, setStartsAt] = useState('');
  const [plannedTopicsText, setPlannedTopicsText] = useState('');
  const [preparationItemsText, setPreparationItemsText] = useState('');
  const [teacherNotes, setTeacherNotes] = useState('');

  // Class Log form state
  const [coveredTopicsText, setCoveredTopicsText] = useState('');
  const [postponedTopicsText, setPostponedTopicsText] = useState('');
  const [homeworkText, setHomeworkText] = useState('');
  const [studentQuestionsText, setStudentQuestionsText] = useState('');
  const [nextPlanText, setNextPlanText] = useState('');

  const handleToggleChecklistItem = (lessonId: string, itemId: string) => {
    if (!isTeacher) return;
    const lesson = lessons.find((l) => l.id === lessonId);
    if (!lesson) return;
    const updatedChecklist = lesson.preparation_checklist.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    store.updateLesson(lessonId, { preparation_checklist: updatedChecklist });
    toast.info('Preparation checklist updated');
  };

  const handleScheduleLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim() || !startsAt) {
      toast.error('Missing Details', 'Please specify a lesson title and start date/time.');
      return;
    }

    const batchObj = batches.find((b) => b.id === selectedBatchId);
    const startDate = new Date(startsAt);
    const endDate = new Date(startDate.getTime() + 90 * 60000); // 90 min default

    const plannedTopics = plannedTopicsText
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);

    const checklist = preparationItemsText
      .split('\n')
      .map((item, idx) => ({ id: `c-${idx}`, label: item.trim(), checked: false }))
      .filter((item) => item.label.length > 0);

    store.createLesson({
      title: lessonTitle,
      batch_id: selectedBatchId,
      batch_name: batchObj?.name || 'Class',
      teacher_id: currentUser.id,
      subject_id: selectedSubjectId,
      starts_at: startDate.toISOString(),
      ends_at: endDate.toISOString(),
      planned_topics: plannedTopics,
      preparation_checklist: checklist.length > 0 ? checklist : [{ id: 'c1', label: 'Review lecture slides & code snippets', checked: false }],
      status: 'scheduled',
      teacher_notes: teacherNotes
    });

    toast.success('Lesson Scheduled', `Class added to calendar for ${batchObj?.name}`);
    setScheduleModalOpen(false);
    setLessonTitle('');
    setPlannedTopicsText('');
    setPreparationItemsText('');
  };

  const handleOpenClassLogModal = (lesson: Lesson) => {
    setActiveLessonForLog(lesson);
    setCoveredTopicsText(lesson.class_log?.actual_topics_covered.join('\n') || lesson.planned_topics.join('\n'));
    setPostponedTopicsText(lesson.class_log?.topics_postponed.join('\n') || '');
    setHomeworkText(lesson.class_log?.homework_assigned || lesson.homework || '');
    setStudentQuestionsText(lesson.class_log?.student_questions.join('\n') || '');
    setNextPlanText(lesson.class_log?.next_lesson_plan || '');
    setClassLogModalOpen(true);
  };

  const handleSaveClassLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLessonForLog) return;

    store.recordClassLog(activeLessonForLog.id, {
      actual_topics_covered: coveredTopicsText.split('\n').map((s) => s.trim()).filter(Boolean),
      topics_postponed: postponedTopicsText.split('\n').map((s) => s.trim()).filter(Boolean),
      homework_assigned: homeworkText,
      student_questions: studentQuestionsText.split('\n').map((s) => s.trim()).filter(Boolean),
      next_lesson_plan: nextPlanText
    });

    toast.success('Class Log Recorded', 'Teaching record archived with homework & student questions.');
    setClassLogModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Teaching & Lesson Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Maintain classroom schedules, prep checklists, and post-class logs with student feedback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-[#1a1e2b] p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-violet-600 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-violet-600 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
            </button>
          </div>

          {isTeacher && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setScheduleModalOpen(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Lesson</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Lessons View */}
      {lessons.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No lessons scheduled"
          description="Create your first classroom session to manage lesson plans and preparation checklists."
          actionLabel={isTeacher ? 'Schedule Lesson' : undefined}
          onAction={isTeacher ? () => setScheduleModalOpen(true) : undefined}
        />
      ) : (
        <div className="space-y-4">
          {lessons.map((lesson) => {
            const subject = subjects.find((s) => s.id === lesson.subject_id);
            const isCompleted = lesson.status === 'completed';

            return (
              <Card
                key={lesson.id}
                className={`transition-all ${isCompleted ? 'border-emerald-500/30' : ''}`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left: Lesson Info */}
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {lesson.title}
                      </span>
                      <Badge variant="purple" className="text-[10px]">
                        {lesson.batch_name || 'Batch'}
                      </Badge>
                      <Badge
                        variant={isCompleted ? 'success' : 'warning'}
                        className="text-[10px]"
                      >
                        {lesson.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1.5 text-violet-500 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(lesson.starts_at).toLocaleDateString()} at{' '}
                        {new Date(lesson.starts_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <span>•</span>
                      <span>{subject?.name || 'Subject'}</span>
                    </div>

                    {/* Planned Topics */}
                    {lesson.planned_topics.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold uppercase text-slate-400">
                          Planned Topics:
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {lesson.planned_topics.map((tp, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-[#1a1e2b] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                            >
                              {tp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Preparation Checklist */}
                    {lesson.preparation_checklist.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
                        <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1.5">
                          Teaching Prep Checklist:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {lesson.preparation_checklist.map((item) => (
                            <label
                              key={item.id}
                              className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none"
                            >
                              <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={() => handleToggleChecklistItem(lesson.id, item.id)}
                                disabled={!isTeacher}
                                className="w-3.5 h-3.5 rounded text-violet-600 focus:ring-violet-500"
                              />
                              <span className={item.checked ? 'line-through text-slate-400' : ''}>
                                {item.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Class Log Summary if completed */}
                    {lesson.class_log && (
                      <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                        <div className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Class Log Recorded</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">
                          <strong>Homework:</strong> {lesson.class_log.homework_assigned}
                        </p>
                        {lesson.class_log.next_lesson_plan && (
                          <p className="text-slate-600 dark:text-slate-300">
                            <strong>Next Class:</strong> {lesson.class_log.next_lesson_plan}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Actions */}
                  {isTeacher && (
                    <div className="flex flex-col gap-2 shrink-0 self-start">
                      <Button
                        variant={isCompleted ? 'outline' : 'primary'}
                        size="sm"
                        onClick={() => handleOpenClassLogModal(lesson)}
                        className="text-xs"
                      >
                        {isCompleted ? 'Edit Class Log' : 'Complete & Record Log'}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Schedule Lesson Modal */}
      <Modal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        title="Schedule Teaching Session"
        description="Plan a live class with batch syllabus targets and pre-flight checklist."
      >
        <form onSubmit={handleScheduleLesson} className="space-y-4">
          <Input
            label="Class Title"
            placeholder="e.g. Dynamic Method Dispatch & Collections Internals"
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Batch
              </label>
              <select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg bg-white dark:bg-[#1a1e2b] border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-slate-100"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Subject
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg bg-white dark:bg-[#1a1e2b] border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-slate-100"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Date & Start Time"
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            required
          />

          <Textarea
            label="Planned Topics (One per line)"
            placeholder="e.g.&#10;Polymorphism in runtime&#10;Virtual method tables&#10;PaymentGateway live code"
            value={plannedTopicsText}
            onChange={(e) => setPlannedTopicsText(e.target.value)}
            rows={3}
          />

          <Textarea
            label="Preparation Checklist (One per line)"
            placeholder="e.g.&#10;Clone demo repository&#10;Verify code snippets&#10;Prepare 2 live questions"
            value={preparationItemsText}
            onChange={(e) => setPreparationItemsText(e.target.value)}
            rows={3}
          />

          <Textarea
            label="Private Teacher Notes"
            placeholder="Pacing notes or student prerequisites to check..."
            value={teacherNotes}
            onChange={(e) => setTeacherNotes(e.target.value)}
            rows={2}
          />

          <div className="flex justify-end gap-2 pt-3">
            <Button variant="ghost" size="sm" type="button" onClick={() => setScheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Schedule Class
            </Button>
          </div>
        </form>
      </Modal>

      {/* Record Class Log Modal */}
      <Modal
        isOpen={classLogModalOpen}
        onClose={() => setClassLogModalOpen(false)}
        title="Post-Class Log & Notes"
        description="Record what was actually covered, postponed topics, homework, and student questions."
      >
        <form onSubmit={handleSaveClassLog} className="space-y-4">
          <Textarea
            label="Actual Topics Covered (One per line)"
            value={coveredTopicsText}
            onChange={(e) => setCoveredTopicsText(e.target.value)}
            rows={2}
            required
          />

          <Textarea
            label="Topics Postponed to Next Class (One per line)"
            placeholder="Topics that took longer or need a fresh session..."
            value={postponedTopicsText}
            onChange={(e) => setPostponedTopicsText(e.target.value)}
            rows={2}
          />

          <Input
            label="Homework / Assignment Given"
            placeholder="e.g. Complete exercises 4.1 to 4.5 in repository"
            value={homeworkText}
            onChange={(e) => setHomeworkText(e.target.value)}
            required
          />

          <Textarea
            label="Notable Student Questions"
            placeholder="Questions asked during class to remember or follow up on..."
            value={studentQuestionsText}
            onChange={(e) => setStudentQuestionsText(e.target.value)}
            rows={2}
          />

          <Input
            label="Next Lesson Plan"
            placeholder="e.g. Proceed with ExecutorService and concurrency primitives"
            value={nextPlanText}
            onChange={(e) => setNextPlanText(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-3">
            <Button variant="ghost" size="sm" type="button" onClick={() => setClassLogModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Teaching Log
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
