import React from 'react';
import { CareerChapter, GameScreen } from '../../types/game';
import { sound } from '../../utils/audio';
import {
  Trophy,
  Lock,
  CheckCircle2,
  Play,
  Coins,
  Sparkles,
  MapPin,
  UserCheck
} from 'lucide-react';

interface Screen03CareerProps {
  chapters: CareerChapter[];
  onStartChapter: (chapter: CareerChapter) => void;
  onNavigate: (screen: GameScreen) => void;
}

export const Screen03Career: React.FC<Screen03CareerProps> = ({
  chapters,
  onStartChapter,
  onNavigate
}) => {
  return (
    <div className="w-full min-h-[calc(100vh-65px)] p-4 sm:p-8 lg:p-12 space-y-8 select-none bg-[#08090D]">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="text-xs font-racing font-bold tracking-[0.3em] text-[#FF8A32] uppercase">
            Aurelia Championship Series
          </div>
          <h1 className="text-3xl sm:text-5xl font-racing font-black text-white uppercase tracking-tight">
            CAREER <span className="text-[#FF3434]">PROGRESSION</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A8B5] mt-1 max-w-2xl">
            Rise from an unknown underground street driver to the undisputed Apex Champion of Aurelia. Defeat regional bosses to unlock the ultimate highway showdown.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('world-map');
            }}
            className="h-10 flex items-center justify-center gap-2 px-4 bg-[#171B24] hover:bg-[#202633] border border-white/10 text-white rounded text-xs font-racing font-bold uppercase tracking-wider transition-all cursor-pointer touch-manipulation active:scale-[0.98]"
          >
            <MapPin className="w-4 h-4 text-[#27B9FF]" />
            <span>View World Map</span>
          </button>
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chapters.map((ch) => {
          return (
            <div
              key={ch.id}
              className={`relative overflow-hidden rounded border transition-all flex flex-col justify-between ${
                ch.isUnlocked
                  ? 'bg-[#11141B] border-white/15 hover:border-[#FF3434]/50 hover:shadow-xl hover:shadow-red-950/20'
                  : 'bg-[#0d0f14]/80 border-white/5 opacity-70'
              }`}
            >
              {/* Background Art Placeholder / Tint */}
              <div className="relative h-44 overflow-hidden bg-[#171B24]">
                <img
                  src={
                    ch.imageKey === 'desert'
                      ? '/src/assets/images/bg_aurelia_world_1794231147436.jpg'
                      : ch.imageKey === 'speedway'
                      ? '/src/assets/images/bg_luxury_garage_1794231145252.jpg'
                      : '/src/assets/images/bg_neon_district_1794231146675.jpg'
                  }
                  alt={ch.title}
                  className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${
                    !ch.isUnlocked ? 'filter grayscale brightness-50' : 'brightness-90'
                  }`}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#11141B] via-[#11141B]/40 to-transparent" />

                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-black/75 backdrop-blur-md text-[10px] font-racing font-bold tracking-widest text-white border border-white/10 uppercase">
                    {ch.chapterNumber}
                  </span>
                  {ch.isCompleted && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#35D58A]/20 border border-[#35D58A]/30 text-[#35D58A] text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      COMPLETED
                    </span>
                  )}
                </div>

                {!ch.isUnlocked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px]">
                    <Lock className="w-8 h-8 text-slate-400 mb-1" />
                    <span className="text-xs font-racing font-bold tracking-wider text-slate-300 uppercase">
                      LOCKED
                    </span>
                    <span className="text-[10px] text-slate-400">Complete Previous Chapter</span>
                  </div>
                )}
              </div>

              {/* Content Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#27B9FF] font-semibold mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{ch.location}</span>
                  </div>

                  <h3 className="text-xl font-racing font-black text-white uppercase tracking-wide">
                    {ch.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    {ch.objective}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                    <UserCheck className="w-3.5 h-3.5 text-[#FF8A32]" />
                    <span>Boss Rival:</span>
                    <span className="font-semibold text-white">{ch.bossRival}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-[#A1A8B5]">
                    <span>Chapter Mastery</span>
                    <span className="font-mono-nums font-bold text-white">{ch.progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#171B24] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF8A32] to-[#FF3434]"
                      style={{ width: `${ch.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Rewards & Action */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 text-[#FFB547]">
                      <Coins className="w-3.5 h-3.5" />
                      <span className="font-speed font-bold">+{ch.rewardCoins.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#35D58A]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="font-speed font-bold">+{ch.rewardXp.toLocaleString()} XP</span>
                    </div>
                  </div>

                  {ch.isUnlocked ? (
                    <button
                      onClick={() => {
                        sound.playSelect();
                        onStartChapter(ch);
                      }}
                      className="h-9 flex items-center justify-center gap-1.5 px-4 bg-[#FF3434] hover:bg-[#e02626] text-white rounded text-xs font-racing font-bold uppercase tracking-wider transition-all shadow-md shadow-red-600/30 cursor-pointer touch-manipulation active:scale-[0.98]"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{ch.isCompleted ? 'Replay' : 'Play Mission'}</span>
                    </button>
                  ) : (
                    <div className="h-9 flex items-center gap-1.5 px-3 rounded bg-white/5 text-xs text-slate-500 font-semibold uppercase">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
