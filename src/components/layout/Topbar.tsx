import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  Check,
  UserCheck,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useAppStore } from '@/hooks/useAppStore';
import { useTheme } from '@/hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/Toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface TopbarProps {
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
}

export function Topbar({ onOpenMobileMenu, onOpenSearch }: TopbarProps) {
  const { store, currentUser, isTeacher, switchUser, resetToDefaults } = useAppStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const notifications = store.getNotifications();
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const handleRoleToggle = (role: 'teacher' | 'student') => {
    if (role === 'teacher') {
      switchUser('user-teacher-revanth');
      toast.info('Switched View', 'Now viewing as Instructor (Revanth)');
    } else {
      switchUser('user-student-alex');
      toast.info('Switched View', 'Now viewing as Student (Alex Chen)');
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to clean initial state?')) {
      resetToDefaults();
      toast.success('Reset Complete', 'Preloaded fresh seed data for Java, SQL, and DSA.');
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <header className="sticky top-0 z-20 h-14 border-b border-white/[0.08] bg-[#191919]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu + Search Pill */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-1.5 rounded-[6px] text-white/50 hover:text-white hover:bg-[#252525]"
            aria-label="Open mobile navigation"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Notion Search Pill with Radix Tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onOpenSearch}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-[8px] border border-white/[0.08] bg-[#202020] text-white/40 text-xs hover:border-white/[0.18] hover:text-white/70 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-white/40" />
                  <span className="truncate">Search notes, code, tags...</span>
                </div>
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono rounded-[4px] bg-[#252525] text-white/50 border border-white/[0.06]">
                  Ctrl+K
                </kbd>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Quick jump to any note, topic, or command (Ctrl + K)</span>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Instant Role Switcher */}
          <div className="flex items-center bg-[#202020] p-0.5 rounded-[8px] border border-white/[0.08] text-xs">
            <button
              onClick={() => handleRoleToggle('teacher')}
              className={`px-2.5 py-1 rounded-[6px] font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                isTeacher
                  ? 'bg-[#0075de] text-white font-medium'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Teacher</span>
            </button>
            <button
              onClick={() => handleRoleToggle('student')}
              className={`px-2.5 py-1 rounded-[6px] font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                !isTeacher
                  ? 'bg-[#0075de] text-white font-medium'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <span className="hidden sm:inline">Student</span>
            </button>
          </div>

          {/* Radix Popover: Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="relative p-1.5 rounded-[8px] text-white/50 hover:text-white hover:bg-[#252525] transition-colors cursor-pointer"
                aria-label="Open notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#0075de] ring-2 ring-[#191919]" />
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 sm:w-96 p-3">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
                  Notifications ({notifications.length})
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      notifications.forEach((n) => store.markNotificationRead(n.id));
                      toast.info('Marked all notifications as read');
                    }}
                    className="text-[11px] text-[#62aef0] hover:text-white font-medium cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-1.5">
                {notifications.length === 0 ? (
                  <p className="text-center py-6 text-xs text-white/35">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        store.markNotificationRead(n.id);
                        if (n.link) navigate(n.link);
                      }}
                      className={`p-2.5 rounded-[8px] cursor-pointer transition-colors text-xs flex flex-col gap-1 ${
                        !n.read_at
                          ? 'bg-[#0075de]/10 border-l-2 border-[#0075de]'
                          : 'hover:bg-[#252525]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white/90">{n.title}</span>
                        <span className="text-[10px] text-white/35">
                          {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-white/60 text-[11px] leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Theme Toggle with Radix Tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-[8px] text-white/50 hover:text-white hover:bg-[#252525] transition-colors cursor-pointer"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-[#ffb110]" /> : <Moon className="w-4 h-4 text-white" />}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <span>{theme === 'dark' ? 'Switch to light paper' : 'Switch to dark canvas'}</span>
            </TooltipContent>
          </Tooltip>

          {/* Radix DropdownMenu: User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-1 pl-2 rounded-[8px] border border-white/[0.08] hover:border-white/[0.16] bg-[#202020] transition-colors cursor-pointer outline-none">
                <span className="hidden sm:inline text-xs font-medium text-white/80 max-w-[120px] truncate">
                  {currentUser.full_name}
                </span>
                <img
                  src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={currentUser.full_name}
                  className="w-6 h-6 rounded-[6px] object-cover border border-white/[0.12]"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="p-2 border-b border-white/[0.06] mb-1">
                <p className="font-medium text-white/90 text-xs">{currentUser.full_name}</p>
                <p className="text-[11px] text-white/40">{currentUser.email}</p>
                <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#0075de]/15 text-[#62aef0]">
                  Role: {currentUser.role.toUpperCase()}
                </div>
              </div>

              <DropdownMenuLabel>Switch Persona</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleRoleToggle('teacher')}>
                <span className="flex-1">Instructor (Revanth)</span>
                {isTeacher && <Check className="w-3.5 h-3.5 text-[#0075de]" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRoleToggle('student')}>
                <span className="flex-1">Student (Alex Chen)</span>
                {!isTeacher && <Check className="w-3.5 h-3.5 text-[#0075de]" />}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Sparkles className="w-3.5 h-3.5 text-white/40" />
                <span>Settings & Database Config</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleResetData} className="text-[#ff6b57] focus:text-[#ff6b57] hover:bg-[#f64932]/10">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Demo Data</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </TooltipProvider>
  );
}
