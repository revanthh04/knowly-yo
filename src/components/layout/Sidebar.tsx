import { useState } from 'react';
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
  ChevronLeft,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { useAppStore } from '@/hooks/useAppStore';
import { cn } from '@/components/ui/Button';

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const { isTeacher, store } = useAppStore();

  const overdueRevisions = store.getRevisionTasks().filter(
    (r) => !r.is_completed && new Date(r.due_at).getTime() <= Date.now()
  ).length;

  const openQuestions = store.getQuestions().filter((q) => q.status === 'open').length;

  const teacherNavItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Knowledge', path: '/knowledge', icon: BookOpen },
    { label: 'Teaching Planner', path: '/planner', icon: CalendarDays },
    { label: 'Learning Progress', path: '/learning', icon: LineChart },
    { label: 'Revision Center', path: '/revisions', icon: Repeat, badge: overdueRevisions > 0 ? overdueRevisions : undefined },
    { label: 'Question Bank', path: '/question-bank', icon: HelpCircle, badge: openQuestions > 0 ? openQuestions : undefined },
    { label: 'AI Assistant', path: '/ai-assistant', icon: Sparkles },
    { label: 'Batches & Students', path: '/batches', icon: Users },
    { label: 'Assignments', path: '/assignments', icon: FileCheck2 },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  const studentNavItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Knowledge Library', path: '/knowledge', icon: BookOpen },
    { label: 'My Learning Tracker', path: '/learning', icon: LineChart },
    { label: 'Revision Center', path: '/revisions', icon: Repeat, badge: overdueRevisions > 0 ? overdueRevisions : undefined },
    { label: 'Question Bank', path: '/question-bank', icon: HelpCircle },
    { label: 'My Assignments', path: '/my-assignments', icon: FileCheck2 },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  const navItems = isTeacher ? teacherNavItems : studentNavItems;

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r border-white/[0.08] bg-[#191919] transition-all duration-200 select-none z-30 shrink-0 sticky top-0 h-screen',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Brand Header */}
      <div className="h-14 flex items-center justify-between px-3.5 border-b border-white/[0.06]">
        <NavLink to="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-7 h-7 rounded-[7px] bg-[#0075de] flex items-center justify-center text-white font-bold shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-sm tracking-tight text-white/90 leading-tight">
                Knowly<span className="text-[#62aef0]">-Yo</span>
              </span>
              <span className="text-[10px] text-white/40 truncate">
                {isTeacher ? 'Teacher Workspace' : 'Student Portal'}
              </span>
            </div>
          )}
        </NavLink>

        <button
          onClick={onToggleCollapse}
          className="p-1 rounded-[6px] text-white/40 hover:text-white/80 hover:bg-[#252525] transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Nav List - Notion Minimal item list */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {!collapsed && (
          <div className="px-2.5 pb-1.5 text-[10px] font-medium text-white/35 uppercase tracking-wider">
            {isTeacher ? 'Workspace' : 'Learning'}
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 px-2.5 py-1.5 rounded-[6px] text-xs transition-colors duration-150 group relative',
                  isActive
                    ? 'bg-[#252525] text-white font-medium border border-white/[0.07]'
                    : 'text-white/60 hover:bg-[#202020] hover:text-white/90'
                )
              }
              title={collapsed ? item.label : undefined}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'w-4 h-4 shrink-0 transition-colors',
                      isActive ? 'text-[#0075de]' : 'text-white/50 group-hover:text-white/80'
                    )}
                  />
                  {!collapsed && <span className="truncate flex-1 tracking-tight">{item.label}</span>}
                  {!collapsed && item.badge !== undefined && (
                    <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-full bg-[#f64932]/20 text-[#ff6b57] border border-[#f64932]/30 shrink-0">
                      {item.badge}
                    </span>
                  )}
                  {collapsed && item.badge !== undefined && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#f64932]" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer Role Indicator */}
      <div className="p-2.5 border-t border-white/[0.06]">
        <div
          className={cn(
            'flex items-center rounded-[8px] p-2 bg-[#202020] border border-white/[0.06]',
            collapsed ? 'justify-center' : 'gap-2.5'
          )}
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-medium text-white/85 truncate">
                {isTeacher ? 'Instructor Mode' : 'Student Mode'}
              </span>
              <span className="text-[9px] text-white/35">Row Level Security</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
