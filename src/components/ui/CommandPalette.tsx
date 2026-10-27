import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, FileText, HelpCircle, Plus, Calendar, Compass, X } from 'lucide-react';
import { useAppStore } from '@/hooks/useAppStore';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { store, isTeacher } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const notes = store.getNotes({ search: query });
  const subjects = store.getSubjects().filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));
  const questions = store.getQuestions().filter((q) => q.title.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-xl rounded-[12px] bg-[#202020] border border-white/[0.08] overflow-hidden z-10 flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-white/[0.06]">
          <Search className="w-4 h-4 text-white/40 shrink-0 mr-3" />
          <input
            autoFocus
            type="text"
            placeholder="Search notes, subjects, questions, or type a command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white/90 placeholder-white/35 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-[6px] text-white/40 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-3 text-xs">
          {/* Quick Actions */}
          {!query && (
            <div>
              <div className="px-2.5 py-1 font-semibold text-white/30 uppercase tracking-wider text-[10px]">
                Quick Actions
              </div>
              <div className="space-y-0.5">
                {isTeacher && (
                  <button
                    onClick={() => handleSelect('/knowledge?new=true')}
                    className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-[6px] text-white/70 hover:bg-[#252525] hover:text-white transition-colors text-left"
                  >
                    <Plus className="w-4 h-4 text-[#0075de]" />
                    <span>Create New Teaching Note</span>
                  </button>
                )}
                <button
                  onClick={() => handleSelect('/learning')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-[6px] text-white/70 hover:bg-[#252525] hover:text-white transition-colors text-left"
                >
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span>View Learning Tracker & Mastery</span>
                </button>
                <button
                  onClick={() => handleSelect('/planner')}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-[6px] text-white/70 hover:bg-[#252525] hover:text-white transition-colors text-left"
                >
                  <Calendar className="w-4 h-4 text-[#62aef0]" />
                  <span>Open Teaching & Lesson Planner</span>
                </button>
              </div>
            </div>
          )}

          {/* Subjects */}
          {subjects.length > 0 && (
            <div>
              <div className="px-2.5 py-1 font-semibold text-white/30 uppercase tracking-wider text-[10px]">
                Subjects ({subjects.length})
              </div>
              <div className="space-y-0.5">
                {subjects.slice(0, 4).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelect(`/knowledge?subject=${s.id}`)}
                    className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-[6px] text-white/70 hover:bg-[#252525] hover:text-white transition-colors text-left"
                  >
                    <BookOpen className="w-4 h-4 text-[#0075de] shrink-0" />
                    <span className="font-medium truncate">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {notes.length > 0 && (
            <div>
              <div className="px-2.5 py-1 font-semibold text-white/30 uppercase tracking-wider text-[10px]">
                Notes ({notes.length})
              </div>
              <div className="space-y-0.5">
                {notes.slice(0, 6).map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleSelect(`/notes/${n.id}`)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[6px] text-white/70 hover:bg-[#252525] hover:text-white transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="w-4 h-4 text-white/40 shrink-0" />
                      <span className="truncate">{n.title}</span>
                    </div>
                    {n.is_published && (
                      <span className="shrink-0 text-[10px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                        Published
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Questions */}
          {questions.length > 0 && (
            <div>
              <div className="px-2.5 py-1 font-semibold text-white/30 uppercase tracking-wider text-[10px]">
                Question Bank ({questions.length})
              </div>
              <div className="space-y-0.5">
                {questions.slice(0, 4).map((q) => (
                  <button
                    key={q.id}
                    onClick={() => handleSelect(`/question-bank?q=${q.id}`)}
                    className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-[6px] text-white/70 hover:bg-[#252525] hover:text-white transition-colors text-left"
                  >
                    <HelpCircle className="w-4 h-4 text-[#ffb110] shrink-0" />
                    <span className="truncate">{q.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && subjects.length === 0 && notes.length === 0 && questions.length === 0 && (
            <div className="text-center py-8 text-white/40">
              No results found for &ldquo;<span className="text-white/80">{query}</span>&rdquo;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
