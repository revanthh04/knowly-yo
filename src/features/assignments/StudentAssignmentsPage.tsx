import { useState } from 'react';
import {
  FileCheck2,
  Clock,
  Award
} from 'lucide-react';
import { useAppStore } from '@/hooks/useAppStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Input';
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
      <div className="pb-3 border-b border-white/[0.06]">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white/95">
          My Cohort Assignments
        </h1>
        <p className="text-xs sm:text-sm text-white/50 mt-1 leading-relaxed">
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
        <div className="space-y-3.5">
          {assignments.map((asg) => {
            const submission = submissions.find((s) => s.assignment_id === asg.id);
            const isSubmitted = !!submission;
            const isGraded = submission?.status === 'graded';

            return (
              <Card key={asg.id} className="space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white/95">
                      {asg.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-white/40 mt-1">
                      <span className="text-[#ffc940] font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Due: {new Date(asg.due_at).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>Max Score: {asg.max_score} pts</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isGraded ? (
                      <Badge variant="success" className="text-xs py-0.5 px-2.5">
                        Graded ({submission.score}/{asg.max_score})
                      </Badge>
                    ) : isSubmitted ? (
                      <Badge variant="blue" className="text-xs py-0.5 px-2.5">
                        Submitted (Pending Review)
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="text-xs py-0.5 px-2.5">
                        Action Required
                      </Badge>
                    )}

                    <Button
                      variant={isSubmitted ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={() => handleOpenSubmit(asg)}
                      className="text-xs"
                    >
                      {isSubmitted ? 'View / Resubmit' : 'Submit Solution'}
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-white/70 leading-relaxed bg-[#191919] p-3.5 rounded-[8px] border border-white/[0.06]">
                  {asg.description}
                </p>

                {/* Graded Feedback Card */}
                {isGraded && (
                  <div className="p-3.5 rounded-[8px] bg-emerald-500/[0.08] border border-emerald-500/[0.2] text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                      <Award className="w-4 h-4" />
                      <span>Instructor Review & Grade: {submission.score} / {asg.max_score}</span>
                    </div>
                    {submission.feedback && (
                      <p className="text-white/80 pt-1 leading-relaxed">
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
