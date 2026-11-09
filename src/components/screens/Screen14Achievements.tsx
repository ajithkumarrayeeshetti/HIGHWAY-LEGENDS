import React, { useState } from 'react';
import { Achievement, GameScreen } from '../../types/game';
import { sound } from '../../utils/audio';
import {
  Trophy,
  Zap,
  Compass,
  MapPin,
  ShieldAlert,
  Flame,
  Crown,
  Award,
  Lock,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface Screen14AchievementsProps {
  achievements: Achievement[];
  onNavigate: (screen: GameScreen) => void;
}

export const Screen14Achievements: React.FC<Screen14AchievementsProps> = ({
  achievements,
  onNavigate
}) => {
  const [filterTier, setFilterTier] = useState<string>('all');

  const filtered = filterTier === 'all'
    ? achievements
    : achievements.filter((a) => a.tier.toLowerCase() === filterTier.toLowerCase());

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const getTierColor = (tier: Achievement['tier']) => {
    switch (tier) {
      case 'Bronze':
        return 'text-[#CD7F32] bg-[#CD7F32]/15 border-[#CD7F32]/30';
      case 'Silver':
        return 'text-[#C0C0C0] bg-[#C0C0C0]/15 border-[#C0C0C0]/30';
      case 'Gold':
        return 'text-[#FFD700] bg-[#FFD700]/15 border-[#FFD700]/30';
      case 'Apex':
        return 'text-[#FF3434] bg-[#FF3434]/20 border-[#FF3434]/40';
    }
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Trophy': return <Trophy className="w-5 h-5" />;
      case 'Zap': return <Zap className="w-5 h-5" />;
      case 'Compass': return <Compass className="w-5 h-5" />;
      case 'MapPin': return <MapPin className="w-5 h-5" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5" />;
      case 'Flame': return <Flame className="w-5 h-5" />;
      case 'Crown': return <Crown className="w-5 h-5" />;
      default: return <Award className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-65px)] p-4 sm:p-8 lg:p-12 space-y-8 select-none bg-[#08090D]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="text-xs font-racing font-bold tracking-[0.3em] text-[#FF8A32] uppercase">
            Aurelia Legacy Hall
          </div>
          <h1 className="text-3xl sm:text-5xl font-racing font-black text-white uppercase tracking-tight">
            HONOR & <span className="text-[#FF3434]">ACHIEVEMENTS</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A8B5] mt-1 max-w-2xl">
            Unlocked: {unlockedCount} of {achievements.length} Badges ({Math.round((unlockedCount / achievements.length) * 100)}% Complete)
          </p>
        </div>

        {/* Tier Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#171B24] rounded border border-white/10 text-xs">
          {['all', 'Bronze', 'Silver', 'Gold', 'Apex'].map((t) => {
            const isSelected = filterTier.toLowerCase() === t.toLowerCase();
            return (
              <button
                key={t}
                onClick={() => {
                  sound.playClick();
                  setFilterTier(t);
                }}
                className={`h-9 px-3.5 flex items-center justify-center font-racing font-bold uppercase tracking-wider rounded transition-all cursor-pointer touch-manipulation active:scale-[0.98] ${
                  isSelected
                    ? 'bg-[#FF3434] text-white shadow-md shadow-red-600/30 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((ach) => {
          const progressPercent = Math.min(100, Math.round((ach.progress / ach.target) * 100));

          return (
            <div
              key={ach.id}
              className={`racing-panel p-5 rounded-xl border transition-all flex flex-col justify-between ${
                ach.unlocked
                  ? 'border-white/20 bg-[#171B24] shadow-lg shadow-black/50'
                  : 'border-white/5 bg-[#0d0f14]/80 opacity-70'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      ach.unlocked
                        ? 'bg-[#FF3434]/20 text-[#FF3434] border border-[#FF3434]/40'
                        : 'bg-white/5 text-slate-500 border border-white/5'
                    }`}
                  >
                    {ach.unlocked ? getIcon(ach.iconName) : <Lock className="w-4 h-4" />}
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-racing font-bold uppercase border ${getTierColor(
                      ach.tier
                    )}`}
                  >
                    {ach.tier}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-racing font-black text-white uppercase tracking-wide">
                    {ach.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </div>

              {/* Progress & Reward */}
              <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                <div className="flex justify-between text-[11px] text-[#A1A8B5]">
                  <span>Progress</span>
                  <span className="font-mono-nums font-bold text-white">
                    {ach.progress} / {ach.target}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#11141B] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      ach.unlocked ? 'bg-[#35D58A]' : 'bg-gradient-to-r from-[#27B9FF] to-[#FF8A32]'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="flex items-center gap-1 text-[#35D58A] font-speed font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>+{ach.rewardXp.toLocaleString()} XP</span>
                  </span>

                  {ach.unlocked ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#35D58A]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      UNLOCKED
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-slate-500 uppercase">
                      LOCKED
                    </span>
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
