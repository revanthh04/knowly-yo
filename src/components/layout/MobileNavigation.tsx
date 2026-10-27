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
  GraduationCap
} from 'lucide-react';
import { useAppStore } from '@/hooks/useAppStore';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const { isTeacher } = useAppStore();

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
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="left" className="w-72 p-4 bg-[#191919]">
        <SheetHeader className="pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[7px] bg-[#0075de] flex items-center justify-center text-white">
              <GraduationCap className="w-4 h-4" />
            </div>
            <SheetTitle className="font-semibold text-sm text-white/90">Knowly-Yo</SheetTitle>
          </div>
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 px-2.5 py-2 rounded-[6px] text-xs transition-colors',
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
      </SheetContent>
    </Sheet>
  );
}
