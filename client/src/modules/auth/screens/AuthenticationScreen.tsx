import { useState } from 'react';
import { AuthLayout, AuthCard, LoginForm, SignupForm } from '../components';
import { authClient } from '@/lib/auth-clients';

type AuthMode = 'login' | 'signup';

export default function AuthenticationScreen() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const handleLoginSubmit = (data: { email: string; password: string }) => {
    console.log('Login submit:', data);
    authClient.signIn.email({
      email: data.email,
      password: data.password,
    });
  };

  const handleSignupSubmit = (data: { name: string; email: string; password: string; confirmPassword: string }) => {
    console.log('Signup submit:', data);
    authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });
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
