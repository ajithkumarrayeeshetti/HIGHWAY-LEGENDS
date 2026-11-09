import React, { useEffect, useState } from 'react';
import { sound } from '../../utils/audio';
import { ChevronRight } from 'lucide-react';

interface Screen01IntroProps {
  onStart: () => void;
}

export const Screen01Intro: React.FC<Screen01IntroProps> = ({ onStart }) => {
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsReady(true);
          return 100;
        }
        return prev + 5;
      });
    }, 60);

    const handleKey = () => {
      sound.playSelect();
      onStart();
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleKey);
    };
  }, [onStart]);

  const handleEnter = () => {
    sound.playSelect();
    onStart();
  };

  return (
    <div
      onClick={handleEnter}
      className="relative w-full h-screen overflow-hidden bg-[#08090D] cursor-pointer select-none flex flex-col justify-between p-6 sm:p-12"
    >
      {/* Cinematic Hypercar Background */}
      <img
        src="/src/assets/images/hero_red_hypercar_1794231144350.jpg"
        alt="Highway Legends Red Hypercar"
        className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90 contrast-110"
        referrerPolicy="no-referrer"
      />

      {/* Atmospheric Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-[#08090D]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#08090D]/80 via-transparent to-[#08090D]/80" />

      {/* Top Header / Skip */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-[#FF3434] clip-racing-skew" />
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#A1A8B5]">
            Aurelia Racing Syndicate
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            sound.playClick();
            onStart();
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white bg-black/60 hover:bg-black/90 border border-white/10 rounded transition-all"
        >
          <span>Skip Intro</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#FF3434]" />
        </button>
      </div>

      {/* Center Branding */}
      <div className="relative z-10 max-w-2xl my-auto">
        <div className="text-xs font-racing font-bold tracking-[0.4em] text-[#FF8A32] uppercase mb-2">
          AAA High-Velocity Experience
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-racing font-black tracking-tight leading-none uppercase text-white drop-shadow-2xl">
          HIGHWAY<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3434] via-[#FF8A32] to-[#FF3434]">
            LEGENDS
          </span>
        </h1>

        <p className="mt-4 text-base sm:text-xl font-medium tracking-wide text-slate-300">
          Born to Drive. Built to Dominate.
        </p>

        <div className="mt-6 flex items-center gap-4 text-xs text-[#A1A8B5]">
          <span>Career Mode</span>
          <span aria-hidden="true">·</span>
          <span>Endless Highway</span>
          <span aria-hidden="true">·</span>
          <span>Police Interceptor</span>
          <span aria-hidden="true">·</span>
          <span>Aurelia World Tour</span>
        </div>
      </div>

      {/* Bottom Loading / Action Prompt */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-6 border-t border-white/10">
        <div>
          <div className="text-xs font-mono-nums tracking-widest text-[#A1A8B5] uppercase mb-2">
            {isReady ? 'SYSTEMS ONLINE · 100% READY' : `INITIALIZING RACING ENGINES · ${loadProgress}%`}
          </div>

          <div className="w-64 h-1.5 bg-[#171B24] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#27B9FF] via-[#FF8A32] to-[#FF3434] transition-all duration-150"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 animate-pulse">
          <div className="w-3 h-3 bg-[#FF3434] rounded-sm transform rotate-45" />
          <span className="text-sm sm:text-base font-racing font-bold tracking-widest text-white uppercase">
            {isReady ? 'Press Any Key or Tap Screen to Start' : 'Loading Assets...'}
          </span>
        </div>
      </div>
    </div>
  );
};
