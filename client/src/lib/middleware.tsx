import { useEffect, type ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { authClient } from './auth-clients';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !session) {
      // No session, redirect to auth screen
      navigate({ to: '/auth', replace: true });
    }
  }, [isPending, session, navigate]);

  // Show loading state while checking session
  if (isPending) {
    return null; // or return a loading spinner component if preferred
  }

  // If no session, return null (redirect is happening)
  if (!session) {
    return null;
  }

  // Session exists, render children
  return children;
}
