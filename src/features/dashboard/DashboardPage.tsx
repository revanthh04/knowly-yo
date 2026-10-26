import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  FileText,
  Clock,
  Sparkles,
  Calendar,
  Repeat,
  Plus,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { useAppStore } from '@/hooks/useAppStore';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { toast } from '@/components/ui/Toast';

export function DashboardPage() {
  const navigate = useNavigate();
  const { store, currentUser, isTeacher } = useAppStore();

  const subjects = store.getSubjects();
  const notes = store.getNotes();
  const chapters = store.getChapters();
  const learningRecords = store.getLearningRecords();
  const lessons = store.getLessons();
  const revisions = store.getRevisionTasks();
  const questions = store.getQuestions();
  const assignments = store.getAssignments();
  const submissions = store.getSubmissions();

  // Quick Action Modal States
  const [practiceModalOpen, setPracticeModalOpen] = useState(false);
  const [selectedPracticeSubject, setSelectedPracticeSubject] = useState(subjects[0]?.id || '');
  const [practiceDuration, setPracticeDuration] = useState('45');
  const [practiceReflection, setPracticeReflection] = useState('');

  // Calculate actual computed metrics
  const totalMastered = learningRecords.filter((r) => r.status === 'mastered').length;
  const totalPracticed = learningRecords.filter((r) => r.status === 'practiced').length;
  const totalInLearning = learningRecords.filter((r) => r.status === 'learning').length;
  const totalChapters = chapters.length;

  const masteryPercent = totalChapters > 0
    ? Math.round(((totalMastered * 1 + totalPracticed * 0.7 + totalInLearning * 0.3) / totalChapters) * 100)
    : 0;

  const upcomingLessons = lessons.filter(
    (l) => l.status === 'scheduled' && new Date(l.starts_at).getTime() >= Date.now() - 3600000
  ).slice(0, 3);

  const dueRevisions = revisions.filter((r) => !r.is_completed).slice(0, 4);
  const recentNotes = notes.slice(0, 4);

  const handleStartPractice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPracticeSubject) return;
    const chaps = store.getChapters(selectedPracticeSubject);
    const targetChap = chaps[0]?.id || 'general';
    store.logPracticeSession(selectedPracticeSubject, targetChap, parseInt(practiceDuration, 10), practiceReflection);
    toast.success('Practice Session Logged', `Recorded ${practiceDuration} minutes of focused study.`);
    setPracticeModalOpen(false);
    setPracticeReflection('');
  };

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 tracking-wide uppercase">
            {currentDateFormatted}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
            Welcome back, {currentUser.full_name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isTeacher
              ? 'Ready to prepare scripts, monitor batch syllabus, and track student queries.'
              : 'Keep your technical streak going. Review published materials and submit assignments.'}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {isTeacher ? (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/knowledge?new=true')}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Note</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/planner')}
                className="gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Lesson</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setPracticeModalOpen(true)}
                className="gap-2"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Log Practice</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/question-bank?ask=true')}
                className="gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Ask Question</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Top Metrics Grid (Computed directly from real store) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover onClick={() => navigate('/knowledge')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Subjects</span>
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{subjects.length}</span>
            <span className="text-xs text-slate-400">across {chapters.length} chapters</span>
          </div>
        </Card>

        <Card hover onClick={() => navigate('/knowledge')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {isTeacher ? 'Teaching Notes' : 'Published Notes'}
            </span>
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{notes.length}</span>
            <span className="text-xs text-emerald-500">
              {notes.filter((n) => n.is_published).length} published
            </span>
          </div>
        </Card>

        <Card hover onClick={() => navigate('/learning')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Mastery Index</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{masteryPercent}%</span>
            <span className="text-xs text-slate-400">
              {totalMastered} of {totalChapters} mastered
            </span>
          </div>
        </Card>

        <Card hover onClick={() => navigate('/revisions')}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending Revisions</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Repeat className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{dueRevisions.length}</span>
            <span className="text-xs text-amber-500">spaced repetition</span>
          </div>
        </Card>
      </div>

      {/* Main Two-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Notes & Continue Learning (2 cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recently Edited Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Recently Updated Notes</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/knowledge')} className="text-xs">
                View all <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </CardHeader>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {recentNotes.map((note) => {
                const sub = subjects.find((s) => s.id === note.subject_id);
                return (
                  <div
                    key={note.id}
                    onClick={() => navigate(`/notes/${note.id}`)}
                    className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-lg transition-colors cursor-pointer group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-violet-500 transition-colors truncate">
                          {note.title}
                        </span>
                        {note.is_published && (
                          <Badge variant="success" className="text-[10px]">Published</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>{sub?.name || 'Technical Note'}</span>
                        <span>•</span>
                        <span>{new Date(note.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-violet-500 transition-colors shrink-0" />
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Continue Learning / Subject Quick Access */}
          <Card>
            <CardHeader>
              <CardTitle>Continue Learning Track</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/learning')} className="text-xs">
                Mastery Breakdown <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </CardHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {subjects.map((sub) => {
                const subChapters = chapters.filter((c) => c.subject_id === sub.id);
                const subMastered = learningRecords.filter(
                  (r) => r.subject_id === sub.id && r.status === 'mastered'
                ).length;
                const pct = subChapters.length > 0 ? Math.round((subMastered / subChapters.length) * 100) : 0;

                return (
                  <div
                    key={sub.id}
                    onClick={() => navigate(`/knowledge?subject=${sub.id}`)}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#1a1e2b]/50 hover:border-violet-500/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-violet-400 transition-colors">
                        {sub.name}
                      </span>
                      <span className="text-xs font-bold text-violet-500">{pct}%</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-violet-600 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2 truncate">{sub.description}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column: Upcoming Schedule & Revision Reminders (1 col wide) */}
        <div className="space-y-6">
          {/* Upcoming Classes / Lessons */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-violet-500" />
                <span>Upcoming Teaching Plan</span>
              </CardTitle>
            </CardHeader>

            {upcomingLessons.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">No upcoming classes scheduled.</p>
            ) : (
              <div className="space-y-3">
                {upcomingLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    onClick={() => navigate('/planner')}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#1a1e2b]/40 hover:border-violet-500/40 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {lesson.title}
                      </span>
                      <Badge variant="purple" className="text-[10px] shrink-0">
                        {lesson.batch_name || 'Class'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(lesson.starts_at).toLocaleDateString()} at {new Date(lesson.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => navigate('/planner')}
              >
                Open Teaching Calendar
              </Button>
            </div>
          </Card>

          {/* Revisions Due Soon */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Repeat className="w-4 h-4 text-amber-500" />
                <span>Spaced Revision Queue</span>
              </CardTitle>
            </CardHeader>

            {dueRevisions.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">All revision tasks are caught up!</p>
            ) : (
              <div className="space-y-2.5">
                {dueRevisions.map((rev) => (
                  <div
                    key={rev.id}
                    onClick={() => navigate('/revisions')}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#1a1e2b]/40 hover:border-amber-500/40 transition-all cursor-pointer flex items-start justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                        {rev.title}
                      </p>
                      <span className="text-[10px] text-amber-500 font-medium">
                        Due: {new Date(rev.due_at).toLocaleDateString()}
                      </span>
                    </div>
                    <Badge variant={rev.priority === 'high' ? 'danger' : 'warning'} className="text-[10px]">
                      {rev.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => navigate('/revisions')}
              >
                Go to Revision Center
              </Button>
            </div>
          </Card>

          {/* Student Questions Widget (For Teacher) / Assignments (For Student) */}
          {isTeacher ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-sky-500" />
                  <span>Student Questions</span>
                </CardTitle>
                <Badge variant="info" className="text-[10px]">
                  {questions.filter((q) => q.status === 'open').length} Open
                </Badge>
              </CardHeader>
              <div className="space-y-2">
                {questions.slice(0, 3).map((q) => (
                  <div
                    key={q.id}
                    onClick={() => navigate(`/question-bank?q=${q.id}`)}
                    className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{q.title}</p>
                    <span className="text-[10px] text-slate-400">Asked by {q.author_name}</span>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>My Assignments</span>
                </CardTitle>
              </CardHeader>
              <div className="space-y-2">
                {assignments.slice(0, 3).map((asg) => (
                  <div
                    key={asg.id}
                    onClick={() => navigate('/my-assignments')}
                    className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{asg.title}</p>
                    <span className="text-[10px] text-amber-500">
                      Due: {new Date(asg.due_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Practice Session Quick Modal */}
      <Modal
        isOpen={practiceModalOpen}
        onClose={() => setPracticeModalOpen(false)}
        title="Record Practice Session"
        description="Log focused time spent solving problems, implementing algorithms, or building modules."
      >
        <form onSubmit={handleStartPractice} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Subject Area
            </label>
            <select
              value={selectedPracticeSubject}
              onChange={(e) => setSelectedPracticeSubject(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-lg bg-white dark:bg-[#1a1e2b] border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-violet-500/40"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Duration (Minutes)"
            type="number"
            min="5"
            max="480"
            value={practiceDuration}
            onChange={(e) => setPracticeDuration(e.target.value)}
            required
          />

          <Textarea
            label="Key Learning / Reflections"
            placeholder="What concepts did you practice? Any difficult bugs or edge cases encountered?"
            value={practiceReflection}
            onChange={(e) => setPracticeReflection(e.target.value)}
            rows={3}
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setPracticeModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Practice Log
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
