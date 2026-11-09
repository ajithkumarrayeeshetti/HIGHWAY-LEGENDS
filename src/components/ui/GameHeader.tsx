import React from 'react';
import { PlayerProfile, GameScreen } from '../../types/game';
import { sound } from '../../utils/audio';
import {
  Coins,
  Shield,
  Wrench,
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
  Maximize2,
  ChevronLeft
} from 'lucide-react';

interface GameHeaderProps {
  player: PlayerProfile;
  currentScreen: GameScreen;
  onNavigate: (screen: GameScreen) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  showBack?: boolean;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  player,
  currentScreen,
  onNavigate,
  isMuted,
  onToggleMute,
  showBack = true
}) => {
  const toggleFullscreen = () => {
    sound.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const xpPercent = Math.min(100, Math.round((player.xp / player.nextLevelXp) * 100));

  return (
    <header className="relative z-30 flex items-center justify-between gap-4 px-4 sm:px-8 py-3 bg-[#08090D]/90 backdrop-blur-md border-b border-white/10 select-none">
      {/* Left: Back / Brand Wordmark */}
      <div className="flex items-center gap-4">
        {showBack && currentScreen !== 'main-menu' && currentScreen !== 'intro' && (
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('main-menu');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white bg-[#171B24] hover:bg-[#1f2533] border border-white/10 rounded transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-[#FF3434]" />
            <span className="hidden sm:inline">Main Menu</span>
          </button>
        )}

        <div
          onClick={() => {
            sound.playClick();
            onNavigate('main-menu');
          }}
          className="cursor-pointer group flex items-baseline gap-2"
        >
          <span className="text-lg sm:text-xl font-racing font-black tracking-widest text-white group-hover:text-[#FF3434] transition-colors">
            HIGHWAY<span className="text-[#FF3434]">LEGENDS</span>
          </span>
          <span className="hidden md:inline text-[10px] tracking-widest text-[#A1A8B5] uppercase font-semibold">
            Born to Drive
          </span>
        </div>
      </div>

      {/* Center: Player Driver Status (Level, XP, Currency) */}
      <div className="hidden lg:flex items-center gap-6 px-4 py-1.5 bg-[#11141B] rounded border border-white/5">
        {/* Callsign & Level */}
        <div
          onClick={() => {
            sound.playClick();
            onNavigate('profile');
          }}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-90"
        >
          <div className="w-7 h-7 rounded bg-[#FF3434] text-white flex items-center justify-center font-racing font-black text-xs">
            {player.level}
          </div>
          <div>
            <div className="text-xs font-bold tracking-wide text-white flex items-center gap-1.5">
              <span>{player.callsign}</span>
              <span className="text-[10px] text-[#A1A8B5]">LVL {player.level}</span>
            </div>
            {/* XP Bar */}
            <div className="w-24 h-1.5 bg-[#171B24] rounded-full overflow-hidden mt-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#FF8A32] to-[#FF3434]"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="w-px h-5 bg-white/10" />

        {/* Coins */}
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-[#FFB547]" />
          <span className="text-xs font-speed font-bold text-white tracking-wider">
            {player.coins.toLocaleString()}
          </span>
          <span className="text-[10px] text-[#A1A8B5] uppercase">CR</span>
        </div>

        <div className="w-px h-5 bg-white/10" />

        {/* Reputation */}
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#27B9FF]" />
          <span className="text-xs font-speed font-bold text-white tracking-wider">
            {player.reputation.toLocaleString()}
          </span>
          <span className="text-[10px] text-[#A1A8B5] uppercase">REP</span>
        </div>
      </div>

      {/* Right: Quick Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Garage shortcut */}
        {currentScreen !== 'garage' && (
          <button
            onClick={() => {
              sound.playSelect();
              onNavigate('garage');
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded bg-[#171B24] hover:bg-[#1f2533] text-slate-300 hover:text-white border border-white/10 transition-all"
            title="Open Garage Showroom"
          >
            <Wrench className="w-3.5 h-3.5 text-[#27B9FF]" />
            <span>Garage</span>
          </button>
        )}

        {/* Quick Settings shortcut */}
        {currentScreen !== 'settings' && (
          <button
            onClick={() => {
              sound.playSelect();
              onNavigate('settings');
            }}
            className="p-2 text-slate-300 hover:text-white bg-[#171B24] hover:bg-[#1f2533] border border-white/10 rounded transition-colors"
            title="Audio & Graphics Settings"
          >
            <SettingsIcon className="w-4 h-4 text-slate-300" />
          </button>
        )}

        {/* Audio Mute Toggle */}
        <button
          onClick={() => {
            sound.playClick();
            onToggleMute();
          }}
          className="p-2 text-slate-300 hover:text-white bg-[#171B24] hover:bg-[#1f2533] border border-white/10 rounded transition-colors"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-[#FF3434]" /> : <Volume2 className="w-4 h-4 text-[#35D58A]" />}
        </button>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="p-2 text-slate-300 hover:text-white bg-[#171B24] hover:bg-[#1f2533] border border-white/10 rounded transition-colors"
          title="Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
