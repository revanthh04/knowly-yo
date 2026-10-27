import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  HelpCircle,
  MessageSquare,
  Plus,
  Search,
  Check,
  User,
  ShieldCheck
} from 'lucide-react';
import { useAppStore } from '@/hooks/useAppStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { toast } from '@/components/ui/Toast';

export function QuestionBankPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { store, currentUser, isTeacher } = useAppStore();

  const questions = store.getQuestions();
  const subjects = store.getSubjects();

  const selectedQId = searchParams.get('q');
  const shouldOpenAsk = searchParams.get('ask') === 'true';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'answered' | 'resolved'>('all');
  const [askModalOpen, setAskModalOpen] = useState(shouldOpenAsk);

  // New question form state
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newSubjectId, setNewSubjectId] = useState(subjects[0]?.id || '');
  const [newSnippet, setNewSnippet] = useState('');
  const [newTagsText, setNewTagsText] = useState('');

  // Answer response state
  const [answerBody, setAnswerBody] = useState('');

  const activeQuestion = selectedQId
    ? questions.find((q) => q.id === selectedQId) || questions[0]
    : questions[0];

  const activeAnswers = activeQuestion ? store.getAnswers(activeQuestion.id) : [];

  const filteredQuestions = questions.filter((q) => {
    if (statusFilter !== 'all' && q.status !== statusFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        q.title.toLowerCase().includes(query) ||
        q.body.toLowerCase().includes(query) ||
        q.tags.some((t) => t.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) {
      toast.error('Missing Required Fields', 'Please enter a question title and body.');
      return;
    }

    const tags = newTagsText
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const created = store.createQuestion({
      title: newTitle,
      body: newBody,
      subject_id: newSubjectId,
      code_snippet: newSnippet || undefined,
      tags: tags.length > 0 ? tags : ['general']
    });

    toast.success('Question Posted', 'Your question has been added to the knowledge bank.');
    setAskModalOpen(false);
    setNewTitle('');
    setNewBody('');
    setNewSnippet('');
    setNewTagsText('');
    setSearchParams({ q: created.id });
  };

  const handlePostAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuestion || !answerBody.trim()) return;

    store.addAnswer(activeQuestion.id, answerBody);
    toast.success('Answer Submitted', 'Your response has been published.');
    setAnswerBody('');
  };

  const handleAcceptAnswer = (answerId: string) => {
    if (!activeQuestion) return;
    store.acceptAnswer(activeQuestion.id, answerId);
    toast.success('Accepted Answer Verified', 'Marked this explanation as the verified solution.');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.06]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white/95">
            Student Technical Question Bank
          </h1>
          <p className="text-xs sm:text-sm text-white/50 mt-1 leading-relaxed">
            Collaborative Q&A with teacher verification, code snippets, and accepted solutions.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setAskModalOpen(true)}
          className="gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ask Question</span>
        </Button>
      </div>

      {/* Main Q&A Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Question Search & List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Search & Status Filters */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search questions or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-[8px] bg-[#202020] border border-white/[0.08] text-white focus:outline-none focus:border-[#0075de]"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {(['all', 'open', 'answered', 'resolved'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-[6px] text-xs font-medium capitalize transition-colors shrink-0 cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#0075de] text-white'
                    : 'bg-[#202020] text-white/60 hover:text-white border border-white/[0.06]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
            {filteredQuestions.length === 0 ? (
              <EmptyState
                icon={HelpCircle}
                title="No questions found"
                description="No questions match the current filter or query."
              />
            ) : (
              filteredQuestions.map((q) => {
                const isSelected = activeQuestion?.id === q.id;
                const sub = subjects.find((s) => s.id === q.subject_id);

                return (
                  <div
                    key={q.id}
                    onClick={() => setSearchParams({ q: q.id })}
                    className={`p-3.5 rounded-[10px] border transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-[#0075de] bg-[#0075de]/[0.08]'
                        : 'border-white/[0.08] bg-[#202020] hover:border-white/[0.16]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-medium text-[#62aef0] truncate">
                        {sub?.name || 'Technical'}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        {q.has_accepted_answer && (
                          <Badge variant="success" className="text-[9px] py-0 px-1">
                            ✓ Solved
                          </Badge>
                        )}
                        <Badge
                          variant={
                            q.status === 'resolved'
                              ? 'success'
                              : q.status === 'answered'
                              ? 'blue'
                              : 'warning'
                          }
                          className="text-[9px] py-0 px-1"
                        >
                          {q.status}
                        </Badge>
                      </div>
                    </div>

                    <h4 className="text-xs font-semibold text-white/90 line-clamp-2">
                      {q.title}
                    </h4>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.06] text-[10px] text-white/40">
                      <span>By {q.author_name}</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 text-white/40" />
                        {q.answers_count}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Question Details & Answers (7 cols) */}
        <div className="lg:col-span-7">
          {activeQuestion ? (
            <Card className="space-y-5">
              {/* Question Header */}
              <div className="space-y-3 pb-4 border-b border-white/[0.06]">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="blue" className="text-xs">
                    {subjects.find((s) => s.id === activeQuestion.subject_id)?.name || 'Subject'}
                  </Badge>
                  <span className="text-xs text-white/40">
                    Asked {new Date(activeQuestion.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h2 className="text-base font-semibold text-white/95 leading-snug">
                  {activeQuestion.title}
                </h2>

                <div className="flex items-center gap-2 text-xs text-white/50">
                  <User className="w-3.5 h-3.5 text-white/40" />
                  <span>
                    Asked by <strong className="text-white/80">{activeQuestion.author_name}</strong> (
                    {activeQuestion.author_role.toUpperCase()})
                  </span>
                </div>

                {/* Question Body */}
                <p className="text-xs sm:text-sm text-white/75 whitespace-pre-line leading-relaxed">
                  {activeQuestion.body}
                </p>

                {/* Code Snippet if present */}
                {activeQuestion.code_snippet && (
                  <div className="rounded-[8px] bg-[#141414] p-3 border border-white/[0.08] overflow-x-auto">
                    <pre className="text-xs font-mono text-[#62aef0] leading-relaxed">
                      <code>{activeQuestion.code_snippet}</code>
                    </pre>
                  </div>
                )}

                {/* Tags */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {activeQuestion.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-full text-[10px] bg-white/[0.06] text-white/60 font-medium"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Answers Section */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
                  Answers & Explanations ({activeAnswers.length})
                </h3>

                {activeAnswers.length === 0 ? (
                  <p className="text-xs text-white/40 py-4 text-center">
                    No answers submitted yet. Be the first to explain!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {activeAnswers.map((ans) => {
                      const isTeacherAnswer = ans.author_role === 'teacher';

                      return (
                        <div
                          key={ans.id}
                          className={`p-3.5 rounded-[10px] border text-xs space-y-2 transition-colors ${
                            ans.is_accepted
                              ? 'border-emerald-500/[0.3] bg-emerald-500/[0.06]'
                              : 'border-white/[0.06] bg-[#252525]/40'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white/90">
                                {ans.author_name}
                              </span>
                              {isTeacherAnswer && (
                                <Badge variant="blue" className="text-[9px] gap-1">
                                  <ShieldCheck className="w-3 h-3" />
                                  <span>Instructor</span>
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-white/40">
                                {new Date(ans.created_at).toLocaleDateString()}
                              </span>
                              {ans.is_accepted ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Accepted Solution</span>
                                </span>
                              ) : (
                                (isTeacher || activeQuestion.author_id === currentUser.id) && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleAcceptAnswer(ans.id)}
                                    className="h-6 text-[10px] px-2 text-emerald-400"
                                  >
                                    Accept Solution
                                  </Button>
                                )
                              )}
                            </div>
                          </div>

                          <p className="text-white/70 leading-relaxed whitespace-pre-line">
                            {ans.body}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Post Answer Box */}
                <form onSubmit={handlePostAnswer} className="pt-3 border-t border-white/[0.06] space-y-3">
                  <Textarea
                    label="Submit Your Explanation / Solution"
                    placeholder="Provide a step-by-step breakdown or code snippet that clarifies the doubt..."
                    value={answerBody}
                    onChange={(e) => setAnswerBody(e.target.value)}
                    rows={3}
                    required
                  />
                  <div className="flex justify-end">
                    <Button variant="primary" size="sm" type="submit">
                      Post Answer
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          ) : (
            <EmptyState
              icon={HelpCircle}
              title="Select a question"
              description="Choose a question from the left panel to read responses or post an explanation."
            />
          )}
        </div>
      </div>

      {/* Ask Question Modal */}
      <Modal
        isOpen={askModalOpen}
        onClose={() => setAskModalOpen(false)}
        title="Ask a Technical Question"
        description="Share a problem you encountered while coding or learning."
      >
        <form onSubmit={handleCreateQuestion} className="space-y-4">
          <Input
            label="Question Title (Summary)"
            placeholder="e.g. Why does method hiding happen with static methods in Java?"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-white/70">
              Technology Subject
            </label>
            <select
              value={newSubjectId}
              onChange={(e) => setNewSubjectId(e.target.value)}
              className="w-full px-3 py-1.5 text-sm rounded-[8px] bg-[#191919] border border-white/[0.1] text-white focus:outline-none focus:border-[#0075de]"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <Textarea
            label="Detailed Explanation / Context"
            placeholder="Describe what you tried, what behavior you observed, and what you expected..."
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            rows={4}
            required
          />

          <Textarea
            label="Relevant Code Snippet (Optional)"
            placeholder="Paste minimal reproducible snippet here..."
            value={newSnippet}
            onChange={(e) => setNewSnippet(e.target.value)}
            rows={3}
          />

          <Input
            label="Tags (Comma separated)"
            placeholder="e.g. java, oop, polymorphism, static"
            value={newTagsText}
            onChange={(e) => setNewTagsText(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-3">
            <Button variant="ghost" size="sm" type="button" onClick={() => setAskModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Post to Question Bank
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
