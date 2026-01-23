import React from 'react';

interface NavigationProps {
  onOpenControls: () => void;
  isVisible: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ onOpenControls, isVisible }) => {
  return (
    <nav className="w-full p-6 md:p-10 flex justify-between items-center pointer-events-auto mix-blend-difference text-white">
      {/* Brand Logo / Name */}
      <div className="text-xl md:text-2xl font-bold tracking-tighter uppercase leading-none cursor-pointer group flex flex-col items-start">
        <span className="block">Off</span>
        <span className="block">Brand</span>
        <div className="h-[2px] w-0 group-hover:w-full bg-white transition-all duration-300 mt-1"></div>
      </div>

      {/* Control Trigger - Only visible when modal is closed */}
      <div className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <button 
          onClick={onOpenControls}
          className="flex items-center gap-3 group focus:outline-none bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/20 transition-all backdrop-blur-md"
          aria-label="Open Controls"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Controls</span>
          <div className="w-6 h-6 flex flex-col justify-center items-center gap-[4px]">
            <div className="w-5 h-[2px] bg-white"></div>
            <div className="w-5 h-[2px] bg-white opacity-50"></div>
            <div className="w-5 h-[2px] bg-white"></div>
          </div>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;