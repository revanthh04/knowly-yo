import { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  Check,
  UserCheck,
  RefreshCw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useAppStore } from '@/hooks/useAppStore';
import { useTheme } from '@/hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/Toast';

export interface TopbarProps {
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
}

export function Topbar({ onOpenMobileMenu, onOpenSearch }: TopbarProps) {
  const { store, currentUser, isTeacher, switchUser, resetToDefaults } = useAppStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const notifications = store.getNotifications();
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleToggle = (role: 'teacher' | 'student') => {
    if (role === 'teacher') {
      switchUser('user-teacher-revanth');
      toast.info('Switched View', 'Now viewing as Instructor (Revanth)');
    } else {
      switchUser('user-student-alex');
      toast.info('Switched View', 'Now viewing as Student (Alex Chen)');
    }
    setUserMenuOpen(false);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to clean initial state?')) {
      resetToDefaults();
      toast.success('Reset Complete', 'Preloaded fresh seed data for Java, SQL, and DSA.');
      setUserMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-[#141721]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu + Search Pill */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1a1e2b] text-slate-400 text-xs hover:border-violet-500/50 hover:bg-white dark:hover:bg-[#1a1e2b] transition-all cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <span className="truncate">Search notes, code, tags...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Instant Role Switcher Pill */}
        <div className="flex items-center bg-slate-100 dark:bg-[#1a1e2b] p-1 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
          <button
            onClick={() => handleRoleToggle('teacher')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              isTeacher
                ? 'bg-white dark:bg-violet-600 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Teacher</span>
          </button>
          <button
            onClick={() => handleRoleToggle('student')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              !isTeacher
                ? 'bg-white dark:bg-violet-600 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="hidden sm:inline">Student</span>
          </button>
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-violet-600 ring-2 ring-white dark:ring-[#141721]" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#141721] border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-3 animate-fade-in">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Notifications ({notifications.length})
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      notifications.forEach((n) => store.markNotificationRead(n.id));
                      toast.info('Marked all notifications as read');
                    }}
                    className="text-[11px] text-violet-500 hover:text-violet-600 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-1.5">
                {notifications.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-400">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        store.markNotificationRead(n.id);
                        if (n.link) navigate(n.link);
                        setNotifOpen(false);
                      }}
                      className={`p-2.5 rounded-xl cursor-pointer transition-colors text-xs flex flex-col gap-1 ${
                        !n.read_at
                          ? 'bg-violet-50 dark:bg-violet-950/20 border-l-2 border-violet-600'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{n.title}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle (Dark / Light) */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* User Profile Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-[#1a1e2b] transition-all"
          >
            <span className="hidden sm:inline text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
              {currentUser.full_name}
            </span>
            <img
              src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={currentUser.full_name}
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-violet-500/40"
            />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#141721] border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-2 text-xs">
              <div className="p-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                <p className="font-semibold text-slate-900 dark:text-slate-100">{currentUser.full_name}</p>
                <p className="text-[11px] text-slate-400">{currentUser.email}</p>
                <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/15 text-violet-600 dark:text-violet-400">
                  Role: {currentUser.role.toUpperCase()}
                </div>
              </div>

              <div className="space-y-0.5">
                <button
                  onClick={() => handleRoleToggle('teacher')}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                >
                  <span>Switch to Teacher (Revanth)</span>
                  {isTeacher && <Check className="w-3.5 h-3.5 text-violet-500" />}
                </button>
                <button
                  onClick={() => handleRoleToggle('student')}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                >
                  <span>Switch to Student (Alex Chen)</span>
                  {!isTeacher && <Check className="w-3.5 h-3.5 text-violet-500" />}
                </button>
              </div>

              <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-800 space-y-0.5">
                <button
                  onClick={() => {
                    navigate('/settings');
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                  <span>Settings & Database Config</span>
                </button>
                <button
                  onClick={handleResetData}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-500/10 text-left"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Demo Data</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
