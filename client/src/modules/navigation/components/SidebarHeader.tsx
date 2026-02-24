import { X, Search } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface SidebarHeaderProps {
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function SidebarHeader({ onClose, isCollapsed, onToggleCollapse }: SidebarHeaderProps) {
  return (
    <div className="p-3 space-y-3">
      {/* Logo and close button */}
      <div className="flex items-center justify-between">
        <Link to="/" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
          Life OS
        </Link>
        {/* Close button - mobile only */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-accent rounded-md transition-colors"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Search input */}
      <div className="relative">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Find..."
          className="w-full h-7 pl-8 pr-8 text-xs bg-accent/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
        <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground bg-background border border-border rounded px-1">
          F
        </kbd>
      </div>
    </div>
  );
}
