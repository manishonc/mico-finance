import { Home, LayoutDashboard, Building2, Tags, type LucideIcon } from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export interface NavSection {
  id: string;
  title: string;
  icon?: LucideIcon;
  collapsible: boolean;
  defaultOpen: boolean;
  items: NavItem[];
}

export const navigationConfig: NavSection[] = [
  {
    id: 'main',
    title: 'Main',
    collapsible: false,
    defaultOpen: true,
    items: [
      { to: '/', label: 'Home', icon: Home },
    ],
  },
  {
    id: 'finance',
    title: 'Finance',
    icon: LayoutDashboard,
    collapsible: true,
    defaultOpen: true,
    items: [
      { to: '/finance/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/finance/entity', label: 'Entities', icon: Building2 },
      { to: '/finance/entity-type', label: 'Entity Types', icon: Tags },
    ],
  },
];
