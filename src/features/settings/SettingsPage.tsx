import { useState } from 'react';
import {
  Database,
  Moon,
  Sun,
  Key,
  Shield,
  Download,
  RefreshCw,
  CheckCircle2
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
  const { theme, setTheme } = useTheme();

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
      <div className="pb-3 border-b border-white/[0.06]">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white/95">
          Settings & Environment
        </h1>
        <p className="text-xs sm:text-sm text-white/50 mt-1 leading-relaxed">
          Configure visual themes, role permissions, PostgreSQL Supabase connectivity, and backups.
        </p>
      </div>

      {/* User Profile & Role Card */}
      <Card className="space-y-4">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#0075de]" />
            <span>Active Account & Role Verification</span>
          </CardTitle>
        </CardHeader>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-[10px] bg-[#191919] border border-white/[0.08]">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={currentUser.full_name}
              className="w-11 h-11 rounded-[8px] object-cover border border-white/[0.12]"
            />
            <div>
              <p className="text-sm font-semibold text-white/95">
                {currentUser.full_name}
              </p>
              <p className="text-xs text-white/40">{currentUser.email}</p>
              <div className="mt-1">
                <Badge variant={isTeacher ? 'blue' : 'info'} className="text-[10px]">
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
          <CardTitle className="text-sm">Visual Appearance Theme</CardTitle>
        </CardHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-[12px] border text-left transition-colors cursor-pointer flex items-center justify-between ${
              theme === 'dark'
                ? 'border-[#0075de] bg-[#0075de]/[0.08]'
                : 'border-white/[0.08] bg-[#191919] hover:border-white/[0.16]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-[8px] bg-[#191919] text-[#62aef0]">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white/90">Notion Dark (Default)</p>
                <p className="text-[11px] text-white/40">Warm matte obsidian canvas with crisp hairline borders</p>
              </div>
            </div>
            {theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-[#0075de]" />}
          </button>

          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-[12px] border text-left transition-colors cursor-pointer flex items-center justify-between ${
              theme === 'light'
                ? 'border-[#0075de] bg-[#0075de]/[0.08]'
                : 'border-white/[0.08] bg-[#191919] hover:border-white/[0.16]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-[8px] bg-[#f6f5f4] text-[#111111]">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white/90">Notion Paper Warmth (Light)</p>
                <p className="text-[11px] text-white/40">Tactile warm off-white canvas under afternoon sun</p>
              </div>
            </div>
            {theme === 'light' && <CheckCircle2 className="w-4 h-4 text-[#0075de]" />}
          </button>
        </div>
      </Card>

      {/* Supabase Connection Status Card */}
      <Card className="space-y-4">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Database className="w-4 h-4 text-[#0075de]" />
            <span>Supabase PostgreSQL & Row Level Security</span>
          </CardTitle>
          <Badge variant={isSupabaseConfigured ? 'success' : 'neutral'}>
            {isSupabaseConfigured ? 'Connected to Remote Supabase' : 'Offline / Local Persistence Active'}
          </Badge>
        </CardHeader>

        <p className="text-xs text-white/60 leading-relaxed">
          Knowly-Yo features a complete 20-table schema with strict Row Level Security (RLS) policies. When remote Supabase credentials are configured in your <code>.env</code>, all data seamlessly syncs with your remote PostgreSQL instance. Otherwise, everything is persistently stored locally in the browser with full fidelity.
        </p>

        <div className="p-3.5 rounded-[8px] bg-[#141414] font-mono text-xs text-white/70 space-y-1 border border-white/[0.06]">
          <p className="text-white/35"># Set credentials in .env to connect remote database:</p>
          <p className="text-[#62aef0]">VITE_SUPABASE_URL=https://your-project.supabase.co</p>
          <p className="text-[#62aef0]">VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</p>
        </div>
      </Card>

      {/* AI Key Configuration Card */}
      <Card className="space-y-4">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Key className="w-4 h-4 text-[#ffb110]" />
            <span>AI Provider API Credentials (Optional)</span>
          </CardTitle>
        </CardHeader>

        <p className="text-xs text-white/60">
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
          <CardTitle className="text-sm">Data Backup & Maintenance</CardTitle>
        </CardHeader>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-white/90">Export JSON Backup</p>
            <p className="text-[11px] text-white/40">Download complete notes, syllabus, and submissions archive.</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportBackup} className="gap-2 text-xs">
            <Download className="w-4 h-4" />
            <span>Export Backup</span>
          </Button>
        </div>

        <div className="pt-3 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#ff6b57]">Reset Demo Data</p>
            <p className="text-[11px] text-white/40">Restore factory sample notes for Java, SQL, and DSA.</p>
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
