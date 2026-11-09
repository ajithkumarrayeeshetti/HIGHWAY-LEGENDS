import React, { useState } from 'react';
import { WorldLocation, GameScreen } from '../../types/game';
import { sound } from '../../utils/audio';
import {
  MapPin,
  Lock,
  Flag,
  Trophy,
  Play,
  ZoomIn,
  ZoomOut,
  ChevronRight,
  Info
} from 'lucide-react';

interface Screen04WorldMapProps {
  locations: WorldLocation[];
  onSelectLocationRace: (loc: WorldLocation) => void;
  onNavigate: (screen: GameScreen) => void;
}

export const Screen04WorldMap: React.FC<Screen04WorldMapProps> = ({
  locations,
  onSelectLocationRace,
  onNavigate
}) => {
  const [selectedLoc, setSelectedLoc] = useState<WorldLocation>(locations[0]);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoom = (delta: number) => {
    sound.playClick();
    setZoomLevel((prev) => Math.max(0.9, Math.min(1.4, prev + delta)));
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] bg-[#08090D] overflow-hidden select-none flex flex-col justify-between">
      {/* Top Map Header */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 p-4 sm:p-6 bg-[#08090D]/85 backdrop-blur-md border-b border-white/10">
        <div>
          <div className="text-[10px] font-racing font-bold tracking-[0.3em] text-[#FF8A32] uppercase">
            Fictional Racing Continent
          </div>
          <h1 className="text-2xl sm:text-4xl font-racing font-black text-white uppercase tracking-tight">
            AURELIA <span className="text-[#FF3434]">WORLD MAP</span>
          </h1>
        </div>

        {/* Zoom Controls & Navigation Pills */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#171B24] border border-white/10 rounded overflow-hidden">
            <button
              onClick={() => handleZoom(0.15)}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-white/10" />
            <button
              onClick={() => handleZoom(-0.15)}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onNavigate('career');
            }}
            className="px-3.5 py-1.5 bg-[#171B24] hover:bg-[#202633] border border-white/10 text-white rounded text-xs font-racing font-bold uppercase tracking-wider transition-colors"
          >
            Career Mode
          </button>
        </div>
      </div>

      {/* Main Interactive Map Canvas Viewport */}
      <div className="relative flex-1 w-full min-h-[500px] overflow-hidden flex items-center justify-center bg-[#050608]">
        {/* Map Graphic with Zoom Transform */}
        <div
          className="relative w-full max-w-6xl aspect-[16/9] transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <img
            src="/src/assets/images/bg_aurelia_world_1794231147436.jpg"
            alt="Aurelia World Map"
            className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]"
            referrerPolicy="no-referrer"
          />

          {/* Interactive Hotspot Nodes */}
          {locations.map((loc) => {
            const isSelected = selectedLoc.id === loc.id;
            return (
              <button
                key={loc.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedLoc(loc);
                }}
                style={{ left: `${loc.mapX}%`, top: `${loc.mapY}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all z-10 ${
                  isSelected ? 'scale-125 z-20' : 'hover:scale-110'
                }`}
              >
                {/* Ping Beacon ring */}
                {loc.unlocked && (
                  <span className="absolute -inset-2 rounded-full bg-[#FF3434]/30 animate-ping opacity-75" />
                )}

                {/* Marker Pill Icon */}
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-xl transition-all ${
                    isSelected
                      ? 'bg-[#FF3434] text-white ring-2 ring-white/50'
                      : loc.unlocked
                      ? 'bg-[#171B24]/90 text-white border border-white/20 group-hover:border-[#FF3434]'
                      : 'bg-[#11141B]/80 text-slate-400 border border-white/5'
                  }`}
                >
                  {loc.unlocked ? (
                    <MapPin className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span className="text-[11px] font-racing font-bold tracking-wider uppercase whitespace-nowrap">
                    {loc.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Floating Location Inspector Panel (Bottom Right) */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-80 sm:w-96 racing-panel p-5 rounded border border-white/15 z-30 shadow-2xl">
          <div className="flex items-center justify-between text-xs text-[#A1A8B5] mb-1">
            <span className="text-[#FF8A32] font-racing font-bold uppercase tracking-wider">
              {selectedLoc.environmentType}
            </span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold">
              {selectedLoc.unlocked ? `${selectedLoc.completionPercent}% Mastery` : 'LOCKED'}
            </span>
          </div>

          <h3 className="text-2xl font-racing font-black text-white uppercase tracking-wide">
            {selectedLoc.name}
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {selectedLoc.description}
          </p>

          <div className="grid grid-cols-2 gap-3 my-4 py-3 border-y border-white/10 text-xs">
            <div>
              <div className="text-[10px] text-[#A1A8B5] uppercase">Events Available</div>
              <div className="text-sm font-speed font-bold text-white flex items-center gap-1 mt-0.5">
                <Flag className="w-3.5 h-3.5 text-[#27B9FF]" />
                <span>{selectedLoc.racesAvailable} Circuits</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#A1A8B5] uppercase">Sector Record</div>
              <div className="text-sm font-speed font-bold text-[#FFB547] flex items-center gap-1 mt-0.5">
                <Trophy className="w-3.5 h-3.5" />
                <span>{selectedLoc.bestLap}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedLoc.unlocked ? (
              <button
                onClick={() => {
                  sound.playSelect();
                  onSelectLocationRace(selectedLoc);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#FF3434] hover:bg-[#e02626] text-white rounded text-xs font-racing font-bold uppercase tracking-wider transition-colors shadow-lg shadow-red-600/30"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Launch Regional Event</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full py-2.5 bg-[#171B24] text-slate-500 rounded text-xs font-racing font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Region Locked · Unlock in Career</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
