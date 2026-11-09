import React, { useState } from 'react';
import { LeaderboardEntry, GameScreen } from '../../types/game';
import { sound } from '../../utils/audio';
import { Trophy, Medal, Crown, Flame, ChevronRight } from 'lucide-react';

interface Screen12LeaderboardProps {
  entries: LeaderboardEntry[];
  onNavigate: (screen: GameScreen) => void;
}

export const Screen12Leaderboard: React.FC<Screen12LeaderboardProps> = ({
  entries,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'global' | 'friends' | 'weekly' | 'monthly' | 'all-time'>('global');

  const tabs: Array<'global' | 'friends' | 'weekly' | 'monthly' | 'all-time'> = [
    'global',
    'friends',
    'weekly',
    'monthly',
    'all-time'
  ];

  return (
    <div className="w-full min-h-[calc(100vh-65px)] p-4 sm:p-8 lg:p-12 space-y-8 select-none bg-[#08090D]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="text-xs font-racing font-bold tracking-[0.3em] text-[#FF8A32] uppercase">
            Global Apex Rankings
          </div>
          <h1 className="text-3xl sm:text-5xl font-racing font-black text-white uppercase tracking-tight">
            HALL OF <span className="text-[#FF3434]">LEGENDS</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A8B5] mt-1 max-w-2xl">
            Live competitive rankings across the Aurelia Highway League. Compete for weekly crown bounties.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 p-1 bg-[#171B24] rounded border border-white/10">
          {tabs.map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(tab);
                }}
                className={`px-3 py-1.5 text-xs font-racing font-bold uppercase tracking-wider rounded transition-all ${
                  isSelected
                    ? 'bg-[#FF3434] text-white shadow-md shadow-red-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Leaderboard Table Container */}
      <div className="racing-panel rounded-xl overflow-hidden border border-white/10 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#11141B] text-[11px] font-racing font-bold tracking-widest text-[#A1A8B5] uppercase">
                <th className="py-3.5 px-4 sm:px-6 w-16">Rank</th>
                <th className="py-3.5 px-4">Driver</th>
                <th className="py-3.5 px-4">Level</th>
                <th className="py-3.5 px-4">Signature Machine</th>
                <th className="py-3.5 px-4 text-right">Victories</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Apex Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {entries.map((entry) => {
                const isFirst = entry.rank === 1;
                const isSecond = entry.rank === 2;
                const isThird = entry.rank === 3;

                return (
                  <tr
                    key={entry.rank}
                    className={`transition-colors ${
                      entry.isPlayer
                        ? 'bg-[#FF3434]/15 border-l-4 border-l-[#FF3434]'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-4 px-4 sm:px-6 font-speed font-black">
                      {isFirst ? (
                        <div className="flex items-center gap-1 text-[#FFD700]">
                          <Crown className="w-4 h-4" />
                          <span>1</span>
                        </div>
                      ) : isSecond ? (
                        <div className="flex items-center gap-1 text-[#C0C0C0]">
                          <Medal className="w-4 h-4" />
                          <span>2</span>
                        </div>
                      ) : isThird ? (
                        <div className="flex items-center gap-1 text-[#CD7F32]">
                          <Medal className="w-4 h-4" />
                          <span>3</span>
                        </div>
                      ) : (
                        <span className="text-[#A1A8B5]">#{entry.rank}</span>
                      )}
                    </td>

                    {/* Driver */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-racing font-black text-sm uppercase ${
                            entry.isPlayer ? 'text-[#FF3434]' : 'text-white'
                          }`}
                        >
                          {entry.name}
                        </span>
                        {entry.isPlayer && (
                          <span className="px-1.5 py-0.5 bg-[#FF3434] text-white text-[9px] font-bold rounded">
                            YOU
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Level */}
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded bg-white/10 font-mono-nums font-bold text-slate-300">
                        LVL {entry.level}
                      </span>
                    </td>

                    {/* Car */}
                    <td className="py-4 px-4 text-[#A1A8B5] font-racing font-bold">
                      {entry.car}
                    </td>

                    {/* Wins */}
                    <td className="py-4 px-4 text-right font-mono-nums font-bold text-white">
                      {entry.wins}
                    </td>

                    {/* Score */}
                    <td className="py-4 px-4 sm:px-6 text-right font-speed font-black text-[#27B9FF] text-sm">
                      {entry.score.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
