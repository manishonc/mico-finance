import React from 'react';

// --- Assets & Icons ---

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

// --- Main Layout Component ---

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative w-full h-screen bg-background overflow-hidden flex items-center justify-center font-sans text-white selection:bg-primary selection:text-white">
      
      {/* --- Background Circuitry --- */}
      <CircuitLines />
      <ChipNode position="top-left" />
      <ChipNode position="top-right" />
      <ChipNode position="bottom-left" />
      <ChipNode position="bottom-right" />

      {children}
      
    </div>
  );
}

export { Logo, ChipNode, CircuitLines };
