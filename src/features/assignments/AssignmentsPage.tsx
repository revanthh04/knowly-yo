import { useState } from 'react';
import {
  FileCheck2,
  Plus,
  Clock,
  User
} from 'lucide-react';
import { useAppStore } from '@/hooks/useAppStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { toast } from '@/components/ui/Toast';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import { Submission } from '@/types';

export function AssignmentsPage() {
  const { store } = useAppStore();
  const assignments = store.getAssignments();
  const submissions = store.getSubmissions();
  const batches = store.getBatches();
  const subjects = store.getSubjects();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState<Submission | null>(null);

  // New assignment form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [dueDate, setDueDate] = useState('');
  const [maxScore, setMaxScore] = useState(100);

  // Grading form state
  const [scoreInput, setScoreInput] = useState('90');
  const [feedbackInput, setFeedbackInput] = useState('');

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) {
      toast.error('Missing Required Fields', 'Please specify a title and due date.');
      return;
    }

    store.createAssignment({
      title,
      description,
      batch_id: selectedBatchId,
      subject_id: selectedSubjectId,
      due_at: new Date(dueDate).toISOString(),
      max_score: maxScore
    });

    toast.success('Assignment Published', `Created assignment: "${title}"`);
    setCreateModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleGradeSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmission) return;

    store.gradeSubmission(activeSubmission.id, parseInt(scoreInput, 10), feedbackInput);
    toast.success('Grade Recorded', `Score ${scoreInput}/100 and feedback sent.`);
    setGradeModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.06]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white/95">
            Cohort Assignments & Grading
          </h1>
          <p className="text-xs sm:text-sm text-white/50 mt-1 leading-relaxed">
            Assign problem sets, review student code submissions, and publish grading feedback.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setCreateModalOpen(true)}
          className="gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Assignment</span>
        </Button>
      </div>

      {/* Assignments & Submissions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Assignments */}
        <div className="space-y-3.5">
          <h2 className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
            Active Assignments ({assignments.length})
          </h2>

          {assignments.length === 0 ? (
            <EmptyState
              icon={FileCheck2}
              title="No assignments created"
              description="Create homework or coding challenges for your batches."
              actionLabel="Create Assignment"
              onAction={() => setCreateModalOpen(true)}
            />
          ) : (
            assignments.map((asg) => {
              const batch = batches.find((b) => b.id === asg.batch_id);
              const asgSubmissions = submissions.filter((s) => s.assignment_id === asg.id);

              return (
                <Card key={asg.id} className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-white/95">
                      {asg.title}
                    </span>
                    <Badge variant="blue" className="text-xs">
                      {batch?.name || 'Batch'}
                    </Badge>
                  </div>

                  <p className="text-xs text-white/60 leading-relaxed">
                    {asg.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-white/40 pt-2 border-t border-white/[0.06]">
                    <div className="flex items-center gap-1.5 text-[#ffc940] font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Due {new Date(asg.due_at).toLocaleDateString()}</span>
                    </div>
                    <span>
                      {asgSubmissions.length} submission{asgSubmissions.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Student Submissions Stream */}
        <div className="space-y-3.5">
          <h2 className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
            Student Submissions ({submissions.length})
          </h2>

          {submissions.length === 0 ? (
            <EmptyState
              icon={User}
              title="No submissions received"
              description="Student submissions will appear here for grading and feedback."
            />
          ) : (
            submissions.map((subm) => (
              <Card key={subm.id} className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold text-white/95">
                      {subm.student_name}
                    </span>
                    <p className="text-[11px] text-white/40 truncate">{subm.assignment_title}</p>
                  </div>
                  <Badge variant={subm.status === 'graded' ? 'success' : 'warning'}>
                    {subm.status.toUpperCase()}
                  </Badge>
                </div>

                <p className="text-xs text-white/65 line-clamp-2">
                  {subm.content}
                </p>

                {subm.score !== undefined && (
                  <div className="p-2.5 rounded-[8px] bg-emerald-500/[0.08] border border-emerald-500/[0.2] text-xs text-emerald-400">
                    <strong>Score: {subm.score}/100</strong>
                    {subm.feedback && <p className="mt-1 text-[11px] text-white/70">{subm.feedback}</p>}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                  <span className="text-[10px] text-white/40">
                    Submitted {new Date(subm.submitted_at).toLocaleDateString()}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setActiveSubmission(subm);
                      setScoreInput(subm.score ? subm.score.toString() : '90');
                      setFeedbackInput(subm.feedback || '');
                      setGradeModalOpen(true);
                    }}
                    className="h-7 text-xs"
                  >
                    {subm.status === 'graded' ? 'Review / Edit Grade' : 'Grade Submission'}
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Create Assignment Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Cohort Assignment"
        description="Assign technical homework or coding exercises with due dates."
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <Input
            label="Assignment Title"
            placeholder="e.g. Assignment 2: Thread-Safe LRU Cache in Java"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-white/70">
                Assigned Batch
              </label>
              <select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className="w-full px-3 py-1.5 text-sm rounded-[8px] bg-[#191919] border border-white/[0.1] text-white focus:outline-none focus:border-[#0075de]"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-white/70">
                Subject
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full px-3 py-1.5 text-sm rounded-[8px] bg-[#191919] border border-white/[0.1] text-white focus:outline-none focus:border-[#0075de]"
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
            label="Submission Deadline"
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />

          <Textarea
            label="Detailed Assignment Requirements"
            placeholder="Describe problem statement, input/output constraints, and evaluation criteria..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />

          <div className="flex justify-end gap-2 pt-3">
            <Button variant="ghost" size="sm" type="button" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Publish Assignment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Grade Submission Slide-over Sheet */}
      <Sheet open={gradeModalOpen} onOpenChange={(open) => !open && setGradeModalOpen(false)}>
        <SheetContent side="right" className="sm:max-w-xl flex flex-col h-full overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Grade Student Submission</SheetTitle>
            <SheetDescription>Evaluating submission from {activeSubmission?.student_name}</SheetDescription>
          </SheetHeader>

          <form onSubmit={handleGradeSubmission} className="space-y-4 mt-4 flex-1 flex flex-col">
            <div className="p-3.5 rounded-[8px] bg-[#191919] border border-white/[0.08] space-y-2 text-xs">
              <span className="font-semibold text-white/40 uppercase tracking-wider block text-[10px]">
                Student Solution Text:
              </span>
              <p className="text-white/80 whitespace-pre-line leading-relaxed font-sans">
                {activeSubmission?.content}
              </p>
              {activeSubmission?.code_solution && (
                <div className="mt-2 space-y-1">
                  <span className="font-semibold text-white/40 uppercase tracking-wider block text-[10px]">
                    Submitted Code:
                  </span>
                  <pre className="p-3 rounded-[6px] bg-[#141414] text-[#62aef0] font-mono text-[11px] overflow-x-auto border border-white/[0.06] max-h-60">
                    <code>{activeSubmission.code_solution}</code>
                  </pre>
                </div>
              )}
            </div>

            <Input
              label="Score (out of 100)"
              type="number"
              min="0"
              max="100"
              value={scoreInput}
              onChange={(e) => setScoreInput(e.target.value)}
              required
            />

            <Textarea
              label="Instructor Feedback & Critique"
              placeholder="Constructive feedback, edge cases missed, architecture tips..."
              value={feedbackInput}
              onChange={(e) => setFeedbackInput(e.target.value)}
              rows={4}
              required
            />

            <div className="flex justify-end gap-2 pt-4 mt-auto border-t border-white/[0.06]">
              <Button variant="ghost" size="sm" type="button" onClick={() => setGradeModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Submit Grade
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
