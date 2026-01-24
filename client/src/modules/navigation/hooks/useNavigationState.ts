import { useState, useCallback, useEffect } from 'react';

const SIDEBAR_COLLAPSED_KEY = 'sidebar-collapsed';

export function useNavigationState() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Initialize from localStorage
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    return stored === 'true';
  });

  // Persist collapse state to localStorage
  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(isCollapsed));
  }, [isCollapsed]);

  const openMobile = useCallback(() => setIsMobileOpen(true), []);
  const closeMobile = useCallback(() => setIsMobileOpen(false), []);
  const toggleMobile = useCallback(() => setIsMobileOpen(prev => !prev), []);

  const toggleCollapsed = useCallback(() => setIsCollapsed(prev => !prev), []);

  return {
    isMobileOpen,
    openMobile,
    closeMobile,
    toggleMobile,
    isCollapsed,
    toggleCollapsed,
  };
}
