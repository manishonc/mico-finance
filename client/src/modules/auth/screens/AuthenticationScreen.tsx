import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { AuthLayout, AuthCard, LoginForm, SignupForm } from '../components';
import { authClient } from '@/lib/auth-clients';

type AuthMode = 'login' | 'signup';

export default function AuthenticationScreen() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const navigate = useNavigate();

  const handleLoginSubmit = async (data: { email: string; password: string }) => {
    try {
      console.log('Login submit:', data);
      await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });
      // Navigate to dashboard on successful login
      navigate({ to: '/finance/dashboard', replace: true });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleSignupSubmit = async (data: { name: string; email: string; password: string; confirmPassword: string }) => {
    try {
      console.log('Signup submit:', data);
      await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      // Navigate to dashboard on successful signup
      navigate({ to: '/finance/dashboard', replace: true });
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login');
    // TODO: Connect to Google OAuth
  };

  const handleAppleLogin = () => {
    console.log('Apple login');
    // TODO: Connect to Apple OAuth
  };

  const handleXLogin = () => {
    console.log('X login');
    // TODO: Connect to X OAuth
  };

  const switchToSignup = () => setAuthMode('signup');
  const switchToLogin = () => setAuthMode('login');

  return (
    <AuthLayout>
      <AuthCard>
        {authMode === 'login' ? (
          <LoginForm
            onSubmit={handleLoginSubmit}
            onGoogleLogin={handleGoogleLogin}
            onAppleLogin={handleAppleLogin}
            onXLogin={handleXLogin}
            onSwitchToSignup={switchToSignup}
          />
        ) : (
          <SignupForm
            onSubmit={handleSignupSubmit}
            onSwitchToLogin={switchToLogin}
          />
        )}
      </AuthCard>
    </AuthLayout>
  );
}
