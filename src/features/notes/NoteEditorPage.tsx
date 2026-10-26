import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import {
  Save,
  ArrowLeft,
  Share2,
  Printer,
  Maximize2,
  Minimize2,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  Code,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Strikethrough,
  Copy,
  Check,
  Eye,
  FileText
} from 'lucide-react';
import { useAppStore } from '@/hooks/useAppStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/components/ui/Toast';

const TEACHING_NOTE_TEMPLATE = `
<h1>1. Concept: What is it?</h1>
<p>Provide a concise, 1-2 sentence definition of the concept.</p>

<h2>2. Simple Explanation for Students</h2>
<p>Explain using a real-world intuition or everyday analogy that any beginner can visualize.</p>

<h2>3. Syntax & Structure</h2>
<pre><code class="language-java">// Basic syntax skeleton
public void demonstrate() {
    // core statements
}</code></pre>

<h2>4. Working Production Example</h2>
<pre><code class="language-java">// Complete working demonstration
public class Demo {
    public static void main(String[] args) {
        System.out.println("Executing clean code example");
    }
}</code></pre>

<h2>5. Expected Output</h2>
<pre><code>Executing clean code example</code></pre>

<h2>6. Common Student Mistakes & Traps</h2>
<ul data-type="taskList">
  <li data-checked="false"><label><input type="checkbox"><span></span></label><div>Trap 1: Confusing compile-time checks with runtime behavior.</div></li>
  <li data-checked="false"><label><input type="checkbox"><span></span></label><div>Trap 2: Null pointer hazards or missing boundary checks.</div></li>
</ul>

<h2>7. Interview Questions & Key Answers</h2>
<p><strong>Q:</strong> What is the time and space complexity of this approach?<br/><strong>A:</strong> Time: O(N), Space: O(1).</p>

<h2>8. Practice Exercises for Class</h2>
<ol>
  <li>Implement the edge-case handling for empty inputs.</li>
  <li>Write 2 unit tests verifying idempotency.</li>
</ol>

<h2>9. Personal Understanding & Notes</h2>
<p>Notes on how the JVM, compiler, or database handles this internally.</p>

<h2>10. Revision Takeaways</h2>
<p>Key points to remember during fast 5-minute revision.</p>
`;

