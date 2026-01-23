import React from 'react';

interface WaterControlsModalProps {
  onClose: () => void;
  intensity: number;
  setIntensity: (val: number) => void;
  responsiveness: number;
  setResponsiveness: (val: number) => void;
  dropSize: number;
  setDropSize: (val: number) => void;
  onSelectBg: (url: string | null) => void;
}

const WaterControlsModal: React.FC<WaterControlsModalProps> = ({ 
  onClose, 
  intensity, 
  setIntensity, 
  responsiveness, 
  setResponsiveness,
  dropSize,
  setDropSize,
  onSelectBg
}) => {
  // Manually selected high-quality assets to match user screenshots perfectly:
  // 1. Bright teal caustic pool water
  const poolTexture = "https://images.unsplash.com/photo-1565138146061-e29b079736c0?auto=format&fit=crop&q=80&w=1200";
  // 2. Dense lily pad pond with white blossoms
  const whiteLilyTexture = "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&q=80&w=1200";
  // 3. Yellow water lilies on dark atmospheric water
  const yellowLilyTexture = "https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?auto=format&fit=crop&q=80&w=1200";
  // 4. Pink water lily on soft, bright background
  const pinkLilyTexture = "https://images.unsplash.com/photo-1528150230181-99bbf7b22162?auto=format&fit=crop&q=80&w=1200";
  // 5. Red Lily Pads (Vibrant Red/Magenta on Blue water)
  const redLilyTexture = "https://images.unsplash.com/photo-1465146633011-14f8e0781093?auto=format&fit=crop&q=80&w=1200";

  return (
    <div className="absolute top-6 right-6 md:top-10 md:right-10 z-50 pointer-events-none">
      {/* Glass Container */}
      <div className="relative w-[340px] md:w-[400px] 
        bg-white/10 backdrop-blur-[40px] saturate-[180%]
        text-[#1a1a1a] rounded-[32px] 
        shadow-[0_8px_32px_0_rgba(31,38,135,0.1),inset_0_0_0_1px_rgba(255,255,255,0.4),0_24px_48px_-12px_rgba(0,0,0,0.1)] 
        flex flex-col overflow-hidden pointer-events-auto 
        border border-white/20
        animate-in slide-in-from-top-4 fade-in duration-500 ease-out"
      >
        {/* Subtle Gloss Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none opacity-50" />
        
        {/* Header */}
        <div className="relative flex justify-between items-center px-8 py-6 border-b border-black/5">
          <h2 className="text-[12px] font-bold tracking-[0.1em] uppercase opacity-70">Water Controls</h2>
          <button 
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-black/5 hover:bg-black/10 transition-all border border-black/5 group focus:outline-none backdrop-blur-md"
            aria-label="Close"
          >
            <div className="w-3.5 h-[1.5px] bg-black opacity-40 group-hover:opacity-100 transition-opacity rounded-full"></div>
          </button>
        </div>

        {/* Content Body */}
        <div className="relative p-8 space-y-8">
          {/* Preset Section */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] opacity-30">Presets</h3>
            <div className="grid grid-cols-3 gap-3">
              {/* Preset 1: Pool */}
              <button 
                onClick={() => onSelectBg(poolTexture)}
                className="aspect-square bg-white/20 rounded-2xl border border-white/40 hover:scale-105 active:scale-95 transition-all cursor-pointer overflow-hidden relative group shadow-sm"
                title="Teal Pool"
              >
                <img src={poolTexture} alt="Teal Pool" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Preset 2: White Lilies */}
              <button 
                onClick={() => onSelectBg(whiteLilyTexture)}
                className="aspect-square bg-white/20 rounded-2xl border border-white/40 hover:scale-105 active:scale-95 transition-all cursor-pointer overflow-hidden relative group shadow-sm"
                title="White Lilies"
              >
                <img src={whiteLilyTexture} alt="White Lilies" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Preset 3: Yellow Lilies */}
              <button 
                onClick={() => onSelectBg(yellowLilyTexture)}
                className="aspect-square bg-white/20 rounded-2xl border border-white/40 hover:scale-105 active:scale-95 transition-all cursor-pointer overflow-hidden relative group shadow-sm"
                title="Yellow Lilies"
              >
                <img src={yellowLilyTexture} alt="Yellow Lilies" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Preset 4: Pink Lily */}
              <button 
                onClick={() => onSelectBg(pinkLilyTexture)}
                className="aspect-square bg-white/20 rounded-2xl border border-white/40 hover:scale-105 active:scale-95 transition-all cursor-pointer overflow-hidden relative group shadow-sm"
                title="Pink Lily"
              >
                <img src={pinkLilyTexture} alt="Pink Lily" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Preset 5: Red Pads (New) */}
              <button 
                onClick={() => onSelectBg(redLilyTexture)}
                className="aspect-square bg-white/20 rounded-2xl border border-white/40 hover:scale-105 active:scale-95 transition-all cursor-pointer overflow-hidden relative group shadow-sm"
                title="Red Lily Pads"
              >
                <img src={redLilyTexture} alt="Red Lily Pads" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Reset Preset */}
              <button 
                onClick={() => onSelectBg(null)}
                className="aspect-square bg-black/5 rounded-2xl border border-black/5 hover:scale-105 active:scale-95 transition-all cursor-pointer flex flex-col items-center justify-center group shadow-sm text-[8px] font-bold uppercase tracking-tighter"
              >
                <div className="w-6 h-6 border border-black/10 rounded-full mb-1 flex items-center justify-center group-hover:border-black/30 transition-colors">
                  <svg className="w-3 h-3 opacity-40 group-hover:opacity-80 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                Reset
              </button>

              {/* Placeholder slots */}
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i} 
                  className="aspect-square bg-white/10 rounded-2xl border border-white/20 opacity-30 cursor-not-allowed"
                />
              ))}
            </div>
          </div>

          {/* Controls Section */}
          <div className="bg-white/20 backdrop-blur-md rounded-[24px] p-6 space-y-8 border border-white/30 shadow-inner">
            <div className="flex items-center gap-2 mb-2 opacity-40">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 12H13.5" />
              </svg>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Engine Params</span>
            </div>

            {/* Drop Size Control */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                  <span className="opacity-50">Drop Size</span>
                  <div className="w-3.5 h-3.5 border border-black/10 rounded-full flex items-center justify-center text-[7px] opacity-40 cursor-help bg-white/40">?</div>
                </div>
                <span className="bg-white/40 px-2.5 py-1 rounded-full text-[9px] font-black shadow-sm">
                  {((8.0 - dropSize) * 10).toFixed(0)}PX
                </span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="7.5" 
                step="0.1" 
                value={8.0 - dropSize} 
                onChange={(e) => setDropSize(8.0 - parseFloat(e.target.value))}
                className="w-full appearance-none bg-black/5 h-[3px] rounded-full outline-none cursor-pointer accent-black/80 hover:accent-black transition-all"
              />
            </div>

            {/* Drop Strength Control */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                  <span className="opacity-50">Drop Strength</span>
                  <div className="w-3.5 h-3.5 border border-black/10 rounded-full flex items-center justify-center text-[7px] opacity-40 cursor-help bg-white/40">?</div>
                </div>
                <span className="bg-white/40 px-2.5 py-1 rounded-full text-[9px] font-black shadow-sm">
                  {intensity.toFixed(1)}X
                </span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="3.0" 
                step="0.1" 
                value={intensity} 
                onChange={(e) => setIntensity(parseFloat(e.target.value))}
                className="w-full appearance-none bg-black/5 h-[3px] rounded-full outline-none cursor-pointer accent-black/80 hover:accent-black transition-all"
              />
            </div>

            {/* Responsiveness Control */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                  <span className="opacity-50">Responsiveness</span>
                  <div className="w-3.5 h-3.5 border border-black/10 rounded-full flex items-center justify-center text-[7px] opacity-40 cursor-help bg-white/40">?</div>
                </div>
                <span className="bg-white/40 px-2.5 py-1 rounded-full text-[9px] font-black shadow-sm">
                  {(responsiveness * 100).toFixed(0)}%
                </span>
              </div>
              <input 
                type="range" 
                min="0.01" 
                max="0.4" 
                step="0.01" 
                value={responsiveness} 
                onChange={(e) => setResponsiveness(parseFloat(e.target.value))}
                className="w-full appearance-none bg-black/5 h-[3px] rounded-full outline-none cursor-pointer accent-black/80 hover:accent-black transition-all"
              />
            </div>
          </div>
        </div>

        {/* Gloss Bottom Edge */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-t from-white/20 to-transparent" />
      </div>
    </div>
  );
};

export default WaterControlsModal;