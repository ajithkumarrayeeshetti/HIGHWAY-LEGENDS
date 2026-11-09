import React, { useState } from 'react';
import { Vehicle, VehicleClass, GameScreen, PlayerProfile } from '../../types/game';
import { sound } from '../../utils/audio';
import { Showroom3D } from '../game3d/Showroom3D';
import {
  Wrench,
  Sparkles,
  Play,
  Lock,
  Check,
  Coins,
  Shield,
  Gauge,
  Zap,
  Activity,
  ArrowUpRight
} from 'lucide-react';

interface Screen05GarageProps {
  vehicles: Vehicle[];
  activeVehicleId: string;
  player: PlayerProfile;
  onSelectActiveCar: (vehicleId: string) => void;
  onBuyVehicle: (vehicleId: string) => void;
  onNavigate: (screen: GameScreen) => void;
  onTestDrive: (vehicle: Vehicle) => void;
}

export const Screen05Garage: React.FC<Screen05GarageProps> = ({
  vehicles,
  activeVehicleId,
  player,
  onSelectActiveCar,
  onBuyVehicle,
  onNavigate,
  onTestDrive
}) => {
  const [selectedClass, setSelectedClass] = useState<VehicleClass>('B');
  const [viewedVehicleId, setViewedVehicleId] = useState<string>(activeVehicleId);

  const viewedVehicle = vehicles.find((v) => v.id === viewedVehicleId) || vehicles[0];
  const isActive = viewedVehicle.id === activeVehicleId;

  const filteredVehicles = vehicles.filter((v) => v.class === selectedClass);
  const classes: VehicleClass[] = ['D', 'C', 'B', 'A', 'S', 'X'];

  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] bg-[#08090D] flex flex-col justify-between overflow-x-hidden select-none">
      {/* 3D Interactive Showroom Viewport (Full Background & Centerpiece) */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Showroom3D customization={viewedVehicle.customization} autoRotate={true} />
      </div>

      {/* Top Bar Floating Class Tabs */}
      <div className="relative z-10 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-[#08090D]/90 via-[#08090D]/50 to-transparent">
        <div>
          <div className="text-[10px] font-racing font-bold tracking-[0.3em] text-[#FF8A32] uppercase">
            Luxury Automotive Showroom
          </div>
          <h1 className="text-2xl sm:text-4xl font-racing font-black text-white uppercase tracking-tight">
            GARAGE <span className="text-[#FF3434]">HEADQUARTERS</span>
          </h1>
        </div>

        {/* Vehicle Class Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#171B24]/85 backdrop-blur-md rounded border border-white/10">
          {classes.map((cls) => {
            const isSelected = selectedClass === cls;
            return (
              <button
                key={cls}
                onClick={() => {
                  sound.playClick();
                  setSelectedClass(cls);
                  const firstOfClass = vehicles.find((v) => v.class === cls);
                  if (firstOfClass) setViewedVehicleId(firstOfClass.id);
                }}
                className={`px-3 py-1 text-xs font-racing font-bold tracking-wider rounded transition-all ${
                  isSelected
                    ? 'bg-[#FF3434] text-white shadow-md shadow-red-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                CLASS {cls}
              </button>
            );
          })}
        </div>
      </div>

      {/* Middle Floating Left & Right HUD Flanks */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 pointer-events-none p-4 sm:p-6 gap-4">
        {/* Left Side: Vehicle Roster Carousel */}
        <div className="lg:col-span-3 pointer-events-auto space-y-2 max-h-[480px] overflow-y-auto pr-2">
          <div className="text-xs font-racing font-bold text-[#A1A8B5] tracking-widest uppercase mb-2">
            Roster · Class {selectedClass} ({filteredVehicles.length})
          </div>

          {filteredVehicles.map((car) => {
            const isCurrent = car.id === viewedVehicleId;
            const isSelectedActive = car.id === activeVehicleId;

            return (
              <div
                key={car.id}
                onClick={() => {
                  sound.playClick();
                  setViewedVehicleId(car.id);
                }}
                className={`p-3 rounded border transition-all cursor-pointer flex items-center justify-between ${
                  isCurrent
                    ? 'bg-[#171B24]/95 border-[#FF3434] shadow-lg shadow-red-950/30'
                    : 'bg-[#11141B]/80 hover:bg-[#171B24]/80 border-white/10'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-racing font-black text-white">{car.name}</span>
                    {isSelectedActive && (
                      <span className="px-1.5 py-0.2 bg-[#FF3434]/20 border border-[#FF3434]/40 text-[#FF3434] text-[9px] font-bold rounded">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#A1A8B5]">{car.subtitle}</div>
                </div>

                <div>
                  {car.unlocked ? (
                    <span className="text-[11px] font-speed font-bold text-[#35D58A]">OWNED</span>
                  ) : (
                    <div className="flex items-center gap-1 text-[11px] font-speed font-bold text-[#FFB547]">
                      <Coins className="w-3 h-3" />
                      <span>{car.price.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Center: Open 3D Canvas Space */}
        <div className="lg:col-span-6 hidden lg:block" />

        {/* Right Side: Vehicle Performance Specs Panel */}
        <div className="lg:col-span-3 pointer-events-auto">
          <div className="racing-panel p-5 rounded border border-white/15 space-y-4 shadow-2xl">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="px-2 py-0.5 rounded bg-[#FF3434]/20 text-[#FF3434] font-racing font-bold tracking-widest text-[10px]">
                  CLASS {viewedVehicle.class} SPECIFICATION
                </span>
                <span className="text-slate-400 text-xs">
                  {viewedVehicle.unlocked ? 'Certified Fleet' : 'Available at Dealer'}
                </span>
              </div>
              <h2 className="text-2xl font-racing font-black text-white uppercase tracking-wide">
                {viewedVehicle.name}
              </h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {viewedVehicle.description}
              </p>
            </div>

            {/* Performance Bars */}
            <div className="space-y-2.5 pt-2 border-t border-white/10 text-xs">
              {/* Top Speed */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-[#FF3434]" />
                    <span>Top Speed</span>
                  </span>
                  <span className="font-mono-nums font-bold text-white">
                    {viewedVehicle.currentStats.topSpeed} KM/H
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#08090D] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FF3434]"
                    style={{ width: `${(viewedVehicle.currentStats.topSpeed / 460) * 100}%` }}
                  />
                </div>
              </div>

              {/* Acceleration */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#FF8A32]" />
                    <span>Acceleration</span>
                  </span>
                  <span className="font-mono-nums font-bold text-white">
                    {viewedVehicle.currentStats.acceleration} / 100
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#08090D] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FF8A32]"
                    style={{ width: `${viewedVehicle.currentStats.acceleration}%` }}
                  />
                </div>
              </div>

              {/* Handling */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#27B9FF]" />
                    <span>Handling</span>
                  </span>
                  <span className="font-mono-nums font-bold text-white">
                    {viewedVehicle.currentStats.handling} / 100
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#08090D] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#27B9FF]"
                    style={{ width: `${viewedVehicle.currentStats.handling}%` }}
                  />
                </div>
              </div>

              {/* Braking */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#35D58A]" />
                    <span>Braking Response</span>
                  </span>
                  <span className="font-mono-nums font-bold text-white">
                    {viewedVehicle.currentStats.braking} / 100
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#08090D] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#35D58A]"
                    style={{ width: `${viewedVehicle.currentStats.braking}%` }}
                  />
                </div>
              </div>

              {/* Nitro Performance */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Nitro Boost System</span>
                  </span>
                  <span className="font-mono-nums font-bold text-white">
                    {viewedVehicle.currentStats.nitro} / 100
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#08090D] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-400"
                    style={{ width: `${viewedVehicle.currentStats.nitro}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Unified Control Dock (Zero Viewport Occlusion compliant) */}
      <div className="relative z-20 p-4 sm:p-6 bg-gradient-to-t from-[#08090D] via-[#08090D]/90 to-transparent border-t border-white/10">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Status on viewed vehicle */}
          <div className="flex items-center gap-3">
            <span className="text-lg font-racing font-bold text-white">{viewedVehicle.name}</span>
            <span className="text-xs text-[#A1A8B5]">
              {isActive ? 'Currently Equipped' : viewedVehicle.unlocked ? 'Owned in Garage' : 'Requires Purchase'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {viewedVehicle.unlocked ? (
              <>
                {!isActive ? (
                  <button
                    onClick={() => {
                      sound.playSelect();
                      onSelectActiveCar(viewedVehicle.id);
                    }}
                    className="h-10 flex items-center justify-center gap-2 px-5 bg-[#FF3434] hover:bg-[#e02626] text-white rounded text-xs font-racing font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-600/30 cursor-pointer touch-manipulation active:scale-[0.98]"
                  >
                    <Check className="w-4 h-4" />
                    <span>Select Car</span>
                  </button>
                ) : (
                  <span className="h-10 px-4 bg-[#171B24] border border-[#35D58A]/40 text-[#35D58A] rounded text-xs font-racing font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4" />
                    Selected
                  </span>
                )}

                <button
                  onClick={() => {
                    sound.playClick();
                    onNavigate('customization');
                  }}
                  className="h-10 flex items-center justify-center gap-2 px-4 bg-[#171B24] hover:bg-[#202633] border border-white/15 text-white rounded text-xs font-racing font-bold uppercase tracking-wider transition-all cursor-pointer touch-manipulation active:scale-[0.98]"
                >
                  <Wrench className="w-4 h-4 text-[#27B9FF]" />
                  <span>Customize & Paint</span>
                </button>

                <button
                  onClick={() => {
                    sound.playSelect();
                    onTestDrive(viewedVehicle);
                  }}
                  className="h-10 flex items-center justify-center gap-2 px-4 bg-[#171B24] hover:bg-[#202633] border border-white/15 text-white rounded text-xs font-racing font-bold uppercase tracking-wider transition-all cursor-pointer touch-manipulation active:scale-[0.98]"
                >
                  <Play className="w-4 h-4 text-[#35D58A]" />
                  <span>Test Drive</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  sound.playSelect();
                  onBuyVehicle(viewedVehicle.id);
                }}
                disabled={player.coins < viewedVehicle.price}
                className={`h-10 flex items-center justify-center gap-2 px-6 rounded text-xs font-racing font-bold uppercase tracking-wider transition-all ${
                  player.coins >= viewedVehicle.price
                    ? 'bg-[#FF8A32] hover:bg-[#e67520] text-white shadow-lg shadow-orange-600/30 cursor-pointer touch-manipulation active:scale-[0.98]'
                    : 'bg-[#171B24] text-slate-500 border border-white/5 cursor-not-allowed'
                }`}
              >
                <Coins className="w-4 h-4" />
                <span>Unlock for {viewedVehicle.price.toLocaleString()} CR</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
