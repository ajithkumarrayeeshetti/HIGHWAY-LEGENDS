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

  const handleSteerPointerDown = (dir: number, e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    setTouchSteer(dir);
  };

  const handleSteerPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    setTouchSteer(0);
  };

  const handleBrakePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    setTouchBrake(true);
  };

  const handleBrakePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    setTouchBrake(false);
  };

  const handleNitroPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    setTouchNitro(true);
  };

  const handleNitroPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    setTouchNitro(false);
  };

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

      {/* DESKTOP BOTTOM HUD CONTROLS & GAUGES (Hidden on Mobile) */}
      <div className="hidden md:flex absolute bottom-0 left-0 right-0 z-20 p-4 sm:p-6 items-end justify-between gap-4 pointer-events-none">
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

        {/* Bottom-Right: Nitro Canister Card (Desktop) */}
        <div className="pointer-events-auto flex items-end gap-4">
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
        </div>
      </div>

      {/* MOBILE GAME CONTROLS: FIXED CORNER BUTTONS (Responsive & Safe-Area Aware) */}

      {/* 1. LEFT BUTTON FIXED AT BOTTOM-LEFT CORNER */}
      <div
        className="fixed z-40 md:hidden pointer-events-auto select-none touch-none"
        style={{
          left: 'max(16px, env(safe-area-inset-left, 16px))',
          bottom: 'max(16px, env(safe-area-inset-bottom, 16px))'
        }}
      >
        <button
          type="button"
          aria-label="Steer Left"
          onPointerDown={(e) => handleSteerPointerDown(-1, e)}
          onPointerUp={handleSteerPointerUp}
          onPointerLeave={handleSteerPointerUp}
          onPointerCancel={handleSteerPointerUp}
          className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl border-2 flex flex-col items-center justify-center shadow-2xl transition-all active:scale-95 touch-none cursor-pointer ${
            touchSteer === -1
              ? 'border-[#FF3434] bg-[#FF3434]/40 shadow-[0_0_25px_rgba(255,52,52,0.7)] scale-95 ring-2 ring-[#FF3434]'
              : 'border-white/30 bg-black/85 backdrop-blur-md hover:border-white/60 text-white shadow-black/80'
          }`}
          title="Steer Left"
        >
          <ChevronLeft className="w-8 h-8 text-white drop-shadow-md" />
          <span className="text-[10px] font-racing font-black text-white/90 tracking-widest -mt-1">LEFT</span>
        </button>
      </div>

      {/* 2. EMERGENCY BRAKE BUTTON (Stacked above Left button on bottom-left) */}
      <div
        className="fixed z-40 md:hidden pointer-events-auto select-none touch-none"
        style={{
          left: 'max(16px, env(safe-area-inset-left, 16px))',
          bottom: 'calc(max(16px, env(safe-area-inset-bottom, 16px)) + 74px)'
        }}
      >
        <button
          type="button"
          aria-label="Emergency Brake"
          onPointerDown={handleBrakePointerDown}
          onPointerUp={handleBrakePointerUp}
          onPointerLeave={handleBrakePointerUp}
          onPointerCancel={handleBrakePointerUp}
          className={`w-12 h-12 rounded-xl border flex flex-col items-center justify-center shadow-xl transition-all touch-none cursor-pointer ${
            touchBrake
              ? 'bg-red-600 border-red-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.7)] scale-95'
              : 'bg-[#171B24]/90 backdrop-blur-md border-white/20 text-slate-300 hover:text-white'
          }`}
          title="Emergency Brake"
        >
          <ArrowDown className={`w-5 h-5 ${touchBrake ? 'text-white' : 'text-[#FF3434]'}`} />
          <span className="text-[8px] font-racing font-bold uppercase">Brake</span>
        </button>
      </div>

      {/* 3. RIGHT BUTTON FIXED AT BOTTOM-RIGHT CORNER */}
      <div
        className="fixed z-40 md:hidden pointer-events-auto select-none touch-none"
        style={{
          right: 'max(16px, env(safe-area-inset-right, 16px))',
          bottom: 'max(16px, env(safe-area-inset-bottom, 16px))'
        }}
      >
        <button
          type="button"
          aria-label="Steer Right"
          onPointerDown={(e) => handleSteerPointerDown(1, e)}
          onPointerUp={handleSteerPointerUp}
          onPointerLeave={handleSteerPointerUp}
          onPointerCancel={handleSteerPointerUp}
          className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl border-2 flex flex-col items-center justify-center shadow-2xl transition-all active:scale-95 touch-none cursor-pointer ${
            touchSteer === 1
              ? 'border-[#FF3434] bg-[#FF3434]/40 shadow-[0_0_25px_rgba(255,52,52,0.7)] scale-95 ring-2 ring-[#FF3434]'
              : 'border-white/30 bg-black/85 backdrop-blur-md hover:border-white/60 text-white shadow-black/80'
          }`}
          title="Steer Right"
        >
          <ChevronRight className="w-8 h-8 text-white drop-shadow-md" />
          <span className="text-[10px] font-racing font-black text-white/90 tracking-widest -mt-1">RIGHT</span>
        </button>
      </div>

      {/* 4. NITRO BOOST BUTTON (Stacked above Right button on bottom-right) */}
      <div
        className="fixed z-40 md:hidden pointer-events-auto select-none touch-none"
        style={{
          right: 'max(16px, env(safe-area-inset-right, 16px))',
          bottom: 'calc(max(16px, env(safe-area-inset-bottom, 16px)) + 74px)'
        }}
      >
        <button
          type="button"
          aria-label="Nitro Boost"
          onPointerDown={handleNitroPointerDown}
          onPointerUp={handleNitroPointerUp}
          onPointerLeave={handleNitroPointerUp}
          onPointerCancel={handleNitroPointerUp}
          className={`w-12 h-12 rounded-xl border flex flex-col items-center justify-center shadow-xl transition-all touch-none cursor-pointer ${
            liveState.isNitroActive
              ? 'bg-[#27B9FF] border-cyan-300 text-black shadow-[0_0_15px_rgba(39,185,255,0.7)] scale-95'
              : 'bg-[#171B24]/90 backdrop-blur-md border-white/20 text-[#27B9FF] hover:border-cyan-400'
          }`}
          title="Nitro Boost"
        >
          <Flame className="w-5 h-5 text-[#27B9FF]" />
          <span className="text-[8px] font-racing font-black uppercase text-white">
            {Math.round(liveState.nitroRemaining)}%
          </span>
        </button>
      </div>

      {/* 5. MOBILE BOTTOM-CENTER NITRO RESERVE PILL (Clear of both corner buttons) */}
      <div
        className="fixed z-30 md:hidden pointer-events-none left-1/2 -translate-x-1/2 select-none"
        style={{
          bottom: 'max(16px, env(safe-area-inset-bottom, 16px))'
        }}
      >
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-white/15 shadow-2xl">
          <Flame className={`w-3.5 h-3.5 ${liveState.isNitroActive ? 'text-[#FF3434] animate-pulse' : 'text-[#27B9FF]'}`} />
          <div className="w-24 sm:w-32 h-2 bg-white/10 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-100 ${
                liveState.isNitroActive
                  ? 'bg-gradient-to-r from-[#27B9FF] via-white to-[#FF3434] animate-pulse'
                  : 'bg-[#27B9FF]'
              }`}
              style={{ width: `${liveState.nitroRemaining}%` }}
            />
          </div>
          <span className="text-[10px] font-racing font-bold text-white font-mono-nums">
            {Math.round(liveState.nitroRemaining)}%
          </span>
        </div>
      </div>
    </div>
  );
};
