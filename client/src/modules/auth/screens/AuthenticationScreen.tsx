import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// --- Assets & Icons ---

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

const Logo = () => (
  <div className="relative flex items-center justify-center w-12 h-12 mb-6">
    <div className="absolute inset-0 rounded-full border border-white/20 blur-[2px]"></div>
    <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center relative z-10 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
      <div className="w-full h-full rounded-full border-[3px] border-bg border-l-transparent rotate-45"></div>
    </div>
    {/* Decorative dots in logo area */}
    <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex space-x-1 opacity-20">
       {[...Array(3)].map((_, i) => <div key={i} className="w-1 h-1 rounded-full bg-white"></div>)}
    </div>
    <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex space-x-1 opacity-20">
       {[...Array(3)].map((_, i) => <div key={i} className="w-1 h-1 rounded-full bg-white"></div>)}
    </div>
  </div>
);

// --- Sub-Components ---

interface ChipNodeProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const ChipNode: React.FC<ChipNodeProps> = ({ position }) => {
  const isLeft = position.includes('left');
  
  return (
    <div className={`
      hidden md:flex absolute w-32 h-16 bg-card border border-white/10 rounded-md
      flex-col justify-center items-center p-2 z-0
      shadow-[0_0_30px_rgba(0,0,0,0.5)]
      ${position === 'top-left' ? 'top-16 left-16' : ''}
      ${position === 'top-right' ? 'top-16 right-16' : ''}
      ${position === 'bottom-left' ? 'bottom-16 left-16' : ''}
      ${position === 'bottom-right' ? 'bottom-16 right-16' : ''}
    `}>
      {/* Internal decoration */}
      <div className="flex items-center space-x-2 mb-1 w-full px-2">
         <div className="w-1 h-1 rounded-full bg-white/50"></div>
         <div className="h-[1px] bg-white/10 flex-grow"></div>
         <div className="w-1 h-1 rounded-full bg-white/50"></div>
      </div>
      <div className="w-full h-full flex items-center justify-center space-x-1 opacity-20">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-1 h-1 bg-white rounded-full"></div>
        ))}
      </div>
      
      {/* Outer Connectors */}
      <div className={`absolute ${isLeft ? '-left-4' : '-right-4'} top-1/2 -translate-y-1/2 flex flex-col space-y-2`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center">
            <div className={`w-4 h-[1px] bg-white/20 ${isLeft ? '' : 'order-last'}`}></div>
            <div className="w-1 h-1 bg-white/40 rounded-full"></div>
          </div>
        ))}
      </div>

       {/* Connection Point to Main Circuit */}
       <div className={`absolute ${isLeft ? '-right-1' : '-left-1'} top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]`}></div>
    </div>
  );
};

const CircuitLines = () => {
  return (
    <div className="absolute inset-0 pointer-events-none hidden md:block z-0 opacity-40">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
          </linearGradient>
        </defs>

        {/* 
          These paths approximate the circuit look. 
          Assuming standard desktop resolution proportions.
          Using percentages to keep it somewhat responsive.
        */}

        {/* Top Left Path */}
        <path 
          d="M 195 96 L 250 96 L 350 196 L 350 450 L 380 480 L 450 480" 
          fill="none" 
          stroke="url(#line-gradient)" 
          strokeWidth="1"
          className="opacity-50"
          vectorEffect="non-scaling-stroke"
        />
        {/* Top Right Path - Mirrored logic */}
        <path 
          d="M calc(100% - 195px) 96 L calc(100% - 250px) 96 L calc(100% - 350px) 196 L calc(100% - 350px) 450 L calc(100% - 380px) 480 L calc(100% - 450px) 480" 
          fill="none" 
          stroke="url(#line-gradient)" 
          strokeWidth="1"
          className="opacity-50"
          vectorEffect="non-scaling-stroke"
        />

         {/* Bottom Left Path */}
         <path 
          d="M 195 calc(100% - 96px) L 250 calc(100% - 96px) L 350 calc(100% - 196px) L 350 calc(100% - 450px) L 380 calc(100% - 480px) L 450 calc(100% - 480px)" 
          fill="none" 
          stroke="url(#line-gradient)" 
          strokeWidth="1"
          className="opacity-50"
          vectorEffect="non-scaling-stroke"
        />

        {/* Bottom Right Path */}
        <path 
          d="M calc(100% - 195px) calc(100% - 96px) L calc(100% - 250px) calc(100% - 96px) L calc(100% - 350px) calc(100% - 196px) L calc(100% - 350px) calc(100% - 450px) L calc(100% - 380px) calc(100% - 480px) L calc(100% - 450px) calc(100% - 480px)" 
          fill="none" 
          stroke="url(#line-gradient)" 
          strokeWidth="1"
          className="opacity-50"
          vectorEffect="non-scaling-stroke"
        />

      </svg>
    </div>
  );
}

// --- Main Component ---

export default function AuthenticationScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="relative w-full h-screen bg-bg overflow-hidden flex items-center justify-center font-sans text-white selection:bg-primary selection:text-white">
      
      {/* --- Background Circuitry --- */}
      <CircuitLines />
      <ChipNode position="top-left" />
      <ChipNode position="top-right" />
      <ChipNode position="bottom-left" />
      <ChipNode position="bottom-right" />

      {/* --- Main Card --- */}
      <div className="relative z-10 w-full max-w-[420px] p-8 mx-4">
        
        {/* Card Background Layer (separate to handle glows/borders nicely) */}
        <div className="absolute inset-0 bg-card rounded-2xl border border-white/5 shadow-2xl shadow-black/80"></div>
        
        {/* Subtle Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

        {/* Content Container */}
        <div className="relative flex flex-col items-center">
          
          <Logo />
          
          <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">
            Welcome Back
          </h1>
          
          <p className="text-sm text-gray-500 mb-8">
            Don't have an account yet? <a href="#" className="text-gray-300 hover:text-white transition-colors font-medium">Sign up</a>
          </p>

          <div className="w-full space-y-4">
            
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
              className="w-full bg-primary hover:bg-primary-hover text-white text-sm font-medium py-3 rounded-lg transition-all duration-200 shadow-[0_0_20px_rgba(0,112,243,0.3)] hover:shadow-[0_0_25px_rgba(0,112,243,0.5)] active:scale-[0.98]"
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
              <button className="flex items-center justify-center py-2.5 bg-[#161616] hover:bg-[#222] border border-transparent hover:border-white/5 rounded-lg transition-all duration-200 group">
                <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                  <AppleIcon />
                </div>
              </button>
              
              <button className="flex items-center justify-center py-2.5 bg-[#161616] hover:bg-[#222] border border-transparent hover:border-white/5 rounded-lg transition-all duration-200 group">
                 <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                   <GoogleIcon />
                 </div>
              </button>

              <button className="flex items-center justify-center py-2.5 bg-[#161616] hover:bg-[#222] border border-transparent hover:border-white/5 rounded-lg transition-all duration-200 group">
                <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                  <XIcon />
                </div>
              </button>
            </div>

          </div>
        </div>
      </div>
      
    </div>
  );
}
