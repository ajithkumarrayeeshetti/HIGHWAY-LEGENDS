import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Vehicle, RaceEvent, RaceLiveState, GameScreen } from '../../types/game';
import { sound } from '../../utils/audio';
import {
  Trophy,
  RotateCcw,
  ChevronRight,
  Home,
  Coins,
  Sparkles,
  Flame,
  Gauge,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ShieldAlert,
  Lock
} from 'lucide-react';

interface Screen10RaceResultsProps {
  isVictory: boolean;
  vehicle: Vehicle;
  event: RaceEvent;
  finalState: RaceLiveState;
  onRaceAgain: () => void;
  onNextMission: () => void;
  onReturnToGarage: () => void;
}

export const Screen10RaceResults: React.FC<Screen10RaceResultsProps> = ({
  isVictory,
  vehicle,
  event,
  finalState,
  onRaceAgain,
  onNextMission,
  onReturnToGarage
}) => {
  useEffect(() => {
    if (isVictory) {
      sound.playVictory();
      // Burst celebratory confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF3434', '#FF8A32', '#27B9FF', '#FFB547', '#35D58A']
      });
    }
  }, [isVictory]);

  const earnedCoins = isVictory ? event.rewardCoins : Math.round(event.rewardCoins * 0.4);
  const earnedXp = isVictory ? event.rewardXp : Math.round(event.rewardXp * 0.4);
  const nearMissBonus = finalState.nearMisses * 500;
  const totalCoins = earnedCoins + nearMissBonus + finalState.coinsCollected * 250;

  const minutes = Math.floor(finalState.raceTimeSeconds / 60);
  const seconds = Math.floor(finalState.raceTimeSeconds % 60);
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] bg-[#08090D] flex items-center justify-center p-4 sm:p-8 select-none overflow-hidden">
      {/* Background Graphic */}
      <img
        src="/src/assets/images/hero_red_hypercar_1794231144350.jpg"
        alt="Race Results Backdrop"
        className="absolute inset-0 w-full h-full object-cover filter brightness-[0.35] contrast-125"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-[#08090D]/80 to-transparent" />

      {/* Main Results Container */}
      <div className="relative z-10 w-full max-w-2xl racing-panel-glow p-6 sm:p-10 rounded-2xl border border-white/20 shadow-2xl space-y-6 animate-fadeIn">
        {/* Banner Title */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-black/60 border border-white/10 text-xs font-racing font-bold tracking-widest uppercase mb-2">
            {finalState.isWrecked ? (
              <>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-red-400">Critical Chassis Failure · 3 Strikes</span>
              </>
            ) : isVictory ? (
              <>
                <Trophy className="w-3.5 h-3.5 text-[#FFB547]" />
                <span className="text-[#FFB547]">Podium Victory Achieved</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                <span className="text-red-400">Challenge Objective Failed</span>
              </>
            )}
          </div>

          <h1 className="text-4xl sm:text-6xl font-racing font-black uppercase tracking-tight text-white leading-none">
            {finalState.isWrecked ? (
              <span className="text-red-500 drop-shadow-[0_0_25px_rgba(239,68,68,0.5)]">
                VEHICLE TOTALED
              </span>
            ) : isVictory ? (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB547] via-white to-[#35D58A]">
                VICTORY
              </span>
            ) : (
              <span className="text-red-500 drop-shadow-[0_0_25px_rgba(239,68,68,0.5)]">
                CHALLENGE FAILED
              </span>
            )}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
            {finalState.isWrecked
              ? 'Chassis sustained 3 collision strikes. Highway emergency tow dispatched. Challenge not completed.'
              : !isVictory
              ? 'Objective target was not reached. You must complete this challenge to unlock the next mission.'
              : `${event.title} · ${vehicle.name} (Class ${vehicle.class})`}
          </p>
        </div>

        {/* Primary Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#11141B] rounded-xl border border-white/10 text-center">
          <div>
            <div className="text-[10px] text-[#A1A8B5] uppercase font-semibold">Status</div>
            <div
              className={`text-2xl font-racing font-black mt-0.5 ${
                finalState.isWrecked ? 'text-red-500' : isVictory ? 'text-[#35D58A]' : 'text-red-400'
              }`}
            >
              {finalState.isWrecked ? 'Totaled' : isVictory ? '1st (Win)' : 'Failed'}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-[#A1A8B5] uppercase font-semibold">Time Survived</div>
            <div className="text-2xl font-speed font-black text-white mt-0.5">
              {timeFormatted}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-[#A1A8B5] uppercase font-semibold">Distance</div>
            <div className="text-2xl font-speed font-black text-white mt-0.5">
              {(finalState.distanceMeters / 1000).toFixed(2)} <span className="text-xs text-slate-400">KM</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] text-[#A1A8B5] uppercase font-semibold">Strikes Taken</div>
            <div
              className={`text-2xl font-speed font-black mt-0.5 ${
                finalState.crashStrikes >= 3 ? 'text-red-500' : 'text-[#FF8A32]'
              }`}
            >
              {finalState.crashStrikes} / 3
            </div>
          </div>
        </div>

        {/* Detailed Rewards & Challenges Breakdown */}
        <div className="p-4 bg-[#171B24]/90 rounded-xl border border-white/10 space-y-2 text-xs">
          <div className="text-xs font-racing font-bold text-[#A1A8B5] uppercase tracking-wider mb-1">
            Earnings & Road Challenge Outcomes
          </div>

          {/* Road Challenges completed */}
          {finalState.challenges && finalState.challenges.length > 0 && (
            <div className="p-2 bg-[#11141B] rounded border border-white/5 space-y-1 mb-2">
              {finalState.challenges.map((c) => (
                <div key={c.id} className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-300">{c.title}</span>
                  {c.completed ? (
                    <span className="text-[#35D58A] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> COMPLETED (+2,500 CR)
                    </span>
                  ) : (
                    <span className="text-slate-400 font-mono-nums">
                      {c.progress}/{c.target}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between py-1 text-slate-300">
            <span>Base Event Reward</span>
            <span className="font-speed font-bold text-white">
              {finalState.isWrecked ? '0 CR (Wrecked)' : `+${earnedCoins.toLocaleString()} CR`}
            </span>
          </div>

          <div className="flex justify-between py-1 text-slate-300">
            <span>Near Miss Bounties ({finalState.nearMisses}x)</span>
            <span className="font-speed font-bold text-[#FF8A32]">+{nearMissBonus.toLocaleString()} CR</span>
          </div>

          <div className="flex justify-between py-1 text-slate-300">
            <span>Highway Coin Pickups ({finalState.coinsCollected}x)</span>
            <span className="font-speed font-bold text-[#FFB547]">
              +{(finalState.coinsCollected * 250).toLocaleString()} CR
            </span>
          </div>

          <div className="pt-2 border-t border-white/10 flex justify-between items-center text-sm font-bold">
            <span className="text-white">Total Credited</span>
            <div className="flex items-center gap-3">
              <span className="text-[#35D58A] font-speed font-bold">+{earnedXp.toLocaleString()} XP</span>
              <div className="flex items-center gap-1 text-[#FFB547] font-speed font-black text-base">
                <Coins className="w-4 h-4" />
                <span>+{totalCoins.toLocaleString()} CR</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {isVictory && !finalState.isWrecked ? (
            <>
              <button
                onClick={() => {
                  sound.playClick();
                  onRaceAgain();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#171B24] hover:bg-[#202633] text-white border border-white/15 rounded text-xs font-racing font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-[#FF8A32]" />
                <span>Race Again</span>
              </button>

              <button
                onClick={() => {
                  sound.playSelect();
                  onNextMission();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#FF3434] hover:bg-[#e02626] text-white rounded text-xs font-racing font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-600/30 cursor-pointer"
              >
                <span>Next Mission</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  sound.playClick();
                  onRaceAgain();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#FF3434] hover:bg-[#e02626] text-white rounded text-xs font-racing font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-600/30 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-white" />
                <span>Retry Challenge</span>
              </button>

              <button
                onClick={() => {
                  sound.playSelect();
                  onNextMission();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#171B24] hover:bg-[#202633] text-white border border-white/15 rounded text-xs font-racing font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Lock className="w-4 h-4 text-slate-400" />
                <span>Career Hub</span>
              </button>
            </>
          )}

          <button
            onClick={() => {
              sound.playClick();
              onReturnToGarage();
            }}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-[#11141B] hover:bg-[#1a1f2b] text-slate-300 hover:text-white border border-white/10 rounded text-xs font-racing font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Garage</span>
          </button>
        </div>
      </div>
    </div>
  );
};
