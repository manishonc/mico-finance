import React, { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from './AuthLayout';

// --- Props ---

interface SignupFormProps {
  onSubmit?: (data: { name: string; email: string; password: string; confirmPassword: string }) => void;
  onSwitchToLogin?: () => void;
}

// --- Main Component ---

export function SignupForm({
  onSubmit,
  onSwitchToLogin,
}: SignupFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ name, email, password, confirmPassword });
  };

  return (
    <>
      <Logo />
      
      <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">
        Create Account
      </h1>
      
      <p className="text-sm text-gray-500 mb-8">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-gray-300 hover:text-white transition-colors font-medium"
        >
          Login
        </button>
      </p>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        
        {/* Name Input */}
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-white">
            <User size={18} />
          </div>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="w-full bg-[#161616] text-sm text-white placeholder-gray-600 border border-transparent rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:bg-[#1a1a1a] focus:border-white/10 transition-all duration-200"
          />
        </div>

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

        {/* Confirm Password Input */}
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-white">
            <Lock size={18} />
          </div>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            className="w-full bg-[#161616] text-sm text-white placeholder-gray-600 border border-transparent rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:bg-[#1a1a1a] focus:border-white/10 transition-all duration-200"
          />
        </div>

        {/* Signup Button */}
        <Button 
          type="submit"
          className="w-full bg-primary hover:bg-primary-hover text-white text-sm font-medium py-3 rounded-lg transition-all duration-200 shadow-[0_0_20px_rgba(0,112,243,0.3)] hover:shadow-[0_0_25px_rgba(0,112,243,0.5)] active:scale-[0.98]"
        >
          Create Account
        </Button>

      </form>
    </>
  );
}
