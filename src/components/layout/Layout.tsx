import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNavigation } from './MobileNavigation';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { ToastContainer } from '@/components/ui/Toast';

export function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0c0e14] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Sidebar for Desktop */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Mobile Drawer */}
      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Command Palette / Search Dialog */}
      <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Global Toast Container */}
      <ToastContainer />
    </div>
  );
}
