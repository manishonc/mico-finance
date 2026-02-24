import { Link } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';

interface SidebarNavItemProps {
  to: string;
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export function SidebarNavItem({ to, label, icon: Icon, onClick }: SidebarNavItemProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent transition-colors text-sm"
      activeProps={{
        className: 'bg-accent font-medium',
      }}
    >
      <Icon size={16} />
      <span>{label}</span>
    </Link>
  );
}
