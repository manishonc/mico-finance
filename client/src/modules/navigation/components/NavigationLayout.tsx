import { ReactNode, useEffect } from 'react';
import { authClient } from '@/lib/auth-clients';
import { useNavigationState } from '../hooks/useNavigationState';
import { MobileHeader } from './MobileHeader';
import { AppSidebar } from './AppSidebar';

interface NavigationLayoutProps {
  children: ReactNode;
}

export function NavigationLayout({ children }: NavigationLayoutProps) {
  const { data: session } = authClient.useSession();
  const { isMobileOpen, openMobile, closeMobile, isCollapsed, toggleCollapsed } = useNavigationState();

  // Keyboard shortcut: Cmd+\ or Ctrl+\ to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+\ (Mac) or Ctrl+\ (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault();
        toggleCollapsed();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleCollapsed]);

  if (!session) {
    return <>{children}</>;
  }

  // On mobile: header button opens drawer
  // On desktop: header button (when visible) toggles sidebar collapsed state
  const handleMenuClick = () => {
    if (window.innerWidth < 1024) {
      openMobile();
    } else {
      toggleCollapsed();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <MobileHeader onMenuClick={handleMenuClick} isCollapsed={isCollapsed} />
      <div className="flex flex-1">
        <AppSidebar
          isMobileOpen={isMobileOpen}
          onClose={closeMobile}
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapsed}
        />
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
