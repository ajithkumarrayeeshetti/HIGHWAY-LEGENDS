import React from 'react';
import { RaceLiveState, RaceEvent, GameScreen } from '../../types/game';
import { sound } from '../../utils/audio';
import {
  Play,
  RotateCcw,
  Settings,
  Home,
  Gauge,
  Trophy,
  MapPin
} from 'lucide-react';

interface Screen09PauseMenuProps {
  event: RaceEvent;
  liveState: RaceLiveState;
  onResume: () => void;
  onRestart: () => void;
  onOpenSettings: () => void;
  onMainMenu: () => void;
}

export const Screen09PauseMenu: React.FC<Screen09PauseMenuProps> = ({
  event,
  liveState,
  onResume,
  onRestart,
  onOpenSettings,
  onMainMenu
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none animate-fadeIn">
      <div className="w-full max-w-lg racing-panel-glow p-6 sm:p-8 rounded-xl border border-white/20 shadow-2xl space-y-6">
        {/* Title */}
        <div className="text-center">
          <div className="text-[10px] font-racing font-bold tracking-[0.3em] text-[#FF8A32] uppercase">
            Highway Legends · Paused
          </div>
          <h2 className="text-3xl sm:text-4xl font-racing font-black text-white uppercase tracking-tight mt-1">
            RACE <span className="text-[#FF3434]">SUSPENDED</span>
          </h2>
          <div className="text-xs text-[#A1A8B5] mt-1">{event.title} · {event.location}</div>
        </div>

        {/* Live Race Snapshot Stats */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-[#11141B] rounded-lg border border-white/10 text-center">
          <div>
            <div className="text-[10px] text-[#A1A8B5] uppercase">Distance</div>
            <div className="text-lg font-speed font-bold text-white mt-0.5">
              {(liveState.distanceMeters / 1000).toFixed(2)} <span className="text-xs text-slate-400">KM</span>
            </div>
          </div>

          <div className="border-x border-white/10">
            <div className="text-[10px] text-[#A1A8B5] uppercase">Current Speed</div>
            <div className="text-lg font-speed font-bold text-[#FF3434] mt-0.5">
              {liveState.speedKmh} <span className="text-xs text-slate-400">KM/H</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] text-[#A1A8B5] uppercase">Score</div>
            <div className="text-lg font-speed font-bold text-[#27B9FF] mt-0.5">
              {liveState.score.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Action Menu Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => {
              sound.playSelect();
              onResume();
            }}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#FF3434] hover:bg-[#e02626] text-white rounded text-sm font-racing font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-600/30"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Resume Race</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#171B24] hover:bg-[#202633] text-white border border-white/10 rounded text-sm font-racing font-bold uppercase tracking-wider transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-[#FF8A32]" />
            <span>Restart Race</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#171B24] hover:bg-[#202633] text-white border border-white/10 rounded text-sm font-racing font-bold uppercase tracking-wider transition-colors"
          >
            <Settings className="w-4 h-4 text-[#27B9FF]" />
            <span>Settings & Controls</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onMainMenu();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#11141B] hover:bg-[#1a1f2b] text-slate-400 hover:text-white border border-white/5 rounded text-sm font-racing font-bold uppercase tracking-wider transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Abandon to Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
