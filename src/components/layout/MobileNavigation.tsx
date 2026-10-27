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
      <div className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-64 max-w-[80vw] bg-[#191919] border-r border-white/[0.08] h-full shadow-2xl z-10 flex flex-col p-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[7px] bg-[#0075de] flex items-center justify-center text-white">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm text-white/90">Knowly-Yo</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[6px] text-white/40 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 px-2.5 py-1.5 rounded-[6px] text-xs transition-colors',
                    isActive
                      ? 'bg-[#252525] text-white font-medium border border-white/[0.07]'
                      : 'text-white/60 hover:bg-[#202020] hover:text-white/90'
                  )
                }
              >
                <Icon className="w-4 h-4 shrink-0 text-[#0075de]" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
