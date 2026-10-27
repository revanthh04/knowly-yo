import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  Search,
  FolderPlus,
  FileText,
  Layers,
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

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Subject Modal State
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const [subjectDesc, setSubjectDesc] = useState('');
  const [subjectColor, setSubjectColor] = useState('#0075de');

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.06]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white/95">
            {isTeacher ? 'Technical Knowledge Hub' : 'Published Knowledge Library'}
          </h1>
          <p className="text-xs sm:text-sm text-white/50 mt-1 leading-relaxed">
            Organized hierarchically: Subjects → Chapters → Topics → Classroom Scripts & Snippets.
          </p>
        </div>

        {isTeacher && (
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSubjectModalOpen(true)}
              className="gap-1.5"
            >
              <FolderPlus className="w-4 h-4 text-[#62aef0]" />
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
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search notes across titles, code snippets, explanations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-[8px] bg-[#202020] border border-white/[0.08] text-white placeholder-white/35 focus:outline-none focus:border-[#0075de]"
          />
        </div>

        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                selectedTag === null
                  ? 'bg-[#0075de] text-white'
                  : 'bg-[#202020] text-white/60 hover:text-white border border-white/[0.06]'
              }`}
            >
              All Tags
            </button>
            {allTags.slice(0, 5).map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-[#0075de] text-white'
                    : 'bg-[#202020] text-white/60 hover:text-white border border-white/[0.06]'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/[0.06]">
        <button
          onClick={() => handleSelectSubject(undefined)}
          className={`px-3 py-1.5 rounded-[8px] text-xs font-medium transition-colors shrink-0 cursor-pointer ${
            !selectedSubjectId
              ? 'bg-[#252525] text-white border border-white/[0.1]'
              : 'text-white/50 hover:text-white'
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
              className={`flex items-center gap-2 px-3 py-1.5 rounded-[8px] text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-[#0075de] text-white'
                  : 'bg-[#202020] text-white/70 hover:text-white border border-white/[0.06]'
              }`}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: sub.color || '#0075de' }}
              />
              <span>{sub.name}</span>
              <span className="text-[10px] opacity-70">({subNotesCount})</span>
            </button>
          );
        })}
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Chapters Tree (1 col) */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
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
                className="h-6 text-xs px-2 gap-1 text-[#62aef0]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Chapter</span>
              </Button>
            )}
          </div>

          <div className="bg-[#202020] rounded-[12px] border border-white/[0.08] p-2 space-y-1">
            {chapters.length === 0 ? (
              <p className="text-xs text-white/40 p-4 text-center">No chapters found for this subject.</p>
            ) : (
              chapters.map((chap) => {
                const chapNotes = store.notes.filter((n) => n.chapter_id === chap.id);
                return (
                  <div
                    key={chap.id}
                    className="p-2.5 rounded-[6px] hover:bg-[#252525] transition-colors flex items-center justify-between group"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-white/85 truncate">
                        {chap.title}
                      </p>
                      <span className="text-[10px] text-white/40">{chapNotes.length} notes</span>
                    </div>
                    {isTeacher && (
                      <button
                        onClick={() => handleCreateNewNote(chap.subject_id, chap.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded text-white/40 hover:text-[#0075de] transition-opacity"
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
            <span className="text-xs font-medium text-white/40">
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
                        <span className="text-[11px] font-medium text-[#62aef0] truncate">
                          {sub?.name || 'Technical'}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {note.is_published ? (
                            <Badge variant="success" className="text-[10px]">Published</Badge>
                          ) : (
                            <Badge variant="neutral" className="text-[10px]">Private Draft</Badge>
                          )}
                          <Badge variant={note.status === 'ready' ? 'blue' : 'warning'} className="text-[10px]">
                            {note.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-semibold text-white/95 hover:text-[#62aef0] transition-colors line-clamp-2">
                        {note.title}
                      </h3>

                      {chap && (
                        <p className="text-xs text-white/40 mt-1 truncate">
                          Chapter: {chap.title}
                        </p>
                      )}

                      {/* Content Preview Snippet */}
                      <p className="text-xs text-white/50 mt-2 line-clamp-3 leading-relaxed">
                        {note.content_text || 'Structured classroom teaching note containing concepts, code snippets, common pitfalls, and interview exercises.'}
                      </p>
                    </div>

                    {/* Bottom Metadata & Tags */}
                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-white/40">
                      <div className="flex items-center gap-1 flex-wrap">
                        {note.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="px-1.5 py-0.2 rounded bg-white/[0.06] text-white/50 text-[10px]"
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
            <label className="block text-xs font-medium text-white/70">
              Badge Accent Color
            </label>
            <div className="flex items-center gap-3">
              {['#0075de', '#ffb110', '#f64932', '#62aef0', '#e89d01', '#10b981'].map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setSubjectColor(c)}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    subjectColor === c ? 'ring-2 ring-offset-2 ring-white scale-110' : ''
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
            <label className="block text-xs font-medium text-white/70">
              Target Subject
            </label>
            <select
              value={targetSubjectForChapter}
              onChange={(e) => setTargetSubjectForChapter(e.target.value)}
              className="w-full px-3 py-1.5 text-sm rounded-[8px] bg-[#191919] border border-white/[0.1] text-white focus:outline-none focus:border-[#0075de]"
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
