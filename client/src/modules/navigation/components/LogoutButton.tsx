import { LogOut } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { authClient } from '@/lib/auth-clients';

export function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      navigate({ to: '/auth', replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent transition-colors text-destructive text-sm w-full"
    >
      <LogOut size={16} />
      <span>Logout</span>
    </button>
  );
}
