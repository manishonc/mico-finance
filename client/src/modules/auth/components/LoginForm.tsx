import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from './AuthLayout';

// --- Social Icons ---

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.02 3.65-.95 2.71.15 3.76 1.48 4.02 1.89-3.27 1.99-2.73 5.92.54 7.21-.66 1.45-1.57 2.89-3.29 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.16 2.29-1.99 4.26-3.74 4.25z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// --- Props ---

interface LoginFormProps {
  onSubmit?: (data: { email: string; password: string }) => void;
  onGoogleLogin?: () => void;
  onAppleLogin?: () => void;
  onXLogin?: () => void;
  onSwitchToSignup?: () => void;
}

// --- Main Component ---

export function LoginForm({
  onSubmit,
  onGoogleLogin,
  onAppleLogin,
  onXLogin,
  onSwitchToSignup,
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ email, password });
  };

  return (
    <>
      <Logo />
      
      <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">
        Welcome Back
      </h1>
      
      <p className="text-sm text-gray-500 mb-8">
        Don't have an account yet?{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-gray-300 hover:text-white transition-colors font-medium"
        >
          Sign up
        </button>
      </p>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        
        {/* Email Input */}
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-white">
            <Mail size={18} />
          </div>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email address"
            className="w-full bg-[#161616] text-sm text-white placeholder-gray-600 border border-transparent rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:bg-[#1a1a1a] focus:border-white/10 transition-all duration-200"
          />
        </div>

        {/* Password Input */}
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-white">
            <Lock size={18} />
          </div>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-[#161616] text-sm text-white placeholder-gray-600 border border-transparent rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:bg-[#1a1a1a] focus:border-white/10 transition-all duration-200"
          />
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white text-sm font-medium py-3 rounded-lg transition-all duration-200 shadow-[0_0_20px_rgba(0,112,243,0.3)] hover:shadow-[0_0_25px_rgba(0,112,243,0.5)] active:scale-[0.98]"
        >
          Login
        </Button>

        {/* Divider */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
            <span className="bg-card px-2 text-gray-600 font-medium">or</span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={onAppleLogin}
            className="flex items-center justify-center py-2.5 bg-[#161616] hover:bg-[#222] border border-transparent hover:border-white/5 rounded-lg transition-all duration-200 group"
          >
            <div className="opacity-70 group-hover:opacity-100 transition-opacity">
              <AppleIcon />
            </div>
          </button>
          
          <button
            type="button"
            onClick={onGoogleLogin}
            className="flex items-center justify-center py-2.5 bg-[#161616] hover:bg-[#222] border border-transparent hover:border-white/5 rounded-lg transition-all duration-200 group"
          >
             <div className="opacity-70 group-hover:opacity-100 transition-opacity">
               <GoogleIcon />
             </div>
          </button>

          <button
            type="button"
            onClick={onXLogin}
            className="flex items-center justify-center py-2.5 bg-[#161616] hover:bg-[#222] border border-transparent hover:border-white/5 rounded-lg transition-all duration-200 group"
          >
            <div className="opacity-70 group-hover:opacity-100 transition-opacity">
              <XIcon />
            </div>
          </button>
        </div>

      </form>
    </>
  );
}
