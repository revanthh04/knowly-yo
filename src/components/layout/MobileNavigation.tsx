import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  LineChart,
  Repeat,
  HelpCircle,
  Sparkles,
  Users,
  FileCheck2,
  Settings,
  X,
  GraduationCap
} from 'lucide-react';
import { useAppStore } from '@/hooks/useAppStore';
import { cn } from '@/components/ui/Button';

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const { isTeacher } = useAppStore();

  if (!isOpen) return null;

  const teacherNavItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Knowledge', path: '/knowledge', icon: BookOpen },
    { label: 'Teaching Planner', path: '/planner', icon: CalendarDays },
    { label: 'Learning Progress', path: '/learning', icon: LineChart },
    { label: 'Revision Center', path: '/revisions', icon: Repeat },
    { label: 'Question Bank', path: '/question-bank', icon: HelpCircle },
    { label: 'AI Assistant', path: '/ai-assistant', icon: Sparkles },
    { label: 'Batches & Students', path: '/batches', icon: Users },
    { label: 'Assignments', path: '/assignments', icon: FileCheck2 },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  const studentNavItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Knowledge Library', path: '/knowledge', icon: BookOpen },
    { label: 'My Learning Tracker', path: '/learning', icon: LineChart },
    { label: 'Revision Center', path: '/revisions', icon: Repeat },
    { label: 'Question Bank', path: '/question-bank', icon: HelpCircle },
    { label: 'My Assignments', path: '/my-assignments', icon: FileCheck2 },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  const navItems = isTeacher ? teacherNavItems : studentNavItems;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-72 max-w-[80vw] bg-white dark:bg-[#141721] h-full shadow-2xl z-10 flex flex-col p-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-slate-900 dark:text-slate-100">Knowly-Yo</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                    isActive
                      ? 'bg-violet-600 text-white shadow-sm shadow-violet-900/30'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  )
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
