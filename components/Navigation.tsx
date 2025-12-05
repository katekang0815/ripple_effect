import React from 'react';

interface NavigationProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({ menuOpen, setMenuOpen }) => {
  return (
    <nav className="w-full p-6 md:p-10 flex justify-between items-start pointer-events-auto mix-blend-exclusion text-white">
      {/* Brand Logo / Name */}
      <div className="text-xl md:text-2xl font-bold tracking-tighter uppercase leading-none cursor-pointer group">
        <div>Off</div>
        <div>Brand</div>
        <div className="h-[2px] w-0 group-hover:w-full bg-white transition-all duration-300 mt-1"></div>
      </div>

      {/* Menu Trigger */}
      <button 
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex flex-col gap-[6px] group focus:outline-none"
        aria-label="Menu"
      >
        <div className={`w-8 h-[2px] bg-white transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-[8px]' : ''}`}></div>
        <div className={`w-8 h-[2px] bg-white transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`}></div>
        <div className={`w-8 h-[2px] bg-white transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`}></div>
      </button>

      {/* Fullscreen Menu Overlay */}
      <div className={`fixed inset-0 bg-black/95 z-50 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${menuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="h-full flex flex-col justify-center items-center text-center">
            <button 
                onClick={() => setMenuOpen(false)}
                className="absolute top-10 right-10 text-white text-sm uppercase tracking-widest hover:text-gray-400 transition-colors"
            >
                Close
            </button>
            <ul className="space-y-6">
                {['Work', 'Studio', 'Approach', 'Contact'].map((item, i) => (
                    <li key={item} className="overflow-hidden">
                        <a href="#" className="block text-5xl md:text-7xl font-bold text-transparent text-stroke hover:text-white transition-colors duration-300 font-sans tracking-tight">
                            {item}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;