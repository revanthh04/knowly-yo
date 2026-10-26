import { useState } from 'react';
import {
  Users,
  Plus,
  Copy,
  Check,
  BookOpen,
  Calendar,
  Key,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useAppStore } from '@/hooks/useAppStore';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { toast } from '@/components/ui/Toast';

export function BatchesPage() {
  const { store, isTeacher } = useAppStore();
  const batches = store.getBatches();
  const notes = store.getNotes();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [batchName, setBatchName] = useState('');
  const [batchCode, setBatchCode] = useState('');
  const [batchDesc, setBatchDesc] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchName.trim() || !batchCode.trim()) {
      toast.error('Missing Info', 'Please provide a batch name and unique join code.');
      return;
    }

    const created = store.createBatch(batchName, batchCode, batchDesc);
    toast.success('Batch Created', `Created ${created.name} with code ${created.code}`);
    setCreateModalOpen(false);
    setBatchName('');
    setBatchCode('');
    setBatchDesc('');
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
    toast.info('Invite Code Copied', `Code: ${code}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Student Batches & Groups
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage cohort enrollment, invite codes, and granular access to published technical scripts.
          </p>
        </div>

        {isTeacher && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Batch</span>
          </Button>
        )}
      </div>

      {/* Batches Grid */}
      {batches.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No student batches created"
          description="Create a cohort (e.g. Java 2026 Batch) to invite students and share published modules."
          actionLabel={isTeacher ? 'Create Batch' : undefined}
          onAction={isTeacher ? () => setCreateModalOpen(true) : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {batches.map((batch) => {
            const batchNotes = notes.filter((n) => n.published_to_batches?.includes(batch.id));

            return (
              <Card key={batch.id} className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {batch.name}
                    </span>
                    <Badge variant="purple" className="text-xs font-mono">
                      {batch.code}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                    {batch.description || 'No description provided.'}
                  </p>

                  {/* Student Invite Code Box */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1a1e2b] border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Student Invite Code
                      </span>
                      <span className="text-sm font-mono font-bold text-violet-600 dark:text-violet-400">
                        {batch.code}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyCode(batch.code, batch.id)}
                      className="h-8 px-2.5 text-xs gap-1.5"
                    >
                      {copiedCodeId === batch.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>{batchNotes.length} published note(s)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{batch.student_count || 1} enrolled</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Batch Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Student Batch"
        description="Students can join using the unique invite code you assign."
      >
        <form onSubmit={handleCreateBatch} className="space-y-4">
          <Input
            label="Batch Name"
            placeholder="e.g. Java Full-Stack 2026 Morning"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            required
          />

          <Input
            label="Batch Code (Join Identifier)"
            placeholder="e.g. JAVA-2026-M"
            value={batchCode}
            onChange={(e) => setBatchCode(e.target.value.toUpperCase())}
            required
          />

          <Textarea
            label="Batch Description"
            placeholder="Target audience, syllabus outline, meeting schedule..."
            value={batchDesc}
            onChange={(e) => setBatchDesc(e.target.value)}
            rows={3}
          />

          <div className="flex justify-end gap-2 pt-3">
            <Button variant="ghost" size="sm" type="button" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Create Batch
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
