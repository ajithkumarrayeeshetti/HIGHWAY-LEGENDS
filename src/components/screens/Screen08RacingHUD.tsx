import React, { useState } from 'react';
import { Vehicle, RaceEvent, RaceLiveState, CameraViewMode } from '../../types/game';
import { RacingSimulation3D } from '../game3d/RacingSimulation3D';
import { sound } from '../../utils/audio';
import {
  Pause,
  Flame,
  Zap,
  Coins,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  ArrowDown,
  Camera,
  Shield,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface Screen08RacingHUDProps {
  vehicle: Vehicle;
  event: RaceEvent;
  isPaused?: boolean;
  onPause: () => void;
  onFinishRace: (isVictory: boolean, finalState: RaceLiveState) => void;
}

export const Screen08RacingHUD: React.FC<Screen08RacingHUDProps> = ({
  vehicle,
  event,
  isPaused = false,
  onPause,
  onFinishRace
}) => {
  const [cameraMode, setCameraMode] = useState<CameraViewMode>('chase');

  const [liveState, setLiveState] = useState<RaceLiveState>({
    speedKmh: 0,
    distanceMeters: 0,
    score: 0,
    coinsCollected: 0,
    nearMisses: 0,
    comboMultiplier: 1,
    nitroRemaining: 100,
    isNitroActive: false,
    rpm: 1200,
    currentGear: 1,
    raceTimeSeconds: 0,
    isGameOver: false,
    isVictory: false,
    isWrecked: false,
    cameraMode: 'chase',
    vehicleHealth: 100,
    crashStrikes: 0,
    consecutiveDashes: 0,
    challenges: [
      { id: 'triple-dash', title: 'Triple Dash: 3 Cars in a Row', progress: 0, target: 3, completed: false },
      { id: 'speed-demon', title: 'Speed Barrier: 280 KM/H', progress: 0, target: 280, completed: false },
      { id: 'survivor', title: 'Armor: Max 2 Strikes', progress: 0, target: 3, completed: false }
    ],
    objectiveProgress: 0,
    objectiveTarget: event.distanceKm > 0 ? event.distanceKm * 1000 : 5000,
    objectiveLabel: event.distanceKm > 0 ? `Target: ${event.distanceKm} KM` : 'Endless Highway',
    recentNotification: null
  });

  // Mobile Touch Controls State
  const [touchSteer, setTouchSteer] = useState<number>(0);
  const [touchBrake, setTouchBrake] = useState<boolean>(false);
  const [touchNitro, setTouchNitro] = useState<boolean>(false);

  const cycleCamera = () => {
    sound.playClick();
    setCameraMode((prev) => {
      if (prev === 'chase') return 'hood';
      if (prev === 'hood') return 'close';
      return 'chase';
    });
  };

  const rpmNormalized = Math.min(1, (liveState.rpm - 1000) / 8000);
  const distanceKmFormatted = (liveState.distanceMeters / 1000).toFixed(2);

  return (
    <div className="relative w-full h-[calc(100vh-65px)] bg-black overflow-hidden select-none">
      {/* 3D WebGL Racing Canvas */}
      <div className="absolute inset-0 w-full h-full z-0">
        <RacingSimulation3D
          vehicle={vehicle}
          event={event}
          isPaused={isPaused}
          onPause={onPause}
          onUpdateState={setLiveState}
          onFinishRace={onFinishRace}
          cameraMode={cameraMode}
          onCycleCamera={cycleCamera}
          steeringInput={touchSteer}
          throttleInput={1}
          brakeInput={touchBrake}
          nitroInput={touchNitro}
        />
      </div>

      {/* Red Edge Flash Vignette on Collision Damage */}
      {liveState.crashStrikes > 0 && liveState.vehicleHealth < 100 && (
        <div
          className={`absolute inset-0 pointer-events-none z-10 transition-opacity duration-300 ${
            liveState.crashStrikes >= 2
              ? 'ring-inset ring-8 ring-red-600/60 animate-pulse'
              : 'ring-inset ring-4 ring-orange-500/30'
          }`}
        />
      )}

      {/* Speed Lines / Warp Effect on Nitro */}
      {liveState.isNitroActive && (
        <div className="absolute inset-0 pointer-events-none z-10 bg-radial from-transparent via-cyan-500/10 to-[#27B9FF]/20 mix-blend-screen animate-pulse" />
      )}

      {/* TOP HUD BAR */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 sm:p-6 flex items-start justify-between pointer-events-none">
        {/* Top-Left: Distance, Objective & Chassis Health */}
        <div className="pointer-events-auto space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-[#FF3434] text-white font-racing font-black text-sm uppercase tracking-widest shadow-lg shadow-red-600/40">
              POS 1 / 8
            </span>
            <div className="text-white font-speed font-black text-xl sm:text-2xl drop-shadow-md tracking-wider">
              {distanceKmFormatted} <span className="text-xs text-[#A1A8B5]">KM</span>
            </div>
          </div>

          <div className="text-xs text-slate-300 font-semibold flex items-center gap-2">
            <span className="text-[#FF8A32] uppercase">{event.title}</span>
            <span className="text-white/40">·</span>
            <span>{liveState.objectiveLabel}</span>
          </div>

          {/* Progress bar towards finish line if non-endless */}
          {event.distanceKm > 0 && (
            <div className="w-48 sm:w-64 h-1.5 bg-black/60 backdrop-blur-md rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-[#27B9FF] to-[#35D58A]"
                style={{
                  width: `${Math.min(100, (liveState.distanceMeters / (event.distanceKm * 1000)) * 100)}%`
                }}
              />
            </div>
          )}

          {/* Vehicle Integrity & Crash Strikes (3-strike game over rule) */}
          <div className="p-2 rounded bg-black/75 backdrop-blur-md border border-white/10 flex items-center gap-3 max-w-[240px]">
            <Shield className={`w-4 h-4 ${liveState.vehicleHealth < 40 ? 'text-red-500 animate-pulse' : 'text-[#35D58A]'}`} />
            <div className="flex-1">
              <div className="flex justify-between text-[10px] font-racing font-bold uppercase text-slate-300">
                <span>Chassis Health</span>
                <span className={liveState.vehicleHealth < 40 ? 'text-red-400 font-bold' : 'text-white'}>
                  {liveState.vehicleHealth}%
                </span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-0.5">
                <div
                  className={`h-full transition-all duration-300 ${
                    liveState.vehicleHealth < 40
                      ? 'bg-red-500'
                      : liveState.vehicleHealth < 70
                      ? 'bg-[#FF8A32]'
                      : 'bg-[#35D58A]'
                  }`}
                  style={{ width: `${liveState.vehicleHealth}%` }}
                />
              </div>
            </div>

            {/* Strikes Indicators */}
            <div className="flex items-center gap-1" title="3 Strikes = Totaled Game Over">
              {[1, 2, 3].map((s) => (
                <span
                  key={s}
                  className={`w-2 h-2 rounded-full border border-white/20 ${
                    s <= liveState.crashStrikes
                      ? 'bg-red-500 ring-1 ring-red-400'
                      : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Score & Coins Collected */}
          <div className="flex items-center gap-4 text-xs font-speed font-bold pt-0.5">
            <div className="text-white">
              SCORE: <span className="text-[#27B9FF]">{liveState.score.toLocaleString()}</span>
            </div>
            <div className="text-[#FFB547] flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" />
              <span>+{liveState.coinsCollected}</span>
            </div>
          </div>

          {/* Live In-Race Challenges Pill (Triple Dash) */}
          <div className="hidden md:block p-2.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 space-y-1.5 w-60">
            <div className="text-[10px] font-racing font-bold text-[#FF8A32] uppercase tracking-wider">
              ROAD CHALLENGES
            </div>

            {/* Triple Dash Challenge */}
            <div className="text-[11px] text-slate-300 flex items-center justify-between">
              <span className="truncate">Triple Dash: 3 Cars in Row</span>
              <div className="flex items-center gap-1">
                {liveState.challenges[0]?.completed ? (
                  <span className="text-[#35D58A] font-bold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> DONE
                  </span>
                ) : (
                  <span className="font-speed font-bold text-white">
                    {liveState.consecutiveDashes}/3
                  </span>
                )}
              </div>
            </div>

            {/* Speed Demon Challenge */}
            <div className="text-[11px] text-slate-300 flex items-center justify-between">
              <span>Hit 280 KM/H</span>
              {liveState.challenges[1]?.completed ? (
                <span className="text-[#35D58A] font-bold flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> DONE
                </span>
              ) : (
                <span className="font-speed text-slate-400">{liveState.speedKmh}/280</span>
              )}
            </div>
          </div>
        </div>

        {/* Top-Center: Live Notification Popups */}
        {liveState.recentNotification && (
          <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-6 animate-bounce text-center">
            <div className="px-5 py-2 rounded-lg bg-black/90 backdrop-blur-md border border-[#FF3434]/60 shadow-2xl shadow-red-600/40">
              <div className="text-xl sm:text-2xl font-racing font-black text-white uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FFB547] via-white to-[#FF3434]">
                {liveState.recentNotification.text}
              </div>
              {liveState.recentNotification.sub && (
                <div className="text-[11px] font-racing font-bold text-[#27B9FF] uppercase tracking-widest mt-0.5">
                  {liveState.recentNotification.sub}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Top-Right: Speedometer & Tachometer Cluster, Camera & Pause */}
        <div className="pointer-events-auto flex flex-col items-end gap-2.5">
          {/* Top Quick Actions Row: Camera Modes (Upside) & Pause */}
          <div className="flex items-center gap-2">
            {/* Camera Perspective Mode Switcher (All 3 Views Upside) */}
            <div className="flex items-center p-0.5 rounded-lg bg-black/85 backdrop-blur-md border border-white/20 shadow-xl">
              {(['chase', 'hood', 'close'] as const).map((mode) => {
                const isActive = cameraMode === mode;
                const label = mode === 'chase' ? 'CHASE' : mode === 'hood' ? 'HOOD' : 'CLOSE';
                return (
                  <button
                    key={mode}
                    onClick={() => {
                      sound.playClick();
                      setCameraMode(mode);
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-racing font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#FF3434] text-white shadow-md shadow-red-600/30 font-black'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                    title={`Switch to ${label} Camera View (or Press C)`}
                  >
                    {isActive && <Camera className="w-3 h-3 text-white" />}
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Pause Button */}
            <button
              onClick={() => {
                sound.playClick();
                onPause();
              }}
              className="p-1 px-2.5 rounded-lg bg-black/85 backdrop-blur-md border border-white/20 text-white hover:bg-[#FF3434] hover:border-[#FF3434] transition-all shadow-xl flex items-center gap-1.5"
              title="Pause Race (Esc / P)"
            >
              <Pause className="w-3.5 h-3.5" />
              <span className="text-[10px] font-racing font-bold uppercase hidden sm:inline">Pause</span>
            </button>
          </div>

          {/* Speedometer & Tachometer Gauge Card on Top-Right */}
          <div className="racing-panel p-3 sm:p-3.5 rounded-xl border border-white/20 shadow-2xl flex items-center gap-3.5 bg-black/85 backdrop-blur-md">
            {/* Digital Speed Readout */}
            <div className="text-right min-w-[95px] sm:min-w-[110px]">
              <div className="text-4xl sm:text-5xl font-speed font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,52,52,0.4)] leading-none">
                {liveState.speedKmh}
              </div>
              <div className="text-[9px] sm:text-[10px] font-racing font-bold text-[#FF8A32] tracking-widest uppercase mt-0.5">
                KM / H
              </div>
            </div>

            <div className="w-px h-10 sm:h-12 bg-white/20" />

            {/* Gear & RPM Meter */}
            <div className="space-y-1 min-w-[75px] sm:min-w-[85px]">
              <div className="flex items-baseline justify-between">
                <span className="text-[9px] font-racing font-bold text-[#A1A8B5] uppercase">GEAR</span>
                <span className="text-xl sm:text-2xl font-racing font-black text-[#FF8A32]">
                  {liveState.currentGear}
                </span>
              </div>

              {/* RPM Bar */}
              <div>
                <div className="flex justify-between text-[8px] sm:text-[9px] font-mono-nums text-slate-400 mb-0.5">
                  <span>RPM</span>
                  <span>{liveState.rpm}</span>
                </div>
                <div className="w-20 sm:w-24 h-1.5 sm:h-2 bg-black/80 rounded-full overflow-hidden border border-white/10">
                  <div
                    className={`h-full transition-all duration-75 ${
                      rpmNormalized > 0.85
                        ? 'bg-[#FF3434] animate-pulse'
                        : rpmNormalized > 0.6
                        ? 'bg-[#FF8A32]'
                        : 'bg-[#27B9FF]'
                    }`}
                    style={{ width: `${rpmNormalized * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM HUD CONTROLS & GAUGES */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 sm:p-6 flex flex-col sm:flex-row items-end justify-between gap-4 pointer-events-none">
        {/* Bottom-Left: Desktop Keyboard Controls Guide */}
        <div className="pointer-events-auto flex items-end gap-3">
          <div className="hidden lg:flex flex-col gap-1.5 text-[10px] text-slate-300 bg-black/75 backdrop-blur-md p-3 rounded-xl border border-white/15 shadow-xl">
            <div className="text-[9px] font-racing font-bold text-[#A1A8B5] tracking-widest uppercase mb-0.5">Controls</div>
            <div><span className="text-white font-bold bg-white/10 px-1.5 py-0.5 rounded">W / ↑</span> Accelerate</div>
            <div><span className="text-white font-bold bg-white/10 px-1.5 py-0.5 rounded">A / D / ← →</span> Steer</div>
            <div><span className="text-white font-bold bg-white/10 px-1.5 py-0.5 rounded">Shift</span> Nitro Boost</div>
            <div><span className="text-white font-bold bg-white/10 px-1.5 py-0.5 rounded">C</span> Camera Mode</div>
            <div><span className="text-white font-bold bg-white/10 px-1.5 py-0.5 rounded">Space / S</span> Brake</div>
          </div>
        </div>

        {/* Bottom-Right: Nitro Canister & Mobile Controls */}
        <div className="pointer-events-auto flex items-end gap-4">
          {/* Nitro Gauge Bar */}
          <div className="racing-panel p-3.5 rounded-xl border border-white/15 shadow-2xl flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-1.5 text-xs font-racing font-bold uppercase text-[#27B9FF]">
              <Flame className="w-4 h-4 text-[#27B9FF]" />
              <span>NITRO</span>
              <span className="text-[10px] text-white font-mono-nums font-bold">
                {Math.round(liveState.nitroRemaining)}%
              </span>
            </div>

            <div className="w-36 sm:w-44 h-3 bg-black/80 rounded-full overflow-hidden border border-white/15 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-100 ${
                  liveState.isNitroActive
                    ? 'bg-gradient-to-r from-[#27B9FF] via-white to-[#FF3434] animate-pulse shadow-md shadow-cyan-400'
                    : 'bg-gradient-to-r from-[#1e40af] to-[#27B9FF]'
                }`}
                style={{ width: `${liveState.nitroRemaining}%` }}
              />
            </div>

            {/* Hold to Boost Trigger Button */}
            <button
              onPointerDown={() => setTouchNitro(true)}
              onPointerUp={() => setTouchNitro(false)}
              onPointerLeave={() => setTouchNitro(false)}
              className={`w-full py-1.5 rounded text-[11px] font-racing font-black uppercase tracking-wider transition-all cursor-pointer ${
                liveState.isNitroActive
                  ? 'bg-[#27B9FF] text-black shadow-lg shadow-cyan-500/50 scale-95'
                  : 'bg-[#171B24] hover:bg-[#202633] text-white border border-white/15'
              }`}
            >
              {liveState.isNitroActive ? 'BOOSTING!' : 'HOLD FOR NITRO (SHIFT)'}
            </button>
          </div>

          {/* Mobile Steering & Camera Buttons */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onPointerDown={() => setTouchSteer(-1)}
              onPointerUp={() => setTouchSteer(0)}
              onPointerLeave={() => setTouchSteer(0)}
              className="w-13 h-13 rounded-full bg-black/75 backdrop-blur-md border border-white/20 active:bg-[#FF3434] text-white flex items-center justify-center shadow-xl text-lg font-bold"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>

            <button
              onPointerDown={() => setTouchSteer(1)}
              onPointerUp={() => setTouchSteer(0)}
              onPointerLeave={() => setTouchSteer(0)}
              className="w-13 h-13 rounded-full bg-black/75 backdrop-blur-md border border-white/20 active:bg-[#FF3434] text-white flex items-center justify-center shadow-xl text-lg font-bold"
            >
              <ChevronRight className="w-7 h-7" />
            </button>

            <button
              onPointerDown={() => setTouchBrake(true)}
              onPointerUp={() => setTouchBrake(false)}
              onPointerLeave={() => setTouchBrake(false)}
              className="w-13 h-13 rounded-full bg-[#171B24]/90 border border-white/20 active:bg-red-700 text-white flex items-center justify-center shadow-xl"
              title="Emergency Brake"
            >
              <ArrowDown className="w-6 h-6 text-[#FF3434]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
