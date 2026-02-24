import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { SidebarNavItem } from './SidebarNavItem';
import type { NavItem } from '../config/navigation.config';

interface SidebarNavSectionProps {
  title: string;
  icon?: LucideIcon;
  collapsible: boolean;
  defaultOpen: boolean;
  items: NavItem[];
  onItemClick?: () => void;
}

export function SidebarNavSection({
  title,
  icon: Icon,
  collapsible,
  defaultOpen,
  items,
  onItemClick,
}: SidebarNavSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (!collapsible) {
    return (
      <div className="space-y-0.5">
        <div className="space-y-0.5">
          {items.map((item) => (
            <SidebarNavItem
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
              onClick={onItemClick}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-0.5">
      <CollapsibleTrigger className="flex w-full items-center gap-2 px-2 py-1.5 text-xs font-medium hover:bg-accent rounded-md transition-colors group">
        {Icon && <Icon size={16} />}
        <span className="flex-1 text-left">{title}</span>
        <ChevronDown
          size={14}
          className="transition-transform duration-200 group-data-[state=open]:rotate-180"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="relative ml-4 pl-3 border-l border-border">
        <div className="space-y-0.5 py-1">
          {items.map((item) => (
            <SidebarNavItem
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
              onClick={onItemClick}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
