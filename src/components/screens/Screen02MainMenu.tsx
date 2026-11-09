import React from 'react';
import { GameScreen, PlayerProfile, Vehicle } from '../../types/game';
import { sound } from '../../utils/audio';
import {
  Play,
  Trophy,
  Compass,
  Wrench,
  Flame,
  Award,
  ChevronRight,
  Zap,
  Target
} from 'lucide-react';

interface Screen02MainMenuProps {
  player: PlayerProfile;
  activeVehicle: Vehicle;
  onNavigate: (screen: GameScreen) => void;
  onQuickRace: () => void;
}

export const Screen02MainMenu: React.FC<Screen02MainMenuProps> = ({
  activeVehicle,
  onNavigate,
  onQuickRace
}) => {
  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] flex flex-col justify-between p-4 sm:p-8 lg:p-12 overflow-x-hidden select-none">
      {/* Background Cinematic Hypercar */}
      <img
        src="/src/assets/images/hero_red_hypercar_1794231144350.jpg"
        alt="Highway Legends Main Menu"
        className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.75] contrast-105"
        referrerPolicy="no-referrer"
      />

      {/* Atmospheric dark gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#08090D] via-[#08090D]/75 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-transparent to-[#08090D]/50" />

      {/* Main Content Area */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
        {/* Left Column: Navigation & Primary CTAs */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#171B24]/90 border border-white/10 text-xs font-semibold text-[#FF8A32] uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FF3434]" />
              Season 01: Apex Dominion Active
            </div>

            <h1 className="text-4xl sm:text-6xl font-racing font-black uppercase tracking-tight text-white leading-tight">
              HIGHWAY <span className="text-[#FF3434]">LEGENDS</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-medium max-w-lg mt-2">
              Rule the asphalt of Aurelia. Defeat Marcus Steel, conquer the desert canyons, and dethrone champion Victor Blaze.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={() => {
                sound.playSelect();
                onNavigate('race-select');
              }}
              className="group relative h-14 flex items-center justify-center gap-3 px-8 bg-[#FF3434] hover:bg-[#e02626] text-white font-racing font-black text-lg sm:text-xl uppercase tracking-wider rounded shadow-xl shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer touch-manipulation"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Start Racing</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                sound.playSelect();
                onNavigate('career');
              }}
              className="h-14 flex items-center justify-center gap-2.5 px-6 bg-[#171B24] hover:bg-[#202633] text-white font-racing font-bold text-base sm:text-lg uppercase tracking-wider border border-white/15 rounded transition-all hover:border-[#FF3434] cursor-pointer touch-manipulation active:scale-[0.98]"
            >
              <Trophy className="w-4 h-4 text-[#FFB547]" />
              <span>Continue Career</span>
            </button>

            <button
              onClick={() => {
                sound.playSelect();
                onQuickRace();
              }}
              className="h-14 flex items-center justify-center gap-2.5 px-6 bg-[#11141B]/90 hover:bg-[#1a1f2b] text-slate-300 hover:text-white font-racing font-bold text-base uppercase tracking-wider border border-white/10 rounded transition-all cursor-pointer touch-manipulation active:scale-[0.98]"
            >
              <Zap className="w-4 h-4 text-[#27B9FF]" />
              <span>Quick Race</span>
            </button>
          </div>

          {/* Secondary Sub-Navigation Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-4">
            {[
              { id: 'garage', label: 'Garage', icon: Wrench, color: 'text-[#27B9FF]' },
              { id: 'world-map', label: 'World Map', icon: Compass, color: 'text-[#35D58A]' },
              { id: 'daily-challenges', label: 'Challenges', icon: Target, color: 'text-[#FF8A32]' },
              { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, color: 'text-[#FFB547]' },
              { id: 'achievements', label: 'Achievements', icon: Award, color: 'text-purple-400' },
              { id: 'profile', label: 'Profile', icon: Flame, color: 'text-[#FF3434]' }
            ].map((nav) => {
              const Icon = nav.icon;
              return (
                <button
                  key={nav.id}
                  onClick={() => {
                    sound.playClick();
                    onNavigate(nav.id as GameScreen);
                  }}
                  className="h-11 flex items-center gap-2.5 px-3.5 bg-[#171B24]/90 hover:bg-[#202633] border border-white/10 hover:border-[#FF3434]/40 rounded transition-all text-left group cursor-pointer touch-manipulation active:scale-[0.98]"
                >
                  <Icon className={`w-4 h-4 ${nav.color}`} />
                  <span className="text-xs font-racing font-bold tracking-wide uppercase text-slate-200 group-hover:text-white truncate">
                    {nav.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Featured Cards Strip */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Featured Active Car Preview */}
          <div
            onClick={() => {
              sound.playClick();
              onNavigate('garage');
            }}
            className="racing-panel p-4 rounded cursor-pointer hover:border-[#FF3434]/50 transition-all group"
          >
            <div className="flex items-center justify-between text-xs text-[#A1A8B5] mb-2">
              <span className="uppercase font-semibold tracking-wider">Active Vehicle</span>
              <span className="px-2 py-0.5 rounded bg-[#FF3434]/20 text-[#FF3434] font-racing font-bold">
                CLASS {activeVehicle.class}
              </span>
            </div>

            <div className="text-xl font-racing font-black text-white group-hover:text-[#FF3434] transition-colors">
              {activeVehicle.name}
            </div>
            <div className="text-xs text-[#A1A8B5] mb-3">{activeVehicle.subtitle}</div>

            {/* Quick Stats Bars */}
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between text-slate-300">
                <span>Top Speed</span>
                <span className="font-mono-nums font-bold text-white">{activeVehicle.currentStats.topSpeed} KM/H</span>
              </div>
              <div className="w-full h-1 bg-[#11141B] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FF3434]"
                  style={{ width: `${(activeVehicle.currentStats.topSpeed / 450) * 100}%` }}
                />
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Acceleration</span>
                <span className="font-mono-nums font-bold text-white">{activeVehicle.currentStats.acceleration}/100</span>
              </div>
              <div className="w-full h-1 bg-[#11141B] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#27B9FF]"
                  style={{ width: `${activeVehicle.currentStats.acceleration}%` }}
                />
              </div>
            </div>

            <div className="mt-3 text-right text-xs text-[#27B9FF] font-semibold flex items-center justify-end gap-1">
              <span>Showroom & Tune</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Featured Event: Aurelia Desert Grand Prix */}
          <div
            onClick={() => {
              sound.playClick();
              onNavigate('race-select');
            }}
            className="racing-panel p-4 rounded cursor-pointer hover:border-[#FF8A32]/50 transition-all group"
          >
            <div className="flex items-center justify-between text-xs text-[#A1A8B5] mb-2">
              <span className="uppercase font-semibold tracking-wider text-[#FF8A32]">Featured Event</span>
              <span className="text-[10px] text-slate-400">Ends in 14h</span>
            </div>

            <div className="text-xl font-racing font-black text-white group-hover:text-[#FF8A32] transition-colors">
              Aurelia Desert Grand Prix
            </div>
            <div className="text-xs text-[#A1A8B5] mb-3">12.5 KM · Scorched Sand Canyons</div>

            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div>
                <div className="text-[10px] text-[#A1A8B5] uppercase">Reward</div>
                <div className="font-speed font-bold text-[#FFB547]">35,000 CR</div>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <div>
                <div className="text-[10px] text-[#A1A8B5] uppercase">XP Reward</div>
                <div className="font-speed font-bold text-[#35D58A]">+5,000 XP</div>
              </div>
            </div>

            <div className="mt-3 text-right text-xs text-[#FF8A32] font-semibold flex items-center justify-end gap-1">
              <span>Enter Event</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Daily Challenge Snapshot */}
          <div
            onClick={() => {
              sound.playClick();
              onNavigate('daily-challenges');
            }}
            className="racing-panel p-4 rounded cursor-pointer hover:border-[#35D58A]/50 transition-all"
          >
            <div className="flex items-center justify-between text-xs text-[#A1A8B5] mb-1.5">
              <span className="uppercase font-semibold tracking-wider text-[#35D58A]">Daily Objective</span>
              <span className="text-[10px] text-slate-400">1/5 Complete</span>
            </div>
            <div className="text-base font-racing font-bold text-white">Execute 10 Near Misses</div>
            <div className="text-xs text-[#A1A8B5] mt-0.5">Progress: 8 / 10</div>
            <div className="w-full h-1.5 bg-[#11141B] rounded-full overflow-hidden mt-2">
              <div className="h-full bg-[#35D58A]" style={{ width: '80%' }} />
            </div>
          </div>

          {/* Rival Challenger Intel */}
          <div
            onClick={() => {
              sound.playClick();
              onNavigate('career');
            }}
            className="racing-panel p-4 rounded cursor-pointer hover:border-red-500/50 transition-all"
          >
            <div className="flex items-center justify-between text-xs text-[#A1A8B5] mb-1.5">
              <span className="uppercase font-semibold tracking-wider text-[#FF3434]">Rival Intel</span>
              <span className="text-[10px] text-red-400">Chapter 06 Boss</span>
            </div>
            <div className="text-base font-racing font-bold text-white">Victor Blaze</div>
            <div className="text-xs text-slate-300 italic">"The highway belongs to predators."</div>
            <div className="mt-2 text-xs text-[#FF3434] font-semibold flex items-center justify-end gap-1">
              <span>Career Roadmap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Ticker / Brand Footer */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs text-[#A1A8B5]">
        <div className="flex items-center gap-4">
          <span className="text-white font-racing font-bold tracking-wider">AURELIA MOTORSPORT</span>
          <span>Patch 1.4.0 Live</span>
          <span className="hidden sm:inline">6 Biomes · 15 Vehicles · 6 Career Chapters</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('settings');
            }}
            className="hover:text-white transition-colors"
          >
            Controls & Audio Settings
          </button>
          <span>·</span>
          <span className="text-slate-400">Highway Legends © 2026</span>
        </div>
      </div>
    </div>
  );
};
