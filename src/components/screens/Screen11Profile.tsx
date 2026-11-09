import React, { useState } from 'react';
import { PlayerProfile, GameCharacter, GameScreen } from '../../types/game';
import { sound } from '../../utils/audio';
import {
  Trophy,
  Flame,
  Gauge,
  Coins,
  Shield,
  Award,
  Edit2,
  Check,
  UserCheck
} from 'lucide-react';

interface Screen11ProfileProps {
  player: PlayerProfile;
  characters: GameCharacter[];
  onUpdateCallsign: (newCallsign: string) => void;
  onNavigate: (screen: GameScreen) => void;
}

export const Screen11Profile: React.FC<Screen11ProfileProps> = ({
  player,
  characters,
  onUpdateCallsign,
  onNavigate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [callsignInput, setCallsignInput] = useState(player.callsign);

  const handleSave = () => {
    sound.playSelect();
    if (callsignInput.trim()) {
      onUpdateCallsign(callsignInput.trim().toUpperCase());
    }
    setIsEditing(false);
  };

  const winRate = Math.round((player.victories / player.totalRaces) * 100);

  return (
    <div className="w-full min-h-[calc(100vh-65px)] p-4 sm:p-8 lg:p-12 space-y-8 select-none bg-[#08090D]">
      {/* Driver License Card Header */}
      <div className="racing-panel p-6 sm:p-8 rounded-2xl border border-white/15 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Avatar & Callsign */}
        <div className="lg:col-span-5 flex items-center gap-5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#FF3434] to-[#11141B] p-1 border-2 border-white/20 shadow-2xl flex items-center justify-center">
            <span className="text-3xl sm:text-4xl font-racing font-black text-white">
              {player.level}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-racing font-bold px-2 py-0.5 rounded bg-[#FF3434]/20 text-[#FF3434] uppercase tracking-widest">
                CERTIFIED DRIVER
              </span>
              <span className="text-xs text-[#A1A8B5]">LVL {player.level}</span>
            </div>

            {isEditing ? (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  maxLength={12}
                  value={callsignInput}
                  onChange={(e) => setCallsignInput(e.target.value)}
                  className="px-2.5 py-1 bg-black/60 border border-[#FF3434] rounded text-lg font-racing font-black text-white uppercase focus:outline-none"
                />
                <button
                  onClick={handleSave}
                  className="w-8 h-8 flex items-center justify-center bg-[#FF3434] text-white rounded hover:bg-[#e02626] cursor-pointer touch-manipulation active:scale-95 transition-all"
                  title="Save Callsign"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-racing font-black text-white uppercase tracking-wide">
                  "{player.callsign}"
                </h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-8 h-8 flex items-center justify-center rounded bg-[#171B24] border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer touch-manipulation active:scale-95"
                  title="Edit Callsign"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="text-xs text-slate-300 font-medium">{player.name}</div>
          </div>
        </div>

        {/* Level XP Progress */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex justify-between text-xs text-[#A1A8B5]">
            <span>Experience to Level {player.level + 1}</span>
            <span className="font-mono-nums font-bold text-white">
              {player.xp.toLocaleString()} / {player.nextLevelXp.toLocaleString()} XP
            </span>
          </div>

          <div className="w-full h-2.5 bg-[#11141B] rounded-full overflow-hidden border border-white/10 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#27B9FF] via-[#FF8A32] to-[#FF3434] rounded-full"
              style={{ width: `${Math.min(100, (player.xp / player.nextLevelXp) * 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <div className="flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-[#FFB547]" />
              <span className="text-white font-speed font-bold">{player.coins.toLocaleString()} CR</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#27B9FF]" />
              <span className="text-white font-speed font-bold">{player.reputation.toLocaleString()} REP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#FF3434]" />
              <span className="text-white font-bold">{player.carsOwnedCount} Cars Owned</span>
            </div>
          </div>
        </div>
      </div>

      {/* Career Statistics Counters */}
      <div>
        <div className="text-xs font-racing font-bold tracking-widest text-[#A1A8B5] uppercase mb-3">
          Lifetime Racing Telemetry
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="racing-panel p-4 rounded-xl border border-white/10">
            <div className="text-xs text-[#A1A8B5] uppercase font-semibold">Total Races</div>
            <div className="text-2xl sm:text-3xl font-speed font-black text-white mt-1">
              {player.totalRaces}
            </div>
            <div className="text-[11px] text-[#35D58A] mt-1">Sanctioned & Street</div>
          </div>

          <div className="racing-panel p-4 rounded-xl border border-white/10">
            <div className="text-xs text-[#A1A8B5] uppercase font-semibold">Victories</div>
            <div className="text-2xl sm:text-3xl font-speed font-black text-[#FFB547] mt-1">
              {player.victories}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">{winRate}% Win Rate</div>
          </div>

          <div className="racing-panel p-4 rounded-xl border border-white/10">
            <div className="text-xs text-[#A1A8B5] uppercase font-semibold">Distance Driven</div>
            <div className="text-2xl sm:text-3xl font-speed font-black text-[#27B9FF] mt-1">
              {player.totalDistanceKm} <span className="text-xs text-slate-400">KM</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Across Aurelia</div>
          </div>

          <div className="racing-panel p-4 rounded-xl border border-white/10">
            <div className="text-xs text-[#A1A8B5] uppercase font-semibold">Top Recorded Speed</div>
            <div className="text-2xl sm:text-3xl font-speed font-black text-[#FF3434] mt-1">
              {player.bestSpeedKmh} <span className="text-xs text-slate-400">KM/H</span>
            </div>
            <div className="text-[11px] text-red-400 mt-1">Apex Radar Verified</div>
          </div>
        </div>
      </div>

      {/* Game Characters Dossier */}
      <div>
        <div className="text-xs font-racing font-bold tracking-widest text-[#A1A8B5] uppercase mb-3">
          Key Character Intel & Rivals
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map((char) => {
            return (
              <div
                key={char.id}
                className="racing-panel p-5 rounded-xl border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-racing font-bold px-2 py-0.5 rounded uppercase"
                    style={{ backgroundColor: `${char.avatarColor}20`, color: char.avatarColor }}
                  >
                    {char.role}
                  </span>
                  <span className="text-xs text-[#A1A8B5] font-racing">{char.vehicle}</span>
                </div>

                <h3 className="text-lg font-racing font-black text-white">{char.name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{char.bio}</p>
                <div className="text-xs italic text-slate-400 pt-2 border-t border-white/10">
                  {char.quote}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
