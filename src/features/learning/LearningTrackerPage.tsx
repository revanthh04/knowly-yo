import { useState } from 'react';
import {
  LineChart as LineChartIcon,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Star,
  Plus,
  PlayCircle,
  AlertTriangle,
  History,
  TrendingUp
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { useAppStore } from '@/hooks/useAppStore';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { toast } from '@/components/ui/Toast';
import { LearningStatus } from '@/types';
import confetti from 'canvas-confetti';

const STATUS_COLORS = {
  mastered: '#10b981', // emerald
  practiced: '#8b5cf6', // violet
  learning: '#f59e0b', // amber
  not_started: '#64748b' // slate
};

export function LearningTrackerPage() {
  const { store, currentUser, isTeacher } = useAppStore();

  const subjects = store.getSubjects();
  const chapters = store.getChapters();
  const records = store.getLearningRecords();
  const practiceSessions = store.getPracticeSessions();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [practiceModalOpen, setPracticeModalOpen] = useState(false);
  const [practiceChapterId, setPracticeChapterId] = useState('');
  const [practiceDuration, setPracticeDuration] = useState('45');
  const [practiceNotes, setPracticeNotes] = useState('');

  // Update Status & Confidence
  const handleStatusChange = (chapterId: string, subjectId: string, newStatus: LearningStatus) => {
    store.updateLearningRecord(chapterId, subjectId, { status: newStatus });
    if (newStatus === 'mastered') {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      toast.success('Topic Mastered! 🎉', 'Your mastery score has increased.');
    } else {
      toast.info('Status Updated', `Marked as ${newStatus}`);
    }
  };

  const handleConfidenceChange = (chapterId: string, subjectId: string, confidence: number) => {
    store.updateLearningRecord(chapterId, subjectId, { confidence });
    toast.info('Confidence Rated', `Rated ${confidence}/5`);
  };

  const handleLogPractice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId || !practiceChapterId) {
      toast.error('Missing Chapter', 'Please choose a valid chapter topic.');
      return;
    }
    store.logPracticeSession(
      selectedSubjectId,
      practiceChapterId,
      parseInt(practiceDuration, 10),
      practiceNotes
    );
    toast.success('Practice Session Logged', `Recorded ${practiceDuration} minutes.`);
    setPracticeModalOpen(false);
    setPracticeNotes('');
  };

  // Compute analytics
  const totalChapters = chapters.length;
  const masteredCount = records.filter((r) => r.status === 'mastered').length;
  const practicedCount = records.filter((r) => r.status === 'practiced').length;
  const learningCount = records.filter((r) => r.status === 'learning').length;
  const notStartedCount = Math.max(0, totalChapters - (masteredCount + practicedCount + learningCount));

  const pieData = [
    { name: 'Mastered', value: masteredCount, color: STATUS_COLORS.mastered },
    { name: 'Practiced', value: practicedCount, color: STATUS_COLORS.practiced },
    { name: 'Learning', value: learningCount, color: STATUS_COLORS.learning },
    { name: 'Not Started', value: notStartedCount, color: STATUS_COLORS.not_started }
  ].filter((d) => d.value > 0);

  // Subject completion breakdown
  const subjectProgressData = subjects.map((sub) => {
    const subChaps = chapters.filter((c) => c.subject_id === sub.id);
    const subRecords = records.filter((r) => r.subject_id === sub.id && r.status === 'mastered');
    const pct = subChaps.length > 0 ? Math.round((subRecords.length / subChaps.length) * 100) : 0;
    return {
      name: sub.name.split(' ')[0], // short name
      fullName: sub.name,
      mastery: pct,
      total: subChaps.length
    };
  });

  // Weak topics (status is learning or confidence <= 2)
  const weakTopics = chapters.filter((chap) => {
    const rec = records.find((r) => r.chapter_id === chap.id);
    return rec && (rec.status === 'learning' || rec.confidence <= 2);
  });

  const currentSubjectChapters = chapters.filter((c) => c.subject_id === selectedSubjectId);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {isTeacher ? 'Instructor Technical Mastery & Prep Tracker' : 'Personal Learning Tracker'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Systematically rate confidence from 1–5, track practice sessions, and eliminate weak spots.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setPracticeChapterId(currentSubjectChapters[0]?.id || '');
            setPracticeModalOpen(true);
          }}
          className="gap-2"
        >
          <PlayCircle className="w-4 h-4" />
          <span>Log Practice Session</span>
        </Button>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Distribution Donut */}
        <Card className="flex flex-col items-center">
          <CardHeader className="w-full">
            <CardTitle className="text-sm">Status Distribution</CardTitle>
          </CardHeader>
          <div className="w-full h-48 flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#141721',
                      borderColor: '#262c3e',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400">No records yet</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 w-full mt-2 text-xs">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-slate-600 dark:text-slate-300">
                  {d.name}: <strong>{d.value}</strong>
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Subject Mastery Bar Chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-500" />
              <span>Mastery by Technology Subject (%)</span>
            </CardTitle>
          </CardHeader>
          <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#8492a6' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#8492a6' }} />
                <Tooltip
                  formatter={(val) => [`${val}%`, 'Mastery']}
                  contentStyle={{
                    backgroundColor: '#141721',
                    borderColor: '#262c3e',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="mastery" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Weak Topics Warning Banner (if any) */}
      {weakTopics.length > 0 && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              {weakTopics.length} Weak Topic{weakTopics.length > 1 ? 's' : ''} Requiring Revision
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              These topics have lower confidence scores or are in active learning status:
            </p>
            <div className="flex items-center gap-2 flex-wrap mt-2">
              {weakTopics.map((wt) => (
                <span
                  key={wt.id}
                  className="px-2 py-0.5 rounded-md text-[11px] bg-white dark:bg-[#141721] border border-amber-500/30 font-medium text-amber-700 dark:text-amber-300"
                >
                  {wt.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subject Topic Progress Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {subjects.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubjectId(sub.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  selectedSubjectId === sub.id
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-[#1a1e2b] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Chapter / Concept Topic</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Confidence (1–5)</th>
                <th className="py-3 px-3">Notes & Difficulties</th>
                <th className="py-3 px-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {currentSubjectChapters.map((chap) => {
                const rec = records.find((r) => r.chapter_id === chap.id);
                const currentStatus: LearningStatus = rec?.status || 'not_started';
                const currentConfidence = rec?.confidence || 1;

                return (
                  <tr key={chap.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                      {chap.title}
                    </td>
                    <td className="py-3.5 px-3">
                      <select
                        value={currentStatus}
                        onChange={(e) =>
                          handleStatusChange(chap.id, chap.subject_id, e.target.value as LearningStatus)
                        }
                        className="px-2 py-1 rounded-lg text-xs bg-slate-100 dark:bg-[#1a1e2b] border border-slate-300 dark:border-slate-700/80 font-medium"
                      >
                        <option value="not_started">Not Started</option>
                        <option value="learning">Learning</option>
                        <option value="practiced">Practiced</option>
                        <option value="mastered">Mastered</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleConfidenceChange(chap.id, chap.subject_id, star)}
                            className="p-0.5 text-slate-300 hover:text-amber-400 focus:outline-none transition-colors"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                star <= currentConfidence
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300 dark:text-slate-700'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                      {rec?.notes || '—'}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setPracticeChapterId(chap.id);
                          setPracticeModalOpen(true);
                        }}
                        className="h-7 text-xs text-violet-600 dark:text-violet-400"
                      >
                        Log Session
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Practice Sessions Log History */}
      {practiceSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <History className="w-4 h-4 text-violet-500" />
              <span>Recent Practice Logs</span>
            </CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {practiceSessions.slice(0, 5).map((ps) => {
              const chap = chapters.find((c) => c.id === ps.chapter_id);
              return (
                <div
                  key={ps.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#1a1e2b]/50 flex items-start justify-between gap-4 text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {chap?.title || 'Practice Session'}
                    </span>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{ps.notes}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-violet-500">{ps.duration_minutes} min</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(ps.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Log Practice Modal */}
      <Modal
        isOpen={practiceModalOpen}
        onClose={() => setPracticeModalOpen(false)}
        title="Log Focused Practice Session"
        description="Record the duration and self-reflection on technical problems tackled."
      >
        <form onSubmit={handleLogPractice} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Chapter Topic
            </label>
            <select
              value={practiceChapterId}
              onChange={(e) => setPracticeChapterId(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-lg bg-white dark:bg-[#1a1e2b] border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-slate-100"
            >
              {currentSubjectChapters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Duration in Minutes"
            type="number"
            min="5"
            max="600"
            value={practiceDuration}
            onChange={(e) => setPracticeDuration(e.target.value)}
            required
          />

          <Textarea
            label="Practice Reflections / Difficulties"
            placeholder="What corner cases or syntax patterns did you practice? Notes for next time..."
            value={practiceNotes}
            onChange={(e) => setPracticeNotes(e.target.value)}
            rows={3}
            required
          />

          <div className="flex justify-end gap-2 pt-3">
            <Button variant="ghost" size="sm" type="button" onClick={() => setPracticeModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Session
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
