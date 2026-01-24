import { SidebarNavSection } from './SidebarNavSection';
import { navigationConfig } from '../config/navigation.config';

interface SidebarNavProps {
  onItemClick?: () => void;
}

export function SidebarNav({ onItemClick }: SidebarNavProps) {
  return (
    <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
      {navigationConfig.map((section) => (
        <SidebarNavSection
          key={section.id}
          title={section.title}
          icon={section.icon}
          collapsible={section.collapsible}
          defaultOpen={section.defaultOpen}
          items={section.items}
          onItemClick={onItemClick}
        />
      ))}
    </nav>
  );
}
