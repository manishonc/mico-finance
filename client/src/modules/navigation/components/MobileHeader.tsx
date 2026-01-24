import { Menu } from 'lucide-react';
import { authClient } from '@/lib/auth-clients';

interface MobileHeaderProps {
  onMenuClick: () => void;
  isCollapsed?: boolean;
}

export function MobileHeader({ onMenuClick, isCollapsed }: MobileHeaderProps) {
  const { data: session } = authClient.useSession();

  if (!session) {
    return null;
  }

  return (
    <header className="sticky top-0 z-30 bg-card border-b border-border">
      <div className="flex items-center h-12 px-3 gap-3">
        <button
          onClick={onMenuClick}
          className="p-1.5 hover:bg-accent rounded-md transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={18} />
        </button>
        <h1 className="text-sm font-semibold">Life OS</h1>
      </div>
    </header>
  );
}
