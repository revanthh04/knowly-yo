import { useState } from 'react';
import {
  Settings as SettingsIcon,
  Database,
  Moon,
  Sun,
  Key,
  Shield,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAppStore } from '@/hooks/useAppStore';
import { useTheme } from '@/hooks/useTheme';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { toast } from '@/components/ui/Toast';

export function SettingsPage() {
  const { store, currentUser, isTeacher, switchUser, resetToDefaults } = useAppStore();
  const { theme, toggleTheme, setTheme } = useTheme();

  const [aiKey, setAiKey] = useState(() => localStorage.getItem('knowly_ai_key') || '');
  const [savedKeySuccess, setSavedKeySuccess] = useState(false);

  const handleSaveAIKey = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('knowly_ai_key', aiKey);
    setSavedKeySuccess(true);
    setTimeout(() => setSavedKeySuccess(false), 2500);
    toast.success('Configuration Saved', 'AI Key persisted in client storage.');
  };

  const handleExportBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      profiles: store.profiles,
      subjects: store.subjects,
      chapters: store.chapters,
      notes: store.notes,
      learningRecords: store.learningRecords,
      revisions: store.revisions,
      batches: store.batches,
      lessons: store.lessons,
      questions: store.questions,
      answers: store.answers,
      assignments: store.assignments,
      submissions: store.submissions
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `knowly-yo-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Backup Exported', 'Downloaded complete platform data archive.');
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Settings & Environment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure visual themes, role permissions, PostgreSQL Supabase connectivity, and backups.
        </p>
      </div>

      {/* User Profile & Role Card */}
      <Card className="space-y-4">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-4 h-4 text-violet-500" />
            <span>Active Account & Role Verification</span>
          </CardTitle>
        </CardHeader>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-[#1a1e2b] border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={currentUser.full_name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-violet-500/50"
            />
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {currentUser.full_name}
              </p>
              <p className="text-xs text-slate-400">{currentUser.email}</p>
              <div className="mt-1">
                <Badge variant={isTeacher ? 'purple' : 'info'} className="text-[10px]">
                  Role: {currentUser.role.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isTeacher ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                switchUser('user-teacher-revanth');
                toast.info('Role switched to Instructor (Revanth)');
              }}
              className="text-xs"
            >
              Instructor View
            </Button>
            <Button
              variant={!isTeacher ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                switchUser('user-student-alex');
                toast.info('Role switched to Student (Alex Chen)');
              }}
              className="text-xs"
            >
              Student View
            </Button>
          </div>
        </div>
      </Card>

      {/* Visual Theme Selection */}
      <Card className="space-y-4">
        <CardHeader>
          <CardTitle className="text-base">Visual Appearance Theme</CardTitle>
        </CardHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
              theme === 'dark'
                ? 'border-violet-600 bg-violet-500/10 dark:bg-violet-500/15 ring-2 ring-violet-500/30'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-900 text-violet-400">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Graphite Dark (Default)</p>
                <p className="text-[11px] text-slate-400">Deep charcoal, easy on the eyes during coding</p>
              </div>
            </div>
            {theme === 'dark' && <CheckCircle2 className="w-5 h-5 text-violet-500" />}
          </button>

          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
              theme === 'light'
                ? 'border-violet-600 bg-violet-500/10 ring-2 ring-violet-500/30'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Clean Light Mode</p>
                <p className="text-[11px] text-slate-400">Bright, high contrast for daylight preparation</p>
              </div>
            </div>
            {theme === 'light' && <CheckCircle2 className="w-5 h-5 text-violet-500" />}
          </button>
        </div>
      </Card>

      {/* Supabase Connection Status Card */}
      <Card className="space-y-4">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="w-4 h-4 text-sky-500" />
            <span>Supabase PostgreSQL & Row Level Security</span>
          </CardTitle>
          <Badge variant={isSupabaseConfigured ? 'success' : 'neutral'}>
            {isSupabaseConfigured ? 'Connected to Remote Supabase' : 'Offline / Local Persistence Active'}
          </Badge>
        </CardHeader>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Knowly-Yo features a complete 20-table schema with strict Row Level Security (RLS) policies. When remote Supabase credentials are configured in your <code>.env</code>, all data seamlessly syncs with your remote PostgreSQL instance. Otherwise, everything is persistently stored locally in the browser with full fidelity.
        </p>

        <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 space-y-1">
          <p className="text-slate-500"># Set credentials in .env to connect remote database:</p>
          <p className="text-violet-400">VITE_SUPABASE_URL=https://your-project.supabase.co</p>
          <p className="text-violet-400">VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</p>
        </div>
      </Card>

      {/* AI Key Configuration Card */}
      <Card className="space-y-4">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-500" />
            <span>AI Provider API Credentials (Optional)</span>
          </CardTitle>
        </CardHeader>

        <p className="text-xs text-slate-600 dark:text-slate-300">
          Knowly-Yo includes intelligent offline educational generation templates. You can also provide an optional Gemini or OpenAI API key to unlock custom remote completions.
        </p>

        <form onSubmit={handleSaveAIKey} className="space-y-3">
          <Input
            label="API Key"
            type="password"
            placeholder="AIzaSy... or sk-..."
            value={aiKey}
            onChange={(e) => setAiKey(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="primary" size="sm" type="submit">
              {savedKeySuccess ? 'Saved!' : 'Save Key'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Backup and Maintenance Card */}
      <Card className="space-y-4">
        <CardHeader>
          <CardTitle className="text-base">Data Backup & Maintenance</CardTitle>
        </CardHeader>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Export JSON Backup</p>
            <p className="text-[11px] text-slate-400">Download complete notes, syllabus, and submissions archive.</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportBackup} className="gap-2 text-xs">
            <Download className="w-4 h-4" />
            <span>Export Backup</span>
          </Button>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-rose-500">Reset Demo Data</p>
            <p className="text-[11px] text-slate-400">Restore factory sample notes for Java, SQL, and DSA.</p>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (window.confirm('Reset all demo data back to clean initial state?')) {
                resetToDefaults();
                toast.success('Reset Complete', 'Preloaded fresh seed data for Java, SQL, and DSA.');
              }
            }}
            className="gap-2 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
