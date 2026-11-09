import React from 'react';
import { DailyChallenge, GameScreen } from '../../types/game';
import { sound } from '../../utils/audio';
import {
  Target,
  CheckCircle2,
  Clock,
  Coins,
  Sparkles,
  Gift,
  ChevronRight
} from 'lucide-react';

interface Screen13DailyChallengesProps {
  challenges: DailyChallenge[];
  onClaimReward: (challengeId: string) => void;
  onNavigate: (screen: GameScreen) => void;
}

export const Screen13DailyChallenges: React.FC<Screen13DailyChallengesProps> = ({
  challenges,
  onClaimReward,
  onNavigate
}) => {
  return (
    <div className="w-full min-h-[calc(100vh-65px)] p-4 sm:p-8 lg:p-12 space-y-8 select-none bg-[#08090D]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="text-xs font-racing font-bold tracking-[0.3em] text-[#FF8A32] uppercase">
            Aurelia Daily Operations
          </div>
          <h1 className="text-3xl sm:text-5xl font-racing font-black text-white uppercase tracking-tight">
            DAILY <span className="text-[#FF3434]">CHALLENGES</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A8B5] mt-1 max-w-2xl">
            Complete daily road tasks to earn bonus credits and reputation. Refreshes every 24 hours.
          </p>
        </div>

        {/* Countdown Pill */}
        <div className="flex items-center gap-2 px-3.5 py-2 bg-[#171B24] border border-white/10 rounded-lg text-xs">
          <Clock className="w-4 h-4 text-[#FF8A32]" />
          <span className="text-[#A1A8B5] uppercase">Resets In:</span>
          <span className="font-speed font-bold text-white">14h : 28m : 12s</span>
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {challenges.map((c) => {
          const progressPercent = Math.min(100, Math.round((c.progress / c.target) * 100));

          return (
            <div
              key={c.id}
              className={`racing-panel p-5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                c.claimed
                  ? 'border-white/5 opacity-60'
                  : c.completed
                  ? 'border-[#35D58A]/50 bg-[#171B24]'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {/* Challenge Details */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5">
                  <Target className={`w-4 h-4 ${c.completed ? 'text-[#35D58A]' : 'text-[#FF8A32]'}`} />
                  <h3 className="text-lg font-racing font-black text-white uppercase tracking-wide">
                    {c.title}
                  </h3>
                  {c.completed && !c.claimed && (
                    <span className="px-2 py-0.5 rounded bg-[#35D58A]/20 text-[#35D58A] text-[10px] font-bold">
                      READY TO CLAIM
                    </span>
                  )}
                  {c.claimed && (
                    <span className="px-2 py-0.5 rounded bg-white/10 text-slate-400 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      CLAIMED
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300">{c.description}</p>

                {/* Progress bar */}
                <div className="space-y-1 max-w-md pt-1">
                  <div className="flex justify-between text-[11px] text-[#A1A8B5]">
                    <span>Progress</span>
                    <span className="font-mono-nums font-bold text-white">
                      {c.progress} / {c.target} {c.unit} ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#11141B] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        c.completed
                          ? 'bg-[#35D58A]'
                          : 'bg-gradient-to-r from-[#27B9FF] to-[#FF8A32]'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Rewards & Action */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 text-[#FFB547]">
                    <Coins className="w-3.5 h-3.5" />
                    <span className="font-speed font-bold">+{c.rewardCoins.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#35D58A]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="font-speed font-bold">+{c.rewardXp.toLocaleString()} XP</span>
                  </div>
                </div>

                <div>
                  {c.completed && !c.claimed ? (
                    <button
                      onClick={() => {
                        sound.playSelect();
                        onClaimReward(c.id);
                      }}
                      className="h-9 flex items-center justify-center gap-1.5 px-4 bg-[#35D58A] hover:bg-[#2eb976] text-black font-racing font-black text-xs uppercase tracking-wider rounded transition-all shadow-lg shadow-emerald-500/20 cursor-pointer touch-manipulation active:scale-[0.98]"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>Claim Reward</span>
                    </button>
                  ) : c.claimed ? (
                    <div className="h-9 flex items-center justify-center px-3 text-xs text-slate-500 font-semibold uppercase">
                      <span>Completed</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        sound.playClick();
                        onNavigate('race-select');
                      }}
                      className="h-9 flex items-center justify-center gap-1 px-3.5 bg-[#171B24] hover:bg-[#202633] text-slate-300 hover:text-white rounded border border-white/10 text-xs font-racing font-bold uppercase transition-all cursor-pointer touch-manipulation active:scale-[0.98]"
                    >
                      <span>Go Race</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
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
