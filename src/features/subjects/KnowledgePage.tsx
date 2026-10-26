import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  FolderPlus,
  FileText,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  Trash2,
  Edit2,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAppStore } from '@/hooks/useAppStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { toast } from '@/components/ui/Toast';

export function KnowledgePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { store, isTeacher } = useAppStore();

  const selectedSubjectId = searchParams.get('subject') || undefined;
  const isCreatingNew = searchParams.get('new') === 'true';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Subject Modal State
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const [subjectDesc, setSubjectDesc] = useState('');
  const [subjectColor, setSubjectColor] = useState('#8b5cf6');

  // Chapter Modal State
  const [chapterModalOpen, setChapterModalOpen] = useState(false);
  const [targetSubjectForChapter, setTargetSubjectForChapter] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');

  const subjects = store.getSubjects();
  const chapters = store.getChapters(selectedSubjectId);
  const notes = store.getNotes({
    subjectId: selectedSubjectId,
    search: searchQuery,
    tag: selectedTag || undefined
  });

  const allTags = Array.from(new Set(store.notes.flatMap((n) => n.tags)));

  const handleSelectSubject = (id?: string) => {
    if (id) {
      setSearchParams({ subject: id });
    } else {
      setSearchParams({});
    }
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) return;
    const newSub = store.createSubject({
      name: subjectName,
      description: subjectDesc,
      icon: 'BookOpen',
      color: subjectColor
    });
    toast.success('Subject Created', `Created workspace for ${newSub.name}`);
    setSubjectModalOpen(false);
    setSubjectName('');
    setSubjectDesc('');
    handleSelectSubject(newSub.id);
  };

  const handleCreateChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapterTitle.trim() || !targetSubjectForChapter) return;
    const existingChapters = store.getChapters(targetSubjectForChapter);
    const newChap = store.createChapter({
      subject_id: targetSubjectForChapter,
      title: chapterTitle,
      sort_order: existingChapters.length + 1
    });
    toast.success('Chapter Added', `Added chapter "${newChap.title}"`);
    setChapterModalOpen(false);
    setChapterTitle('');
  };

  const handleCreateNewNote = (subjectId?: string, chapterId?: string) => {
    const subId = subjectId || selectedSubjectId || subjects[0]?.id;
    if (!subId) {
      toast.error('No Subject Available', 'Please create a subject workspace first.');
      return;
    }
    const chaps = store.getChapters(subId);
    const chapId = chapterId || chaps[0]?.id;
    if (!chapId) {
      toast.error('No Chapters Found', 'Please add at least one chapter to this subject before creating notes.');
      return;
    }

    const newNote = store.saveNote({
      title: 'Untitled Teaching Script',
      subject_id: subId,
      chapter_id: chapId,
      status: 'draft',
      is_published: false,
      tags: ['draft'],
      content_json: JSON.stringify({
        type: 'doc',
        content: [
          { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Untitled Note' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Start writing your lesson plan or explanation here...' }] }
        ]
      })
    });
    navigate(`/notes/${newNote.id}`);
  };

  const currentSubjectObj = subjects.find((s) => s.id === selectedSubjectId);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {isTeacher ? 'Technical Knowledge Hub' : 'Published Knowledge Library'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organized hierarchically: Subjects → Chapters → Topics → Classroom Scripts & Snippets.
          </p>
        </div>

        {isTeacher && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSubjectModalOpen(true)}
              className="gap-1.5"
            >
              <FolderPlus className="w-4 h-4 text-violet-500" />
              <span>New Subject</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleCreateNewNote()}
              className="gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Note</span>
            </Button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes across titles, code snippets, explanations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-white dark:bg-[#141721] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
          />
        </div>

        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                selectedTag === null
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-100 dark:bg-[#1a1e2b] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              All Tags
            </button>
            {allTags.slice(0, 5).map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  selectedTag === tag
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-100 dark:bg-[#1a1e2b] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-100 dark:border-slate-800/60">
        <button
          onClick={() => handleSelectSubject(undefined)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
            !selectedSubjectId
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          All Subjects ({subjects.length})
        </button>
        {subjects.map((sub) => {
          const isSelected = sub.id === selectedSubjectId;
          const subNotesCount = store.notes.filter((n) => n.subject_id === sub.id).length;
          return (
            <button
              key={sub.id}
              onClick={() => handleSelectSubject(sub.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-[#1a1e2b] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: sub.color || '#8b5cf6' }}
              />
              <span>{sub.name}</span>
              <span className="text-[10px] opacity-75">({subNotesCount})</span>
            </button>
          );
        })}
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Chapters Tree (1 col) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {currentSubjectObj ? currentSubjectObj.name : 'All Chapters'}
            </h3>
            {isTeacher && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTargetSubjectForChapter(selectedSubjectId || subjects[0]?.id || '');
                  setChapterModalOpen(true);
                }}
                className="h-7 text-xs px-2 gap-1 text-violet-500"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Chapter</span>
              </Button>
            )}
          </div>

          <div className="bg-white dark:bg-[#141721] rounded-xl border border-slate-200 dark:border-slate-800 p-2 space-y-1">
            {chapters.length === 0 ? (
              <p className="text-xs text-slate-400 p-4 text-center">No chapters found for this subject.</p>
            ) : (
              chapters.map((chap) => {
                const chapNotes = store.notes.filter((n) => n.chapter_id === chap.id);
                return (
                  <div
                    key={chap.id}
                    className="p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-between group"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {chap.title}
                      </p>
                      <span className="text-[10px] text-slate-400">{chapNotes.length} notes</span>
                    </div>
                    {isTeacher && (
                      <button
                        onClick={() => handleCreateNewNote(chap.subject_id, chap.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-400 hover:text-violet-500 transition-opacity"
                        title="Add note to chapter"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Notes Grid / Cards (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Showing {notes.length} note{notes.length !== 1 ? 's' : ''}
            </span>
          </div>

          {notes.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No notes found"
              description="No technical scripts match your current filters. Create a new structured note or adjust search keywords."
              actionLabel={isTeacher ? 'Create Note' : undefined}
              onAction={isTeacher ? () => handleCreateNewNote() : undefined}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.map((note) => {
                const sub = subjects.find((s) => s.id === note.subject_id);
                const chap = store.chapters.find((c) => c.id === note.chapter_id);

                return (
                  <Card
                    key={note.id}
                    hover
                    onClick={() => navigate(`/notes/${note.id}`)}
                    className="flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-semibold text-violet-600 dark:text-violet-400 truncate">
                          {sub?.name || 'Technical'}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {note.is_published ? (
                            <Badge variant="success" className="text-[10px]">Published</Badge>
                          ) : (
                            <Badge variant="neutral" className="text-[10px]">Private Draft</Badge>
                          )}
                          <Badge variant={note.status === 'ready' ? 'purple' : 'warning'} className="text-[10px]">
                            {note.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 hover:text-violet-500 transition-colors line-clamp-2">
                        {note.title}
                      </h3>

                      {chap && (
                        <p className="text-xs text-slate-400 mt-1 truncate">
                          Chapter: {chap.title}
                        </p>
                      )}

                      {/* Content Preview Snippet */}
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                        {note.content_text || 'Structured classroom teaching note containing concepts, code snippets, common pitfalls, and interview exercises.'}
                      </p>
                    </div>

                    {/* Bottom Metadata & Tags */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/70 flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {note.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px]"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                      <span>{new Date(note.updated_at).toLocaleDateString()}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* New Subject Modal */}
      <Modal
        isOpen={subjectModalOpen}
        onClose={() => setSubjectModalOpen(false)}
        title="Create Subject Workspace"
        description="Add a technical subject like Java, SQL, Rust, or Cloud Architecture."
      >
        <form onSubmit={handleCreateSubject} className="space-y-4">
          <Input
            label="Subject Name"
            placeholder="e.g. Distributed Systems & Kafka"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            required
          />
          <Textarea
            label="Description & Syllabus Focus"
            placeholder="Brief summary of what this technology workspace covers..."
            value={subjectDesc}
            onChange={(e) => setSubjectDesc(e.target.value)}
            rows={3}
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Badge Accent Color
            </label>
            <div className="flex items-center gap-3">
              {['#8b5cf6', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#6366f1'].map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setSubjectColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    subjectColor === c ? 'ring-2 ring-offset-2 ring-violet-500 scale-110' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3">
            <Button variant="ghost" size="sm" type="button" onClick={() => setSubjectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Create Subject
            </Button>
          </div>
        </form>
      </Modal>

      {/* New Chapter Modal */}
      <Modal
        isOpen={chapterModalOpen}
        onClose={() => setChapterModalOpen(false)}
        title="Add Chapter / Topic Module"
        description="Organize notes under a sequential chapter."
      >
        <form onSubmit={handleCreateChapter} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Target Subject
            </label>
            <select
              value={targetSubjectForChapter}
              onChange={(e) => setTargetSubjectForChapter(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-lg bg-white dark:bg-[#1a1e2b] border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-slate-100"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Chapter Title"
            placeholder="e.g. 05. Microservices & Circuit Breakers"
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2 pt-3">
            <Button variant="ghost" size="sm" type="button" onClick={() => setChapterModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Chapter
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