export function NoteEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { store, currentUser, isTeacher } = useAppStore();

  const note = id ? store.getNote(id) : undefined;

  const [title, setTitle] = useState(note?.title || 'Untitled Note');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | 'failed'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>(
    note ? new Date(note.updated_at).toLocaleTimeString() : ''
  );

  const [presentationMode, setPresentationMode] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [selectedBatches, setSelectedBatches] = useState<string[]>(
    note?.published_to_batches || []
  );
  const [isPublishedState, setIsPublishedState] = useState<boolean>(note?.is_published || false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const subject = note ? store.getSubject(note.subject_id) : undefined;
  const chapter = note ? store.chapters.find((c) => c.id === note.chapter_id) : undefined;
  const batches = store.getBatches();

  // Initialize Tiptap Editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false // we handle custom code block or default
      }),
      Placeholder.configure({
        placeholder: 'Write your classroom teaching script, code snippets, and explanations...'
      }),
      TaskList,
      TaskItem.configure({
        nested: true
      })
    ],
    content: note?.content_json ? parseContent(note.content_json) : '',
    editable: isTeacher,
    onUpdate: () => {
      setSaveStatus('unsaved');
      scheduleAutosave();
    }
  });

  function parseContent(raw: string) {
    try {
      if (raw.startsWith('{') && raw.endsWith('}')) {
        return JSON.parse(raw);
      }
      return raw;
    } catch {
      return raw;
    }
  }

  // Autosave logic (debounced 1200ms)
  const performSave = useCallback(() => {
    if (!id || !editor) return;
    setSaveStatus('saving');

    try {
      const jsonContent = JSON.stringify(editor.getJSON());
      const textContent = editor.getText();

      store.saveNote({
        id,
        title,
        subject_id: note?.subject_id || 'sub-java',
        chapter_id: note?.chapter_id || 'chap-java-01',
        content_json: jsonContent,
        content_text: textContent,
        is_published: isPublishedState,
        published_to_batches: selectedBatches
      });

      setSaveStatus('saved');
      setLastSavedTime(new Date().toLocaleTimeString());
    } catch (e) {
      console.error('Autosave error:', e);
      setSaveStatus('failed');
      toast.error('Save Failed', 'Could not save note to persistent storage.');
    }
  }, [id, editor, title, note, isPublishedState, selectedBatches, store]);

  const scheduleAutosave = useCallback(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      performSave();
    }, 1200);
  }, [performSave]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    setSaveStatus('unsaved');
    scheduleAutosave();
  };

  const handleInsertTemplate = () => {
    if (!editor) return;
    if (editor.getText().trim().length > 10) {
      if (!window.confirm('Insert the 10-point teaching script template? This will append the template.')) {
        return;
      }
    }
    editor.commands.insertContent(TEACHING_NOTE_TEMPLATE);
    scheduleAutosave();
    toast.success('Template Inserted', 'Added structured 10-point classroom teaching format.');
  };

  const handleSavePublishSettings = () => {
    if (!id) return;
    store.publishNote(id, isPublishedState, selectedBatches);
    toast.success(
      isPublishedState ? 'Note Published' : 'Note Made Private',
      isPublishedState
        ? `Visible to students in ${selectedBatches.length} batch(es)`
        : 'Note is now a private teacher script'
    );
    setPublishModalOpen(false);
  };

  const handleDeleteNote = () => {
    if (!id) return;
    store.deleteNote(id);
    toast.success('Note Deleted', 'The note has been removed.');
    navigate('/knowledge');
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const handleCopyCodeSnippet = () => {
    if (!editor) return;
    const text = editor.getText();
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    toast.info('Copied Note Text to Clipboard');
  };

  if (!note) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold">Note not found</h2>
        <p className="text-xs text-slate-400">The note may have been deleted or requires authorization.</p>
        <Button variant="primary" size="sm" onClick={() => navigate('/knowledge')}>
          Return to Knowledge Hub
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${presentationMode ? 'fixed inset-0 z-50 bg-white dark:bg-[#0c0e14] p-8 overflow-y-auto' : ''}`}>
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800 no-print">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/knowledge')}
            className="h-8 px-2 text-xs"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Library</span>
          </Button>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-medium text-slate-600 dark:text-slate-300">
              {subject?.name || 'Subject'}
            </span>
            <span>/</span>
            <span className="truncate max-w-[200px]">{chapter?.title || 'Chapter'}</span>
          </div>
        </div>

        {/* Status Indicators & Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Autosave Status Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-[#1a1e2b] text-slate-500 border border-slate-200/60 dark:border-slate-800">
            {saveStatus === 'saving' && (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Saving...</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-slate-600 dark:text-slate-400">
                  Saved {lastSavedTime && `at ${lastSavedTime}`}
                </span>
              </>
            )}
            {saveStatus === 'unsaved' && (
              <>
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Unsaved changes</span>
              </>
            )}
            {saveStatus === 'failed' && (
              <>
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-rose-500 font-semibold">Save failed</span>
              </>
            )}
          </div>

          {/* Teacher Template Inserter */}
          {isTeacher && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleInsertTemplate}
              className="h-8 text-xs gap-1.5 text-violet-600 dark:text-violet-400 border-violet-500/30"
              title="Insert 10-point structured teaching template"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Teaching Template</span>
            </Button>
          )}

          {/* Distraction-Free Presentation Mode */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPresentationMode(!presentationMode)}
            className="h-8 text-xs gap-1.5"
            title="Toggle Fullscreen Teaching Presentation Mode"
          >
            {presentationMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">
              {presentationMode ? 'Exit Mode' : 'Present'}
            </span>
          </Button>

          {/* PDF Export */}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrintPDF}
            className="h-8 text-xs gap-1.5"
            title="Export to PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PDF</span>
          </Button>

          {/* Teacher Sharing & Publishing */}
          {isTeacher && (
            <>
              <Button
                variant={isPublishedState ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setPublishModalOpen(true)}
                className="h-8 text-xs gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{isPublishedState ? 'Published' : 'Publish'}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteConfirmOpen(true)}
                className="h-8 w-8 p-0 text-slate-400 hover:text-rose-500"
                title="Delete note"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Note Header Title Input */}
      <div className="space-y-2">
        {isTeacher ? (
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Note Title..."
            className="w-full text-2xl sm:text-3xl font-bold bg-transparent border-none text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-0 px-0"
          />
        ) : (
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            {note.title}
          </h1>
        )}

        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
          <Badge variant={isPublishedState ? 'success' : 'neutral'}>
            {isPublishedState ? 'Published to Students' : 'Private Teacher Script'}
          </Badge>
          <span>•</span>
          <span>Last edited: {new Date(note.updated_at).toLocaleDateString()}</span>
          {note.tags.map((t) => (
            <span key={t} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px]">
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* Editor Formatting Toolbar (visible for Teacher when not in presentation) */}
      {isTeacher && editor && !presentationMode && (
        <div className="flex items-center gap-1 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141721] overflow-x-auto no-print">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-1.5 rounded-lg text-xs font-semibold ${
              editor.isActive('heading', { level: 1 })
                ? 'bg-violet-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-1.5 rounded-lg text-xs font-semibold ${
              editor.isActive('heading', { level: 2 })
                ? 'bg-violet-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-1.5 rounded-lg text-xs font-semibold ${
              editor.isActive('heading', { level: 3 })
                ? 'bg-violet-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded-lg text-xs font-semibold ${
              editor.isActive('bold')
                ? 'bg-violet-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded-lg text-xs font-semibold ${
              editor.isActive('italic')
                ? 'bg-violet-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1.5 rounded-lg text-xs font-semibold ${
              editor.isActive('strike')
                ? 'bg-violet-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-1.5 rounded-lg text-xs font-semibold ${
              editor.isActive('codeBlock')
                ? 'bg-violet-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Code Block"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded-lg text-xs font-semibold ${
              editor.isActive('bulletList')
                ? 'bg-violet-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded-lg text-xs font-semibold ${
              editor.isActive('orderedList')
                ? 'bg-violet-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={`p-1.5 rounded-lg text-xs font-semibold ${
              editor.isActive('taskList')
                ? 'bg-violet-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Task Checklist"
          >
            <ListTodo className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded-lg text-xs font-semibold ${
              editor.isActive('blockquote')
                ? 'bg-violet-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

          <button
            onClick={handleCopyCodeSnippet}
            className="p-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Copy Note Text"
          >
            {copiedCode ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Main Note Content Surface */}
      <div
        className={`rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#141721] p-6 sm:p-10 shadow-sm min-h-[500px] transition-all ${
          presentationMode ? 'max-w-4xl mx-auto shadow-2xl text-lg' : ''
        }`}
      >
        <EditorContent editor={editor} />
      </div>

      {/* Publish & Batch Access Modal */}
      <Modal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        title="Publishing & Batch Access"
        description="Select which student batches have access to view this note."
      >
        <div className="space-y-4">
          <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1a1e2b] cursor-pointer">
            <input
              type="checkbox"
              checked={isPublishedState}
              onChange={(e) => setIsPublishedState(e.target.checked)}
              className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500"
            />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Publish Note to Students
              </p>
              <p className="text-xs text-slate-400">
                When unchecked, this note remains a private teacher script visible only to you.
              </p>
            </div>
          </label>

          {isPublishedState && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Authorized Student Batches
              </label>
              <div className="space-y-1.5">
                {batches.map((b) => {
                  const isChecked = selectedBatches.includes(b.id);
                  return (
                    <label
                      key={b.id}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBatches([...selectedBatches, b.id]);
                            } else {
                              setSelectedBatches(selectedBatches.filter((item) => item !== b.id));
                            }
                          }}
                          className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500"
                        />
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {b.name}
                        </span>
                      </div>
                      <Badge variant="purple" className="text-[10px]">
                        {b.code}
                      </Badge>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3">
            <Button variant="ghost" size="sm" onClick={() => setPublishModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSavePublishSettings}>
              Save Permissions
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete Teaching Note?"
        description="This action cannot be undone. All content in this script will be permanently removed."
      >
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" size="sm" onClick={() => setDeleteConfirmOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleDeleteNote}>
            Confirm Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
