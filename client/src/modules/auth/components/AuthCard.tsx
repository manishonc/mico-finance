import React from 'react';

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className = '' }: AuthCardProps) {
  return (
    <div className={`relative z-10 w-full max-w-[420px] p-8 mx-4 ${className}`}>
      
      {/* Card Background Layer (separate to handle glows/borders nicely) */}
      <div className="absolute inset-0 bg-card rounded-2xl border border-white/5 shadow-2xl shadow-black/80"></div>
      
      {/* Subtle Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      {/* Content Container */}
      <div className="relative flex flex-col items-center">
        {children}
      </div>
      
    </div>
  );
}
