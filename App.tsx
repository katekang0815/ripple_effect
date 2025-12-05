import React, { useState } from 'react';
import RippleBackground from './components/RippleBackground';
import UIOverlay from './components/UIOverlay';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden text-[#1a1a1a]">
      {/* Background Layer - WebGL Ripple */}
      <div className="absolute inset-0 z-0">
        <RippleBackground />
      </div>

      {/* Foreground Layer - UI & Content */}
      <div className="relative z-10 w-full h-full flex flex-col pointer-events-none">
        <Navigation menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <UIOverlay />
      </div>

      {/* Interactive Cursor hint (optional) */}
      <div className="absolute bottom-8 left-8 z-20 hidden md:block opacity-50 text-xs tracking-widest uppercase pointer-events-none mix-blend-difference text-white">
        Interact with the surface
      </div>
    </div>
  );
};

export default App;