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
        'hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#141721] transition-all duration-200 select-none z-30 shrink-0 sticky top-0 h-screen',
        collapsed ? 'w-18' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800/80">
        <NavLink to="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center text-white font-bold shadow-md shadow-violet-900/30 shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
                Knowly<span className="text-violet-500">-Yo</span>
              </span>
              <span className="text-[11px] font-medium text-slate-400 truncate">
                {isTeacher ? 'Teacher Knowledge Hub' : 'Student Portal'}
              </span>
            </div>
          )}
        </NavLink>

        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {!collapsed && (
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {isTeacher ? 'Teacher Workspace' : 'Student Learning'}
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
                  'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group relative',
                  isActive
                    ? 'bg-violet-600 text-white shadow-sm shadow-violet-900/20 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                )
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" />
              {!collapsed && <span className="truncate flex-1">{item.label}</span>}
              {!collapsed && item.badge !== undefined && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-rose-500 text-white shrink-0">
                  {item.badge}
                </span>
              )}
              {collapsed && item.badge !== undefined && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer Role Indicator */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80">
        <div
          className={cn(
            'flex items-center rounded-xl p-2 bg-slate-50 dark:bg-[#1a1e2b] border border-slate-200/80 dark:border-slate-800',
            collapsed ? 'justify-center' : 'gap-3'
          )}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-200 truncate">
                Role: {isTeacher ? 'Instructor' : 'Student'}
              </span>
              <span className="text-[10px] text-slate-400">RLS Enforced</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
