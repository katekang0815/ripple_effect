import React from 'react';

const UIOverlay: React.FC = () => {
  return (
    <main className="flex-1 flex flex-col justify-center items-center w-full h-full relative p-4 md:p-20">
      
      {/* Decorative lines/grids */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-0 left-1/4 w-px h-full bg-black"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-black"></div>
        <div className="absolute top-1/2 left-0 w-full h-px bg-black"></div>
      </div>

      {/* Main Typography Layout */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-7xl mx-auto mix-blend-darken">
        
        {/* Top Word */}
        <div className="w-full flex justify-start md:-ml-20">
          <h1 className="text-[12vw] md:text-[9vw] leading-[0.85] font-bold tracking-tighter text-[#1a1a1a] opacity-90 hover:opacity-100 transition-opacity duration-500 select-none">
            INDEPENDENT
          </h1>
        </div>

        {/* Middle Section with Circle Placeholder visual alignment */}
        <div className="w-full flex justify-end items-center relative md:-mr-12 my-2 md:my-0">
           <div className="hidden md:block w-24 h-px bg-[#1a1a1a] mr-8"></div>
           <h1 className="text-[12vw] md:text-[9vw] leading-[0.85] font-bold tracking-tighter text-[#1a1a1a] opacity-90 hover:opacity-100 transition-opacity duration-500 select-none text-right">
            CREATIVE
          </h1>
        </div>

        {/* Bottom Word */}
        <div className="w-full flex justify-center md:justify-start md:pl-32 relative">
          <h1 className="text-[12vw] md:text-[9vw] leading-[0.85] font-bold tracking-tighter text-[#1a1a1a] opacity-90 hover:opacity-100 transition-opacity duration-500 select-none">
            APPROACH
          </h1>
          
          {/* Small badge/tag */}
          <div className="absolute -bottom-12 right-0 md:right-auto md:left-full md:ml-8 flex items-center gap-2">
             <div className="w-3 h-3 bg-[#FF5E3A] rounded-full animate-pulse"></div>
             <span className="text-xs font-mono uppercase tracking-widest text-gray-500">
                Est. 2024
             </span>
          </div>
        </div>
      </div>

      {/* Footer / Bottom Info */}
      <div className="absolute bottom-10 right-10 md:w-64 text-right pointer-events-auto">
        <p className="text-sm md:text-base font-medium leading-tight text-gray-800">
          We build digital experiences that defy expectations and define new standards.
        </p>
        <a href="#" className="inline-block mt-4 text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-[#FF5E3A] hover:border-[#FF5E3A] transition-colors">
            Get in touch
        </a>
      </div>
    </main>
  );
};

export default UIOverlay;