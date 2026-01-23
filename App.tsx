import React, { useState } from 'react';
import RippleBackground from './components/RippleBackground';
import WaterControlsModal from './components/WaterControlsModal';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [intensity, setIntensity] = useState(0.8);
  const [responsiveness, setResponsiveness] = useState(0.08);
  const [dropSize, setDropSize] = useState(3.5);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#ECEBE9]">
      {/* Background Layer - WebGL Ripple */}
      <div className="absolute inset-0 z-0">
        <RippleBackground 
          intensity={intensity} 
          responsiveness={responsiveness} 
          dropSize={dropSize}
          bgImage={backgroundImage}
        />
      </div>

      {/* Foreground Layer - UI & Content */}
      <div className="relative z-10 w-full h-full flex flex-col pointer-events-none">
        <Navigation onOpenControls={() => setIsModalOpen(true)} isVisible={!isModalOpen} />
        
        {isModalOpen && (
          <WaterControlsModal 
            onClose={() => setIsModalOpen(false)}
            intensity={intensity}
            setIntensity={setIntensity}
            responsiveness={responsiveness}
            setResponsiveness={setResponsiveness}
            dropSize={dropSize}
            setDropSize={setDropSize}
            onSelectBg={setBackgroundImage}
          />
        )}

        {/* Branding Title - Always Visible */}
        <div className="absolute bottom-12 left-12 pointer-events-none select-none">
          <h1 className="text-8xl md:text-[12rem] font-bold tracking-tighter opacity-[0.03] leading-none uppercase">
            Fluid<br/>Surface
          </h1>
        </div>
      </div>
    </div>
  );
};

export default App;