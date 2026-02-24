import { useEffect } from 'react';
import { authClient } from '@/lib/auth-clients';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNav } from './SidebarNav';
import { SidebarFooter } from './SidebarFooter';

interface AppSidebarProps {
  isMobileOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function AppSidebar({
  isMobileOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}: AppSidebarProps) {
  const { data: session } = authClient.useSession();

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  if (!session) {
    return null;
  }

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Desktop spacer - reserves space in the layout */}
      <div
        className={`
          hidden lg:block flex-shrink-0
          transition-[width] duration-300 ease-in-out
          ${isCollapsed ? 'w-0' : 'w-64'}
        `}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          lg:top-12 lg:bottom-0
          flex flex-col
          bg-card
          transition-[width,border-color] duration-300 ease-in-out
          overflow-hidden
          ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}
          lg:translate-x-0
          ${isCollapsed ? 'lg:w-0 lg:border-r-transparent' : 'lg:w-64 lg:border-r lg:border-border'}
        `}
      >
        <div className="flex flex-col h-full w-64 flex-shrink-0">
          <SidebarHeader onClose={onClose} isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse} />
          <SidebarNav onItemClick={onClose} />
          <SidebarFooter />
        </div>
      </aside>
    </>
  );
}
