import React from 'react';
import { RaceEvent, GameScreen } from '../../types/game';
import { sound } from '../../utils/audio';
import {
  Play,
  MapPin,
  Flame,
  Coins,
  Sparkles,
  Gauge,
  ShieldAlert,
  Clock,
  Compass
} from 'lucide-react';

interface Screen07RaceSelectProps {
  events: RaceEvent[];
  onSelectEvent: (event: RaceEvent) => void;
  onNavigate: (screen: GameScreen) => void;
}

export const Screen07RaceSelect: React.FC<Screen07RaceSelectProps> = ({
  events,
  onSelectEvent,
  onNavigate
}) => {
  const getDifficultyBadge = (diff: RaceEvent['difficulty']) => {
    switch (diff) {
      case 'Rookie':
        return 'text-[#35D58A] bg-[#35D58A]/15 border-[#35D58A]/30';
      case 'Street':
        return 'text-[#27B9FF] bg-[#27B9FF]/15 border-[#27B9FF]/30';
      case 'Pro':
        return 'text-[#FF8A32] bg-[#FF8A32]/15 border-[#FF8A32]/30';
      case 'Apex':
        return 'text-[#FF3434] bg-[#FF3434]/15 border-[#FF3434]/30';
      case 'Legendary':
        return 'text-purple-400 bg-purple-500/15 border-purple-500/30';
    }
  };

  const getEventIcon = (type: RaceEvent['type']) => {
    switch (type) {
      case 'Endless Highway':
        return <Gauge className="w-4 h-4 text-[#FF3434]" />;
      case 'Career Race':
        return <Flame className="w-4 h-4 text-[#FF8A32]" />;
      case 'Time Trial':
        return <Clock className="w-4 h-4 text-[#27B9FF]" />;
      case 'Police Chase':
        return <ShieldAlert className="w-4 h-4 text-purple-400" />;
      case 'Drift Challenge':
        return <Compass className="w-4 h-4 text-[#35D58A]" />;
      case 'Daily Challenge':
        return <Sparkles className="w-4 h-4 text-[#FFB547]" />;
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-65px)] p-4 sm:p-8 lg:p-12 space-y-8 select-none bg-[#08090D]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="text-xs font-racing font-bold tracking-[0.3em] text-[#FF8A32] uppercase">
            Aurelia Event Operations
          </div>
          <h1 className="text-3xl sm:text-5xl font-racing font-black text-white uppercase tracking-tight">
            RACE <span className="text-[#FF3434]">SELECTION</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A8B5] mt-1 max-w-2xl">
            Choose your circuit challenge. Test your machine in endless traffic survival, timed checkpoint sprints, or high-speed police pursuits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('garage');
            }}
            className="px-4 py-2 bg-[#171B24] hover:bg-[#202633] border border-white/10 text-white rounded text-xs font-racing font-bold uppercase tracking-wider transition-colors"
          >
            Switch Vehicle
          </button>
        </div>
      </div>

      {/* Race Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((ev) => {
          return (
            <div
              key={ev.id}
              className="racing-panel rounded overflow-hidden border border-white/10 hover:border-[#FF3434]/50 transition-all flex flex-col justify-between group hover:shadow-xl hover:shadow-red-950/20"
            >
              {/* Event Image Banner */}
              <div className="relative h-44 overflow-hidden bg-[#11141B]">
                <img
                  src={
                    ev.type === 'Police Chase' || ev.location.includes('Neon')
                      ? '/src/assets/images/bg_neon_district_1794231146675.jpg'
                      : ev.location.includes('Desert')
                      ? '/src/assets/images/bg_aurelia_world_1794231147436.jpg'
                      : '/src/assets/images/hero_red_hypercar_1794231144350.jpg'
                  }
                  alt={ev.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171B24] via-[#171B24]/40 to-transparent" />

                {/* Type & Difficulty Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-[10px] font-racing font-bold text-white border border-white/10 uppercase">
                    {getEventIcon(ev.type)}
                    <span>{ev.type}</span>
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-racing font-bold border uppercase ${getDifficultyBadge(
                      ev.difficulty
                    )}`}
                  >
                    {ev.difficulty}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#27B9FF] font-semibold mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{ev.location}</span>
                  </div>

                  <h3 className="text-xl font-racing font-black text-white uppercase tracking-wide group-hover:text-[#FF3434] transition-colors">
                    {ev.title}
                  </h3>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[#A1A8B5] py-2 border-y border-white/10">
                    <div>
                      <div className="text-[10px] uppercase">Track Distance</div>
                      <div className="font-speed font-bold text-white">
                        {ev.distanceKm === 0 ? 'Endless' : `${ev.distanceKm} KM`}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase">Requirement</div>
                      <div className="font-semibold text-slate-300 truncate">
                        {ev.entryRequirement}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rewards & Launch Button */}
                <div className="pt-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 text-[#FFB547]">
                      <Coins className="w-3.5 h-3.5" />
                      <span className="font-speed font-bold">+{ev.rewardCoins.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#35D58A]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="font-speed font-bold">+{ev.rewardXp.toLocaleString()} XP</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      sound.playSelect();
                      onSelectEvent(ev);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#FF3434] hover:bg-[#e02626] text-white rounded text-xs font-racing font-bold uppercase tracking-wider transition-all shadow-md shadow-red-600/30 group-hover:scale-105"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Start Race</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
