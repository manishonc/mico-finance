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
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-red-400 hover:text-red-300"
    >
      <LogOut size={20} />
      <span className="font-medium">Logout</span>
    </button>
  );
}
