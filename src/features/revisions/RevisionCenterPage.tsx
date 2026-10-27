import { useState } from 'react';
import {
  Repeat,
  CheckCircle2,
  Plus,
  Check
} from 'lucide-react';
import { useAppStore } from '@/hooks/useAppStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { toast } from '@/components/ui/Toast';
import confetti from 'canvas-confetti';

type RevisionFilter = 'all' | 'today' | 'upcoming' | 'overdue' | 'completed';

export function RevisionCenterPage() {
  const { store } = useAppStore();
  const revisions = store.getRevisionTasks();
  const subjects = store.getSubjects();
  const chapters = store.getChapters();

  const [activeFilter, setActiveFilter] = useState<RevisionFilter>('today');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New revision form state
  const [targetSubjectId, setTargetSubjectId] = useState(subjects[0]?.id || '');
  const [targetChapterId, setTargetChapterId] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [intervalDays, setIntervalDays] = useState(3);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [reminderNotes, setReminderNotes] = useState('');

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const endOfToday = startOfToday + 86400000;

  // Filter tasks
  const filteredTasks = revisions.filter((task) => {
    const dueTime = new Date(task.due_at).getTime();

    if (activeFilter === 'completed') {
      return task.is_completed;
    }

    if (task.is_completed) return false;

    if (activeFilter === 'overdue') {
      return dueTime < startOfToday;
    }
    if (activeFilter === 'today') {
      return dueTime >= startOfToday && dueTime <= endOfToday;
    }
    if (activeFilter === 'upcoming') {
      return dueTime > endOfToday;
    }
    return true;
  });

  const handleComplete = (id: string) => {
    store.completeRevisionTask(id);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    toast.success('Revision Completed! 🎯', 'Spaced repetition streak updated.');
  };

  const handleSnooze = (id: string, days: number) => {
    store.snoozeRevisionTask(id, days);
    toast.info('Revision Rescheduled', `Rescheduled for +${days} day(s) from now.`);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetChapterId || !taskTitle.trim()) {
      toast.error('Missing Information', 'Please provide a title and select a chapter.');
      return;
    }

    store.createRevisionTask({
      subjectId: targetSubjectId,
      chapterId: targetChapterId,
      title: taskTitle,
      intervalDays,
      priority,
      notes: reminderNotes
    });

    toast.success('Revision Task Created', `Scheduled in ${intervalDays} days.`);
    setCreateModalOpen(false);
    setTaskTitle('');
    setReminderNotes('');
  };

  const currentSubjectChapters = chapters.filter((c) => c.subject_id === targetSubjectId);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.06]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white/95">
            Spaced Revision Center
          </h1>
          <p className="text-xs sm:text-sm text-white/50 mt-1 leading-relaxed">
            Spaced repetition intervals (1, 3, 7, 14 days) to prevent knowledge degradation.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setTargetChapterId(currentSubjectChapters[0]?.id || '');
            setCreateModalOpen(true);
          }}
          className="gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Revision Task</span>
        </Button>
      </div>

      {/* Filter Tabs - Notion style */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-white/[0.06]">
        {[
          { key: 'today', label: 'Due Today', count: revisions.filter((r) => !r.is_completed && new Date(r.due_at).getTime() >= startOfToday && new Date(r.due_at).getTime() <= endOfToday).length },
          { key: 'overdue', label: 'Overdue', count: revisions.filter((r) => !r.is_completed && new Date(r.due_at).getTime() < startOfToday).length },
          { key: 'upcoming', label: 'Upcoming', count: revisions.filter((r) => !r.is_completed && new Date(r.due_at).getTime() > endOfToday).length },
          { key: 'all', label: 'All Active', count: revisions.filter((r) => !r.is_completed).length },
          { key: 'completed', label: 'Completed', count: revisions.filter((r) => r.is_completed).length }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key as RevisionFilter)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-[8px] text-xs font-medium transition-colors shrink-0 cursor-pointer ${
              activeFilter === tab.key
                ? 'bg-[#0075de] text-white'
                : 'bg-[#202020] text-white/65 hover:text-white border border-white/[0.06]'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeFilter === tab.key ? 'bg-white/20' : 'bg-white/[0.08]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title={activeFilter === 'today' ? 'No revisions due today!' : 'No tasks in this view'}
          description="You are caught up with your scheduled repetitions. Schedule a future topic to stay sharp."
          actionLabel="Schedule Revision"
          onAction={() => {
            setTargetChapterId(currentSubjectChapters[0]?.id || '');
            setCreateModalOpen(true);
          }}
        />
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const sub = subjects.find((s) => s.id === task.subject_id);
            const chap = chapters.find((c) => c.id === task.chapter_id);
            const isOverdue = !task.is_completed && new Date(task.due_at).getTime() < startOfToday;

            return (
              <Card
                key={task.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  isOverdue ? 'border-[#f64932]/[0.3] bg-[#f64932]/[0.04]' : ''
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <button
                    onClick={() => handleComplete(task.id)}
                    className={`mt-0.5 w-5 h-5 rounded-[5px] border flex items-center justify-center transition-colors cursor-pointer ${
                      task.is_completed
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-white/[0.15] hover:border-[#0075de] hover:bg-[#0075de]/10'
                    }`}
                    title={task.is_completed ? 'Completed' : 'Mark revision completed'}
                  >
                    {task.is_completed && <Check className="w-3 h-3" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-white/95">
                        {task.title}
                      </span>
                      <Badge
                        variant={
                          task.priority === 'high'
                            ? 'danger'
                            : task.priority === 'medium'
                            ? 'warning'
                            : 'neutral'
                        }
                        className="text-[10px]"
                      >
                        {task.priority}
                      </Badge>
                      {isOverdue && (
                        <Badge variant="warning" className="text-[10px]">
                          Overdue
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-white/40 mt-1 flex-wrap">
                      <span>{sub?.name || 'Topic'}</span>
                      <span>•</span>
                      <span>{chap?.title}</span>
                      <span>•</span>
                      <span>Due: {new Date(task.due_at).toLocaleDateString()}</span>
                    </div>

                    {task.reminder_notes && (
                      <p className="text-xs text-white/60 mt-2 bg-[#191919] p-2 rounded-[6px] border border-white/[0.06] font-mono text-[11px]">
                        📝 {task.reminder_notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Snooze & Interval Actions */}
                {!task.is_completed && (
                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    <span className="text-[11px] text-white/40 mr-1">Snooze:</span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSnooze(task.id, 1)}
                      className="h-6 px-2 text-[10px]"
                    >
                      +1d
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSnooze(task.id, 3)}
                      className="h-6 px-2 text-[10px]"
                    >
                      +3d
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSnooze(task.id, 7)}
                      className="h-6 px-2 text-[10px]"
                    >
                      +7d
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* New Revision Task Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Schedule Spaced Revision"
        description="Pick a concept topic and set an automated revision target."
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-white/70">
              Technology Subject
            </label>
            <select
              value={targetSubjectId}
              onChange={(e) => {
                setTargetSubjectId(e.target.value);
                const chaps = store.getChapters(e.target.value);
                setTargetChapterId(chaps[0]?.id || '');
              }}
              className="w-full px-3 py-1.5 text-sm rounded-[8px] bg-[#191919] border border-white/[0.1] text-white focus:outline-none focus:border-[#0075de]"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-white/70">
              Chapter / Concept Topic
            </label>
            <select
              value={targetChapterId}
              onChange={(e) => setTargetChapterId(e.target.value)}
              className="w-full px-3 py-1.5 text-sm rounded-[8px] bg-[#191919] border border-white/[0.1] text-white focus:outline-none focus:border-[#0075de]"
            >
              {currentSubjectChapters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Revision Task Focus"
            placeholder="e.g. Dynamic Method Dispatch & Memory vtable lookup"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-white/70">
                Spaced Interval
              </label>
              <select
                value={intervalDays}
                onChange={(e) => setIntervalDays(parseInt(e.target.value, 10))}
                className="w-full px-3 py-1.5 text-sm rounded-[8px] bg-[#191919] border border-white/[0.1] text-white focus:outline-none focus:border-[#0075de]"
              >
                <option value={1}>1 Day (Next day)</option>
                <option value={3}>3 Days (Short term)</option>
                <option value={7}>7 Days (1 Week)</option>
                <option value={14}>14 Days (2 Weeks)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-white/70">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-1.5 text-sm rounded-[8px] bg-[#191919] border border-white/[0.1] text-white focus:outline-none focus:border-[#0075de]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <Textarea
            label="Specific Key Questions to Test"
            placeholder="e.g. Can you explain why static methods are not overridden?"
            value={reminderNotes}
            onChange={(e) => setReminderNotes(e.target.value)}
            rows={2}
          />

          <div className="flex justify-end gap-2 pt-3">
            <Button variant="ghost" size="sm" type="button" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Schedule Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
