import { useState } from 'react';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  Upload,
  Send,
  Award
} from 'lucide-react';
import { useAppStore } from '@/hooks/useAppStore';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { toast } from '@/components/ui/Toast';
import { Assignment } from '@/types';

export function StudentAssignmentsPage() {
  const { store } = useAppStore();
  const assignments = store.getAssignments();
  const submissions = store.getSubmissions();

  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [codeSolution, setCodeSolution] = useState('');

  const handleOpenSubmit = (asg: Assignment) => {
    setActiveAssignment(asg);
    const existing = submissions.find((s) => s.assignment_id === asg.id);
    setSubmissionContent(existing?.content || '');
    setCodeSolution(existing?.code_solution || '');
    setSubmitModalOpen(true);
  };

  const handleSubmitSolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignment || !submissionContent.trim()) {
      toast.error('Missing Content', 'Please provide a written explanation or solution summary.');
      return;
    }

    store.submitAssignment(activeAssignment.id, submissionContent, codeSolution);
    toast.success('Assignment Submitted', 'Your submission has been delivered to your instructor.');
    setSubmitModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          My Cohort Assignments
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review assignments due, upload code solutions, and track instructor reviews.
        </p>
      </div>

      {assignments.length === 0 ? (
        <EmptyState
          icon={FileCheck2}
          title="No assignments due"
          description="Your instructors have not published any pending assignments for your batches."
        />
      ) : (
        <div className="space-y-4">
          {assignments.map((asg) => {
            const submission = submissions.find((s) => s.assignment_id === asg.id);
            const isSubmitted = !!submission;
            const isGraded = submission?.status === 'graded';

            return (
              <Card key={asg.id} className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {asg.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span className="text-amber-500 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Due: {new Date(asg.due_at).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>Max Score: {asg.max_score} pts</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isGraded ? (
                      <Badge variant="success" className="text-xs py-1 px-2.5">
                        Graded ({submission.score}/{asg.max_score})
                      </Badge>
                    ) : isSubmitted ? (
                      <Badge variant="purple" className="text-xs py-1 px-2.5">
                        Submitted (Pending Review)
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="text-xs py-1 px-2.5">
                        Action Required
                      </Badge>
                    )}

                    <Button
                      variant={isSubmitted ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => handleOpenSubmit(asg)}
                      className="text-xs"
                    >
                      {isSubmitted ? 'View / Resubmit' : 'Submit Solution'}
                    </Button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#1a1e2b] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  {asg.description}
                </p>

                {/* Graded Feedback Card */}
                {isGraded && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                      <Award className="w-4 h-4" />
                      <span>Instructor Review & Grade: {submission.score} / {asg.max_score}</span>
                    </div>
                    {submission.feedback && (
                      <p className="text-slate-700 dark:text-slate-200 pt-1 leading-relaxed">
                        {submission.feedback}
                      </p>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Submission Modal */}
      <Modal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        title={`Submit Solution: ${activeAssignment?.title}`}
        description="Provide your written analysis, algorithmic complexity, and code snippet."
      >
        <form onSubmit={handleSubmitSolution} className="space-y-4">
          <Textarea
            label="Solution Explanation & Approach"
            placeholder="Explain your approach, assumptions made, and time/space complexity..."
            value={submissionContent}
            onChange={(e) => setSubmissionContent(e.target.value)}
            rows={4}
            required
          />

          <Textarea
            label="Source Code (Java, SQL, React, etc.)"
            placeholder="Paste your source code implementation..."
            value={codeSolution}
            onChange={(e) => setCodeSolution(e.target.value)}
            rows={5}
          />

          <div className="flex justify-end gap-2 pt-3">
            <Button variant="ghost" size="sm" type="button" onClick={() => setSubmitModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Turn In Assignment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
