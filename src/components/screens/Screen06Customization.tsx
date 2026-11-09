import React, { useState } from 'react';
import { Vehicle, VehicleCustomization, GameScreen, PlayerProfile } from '../../types/game';
import { sound } from '../../utils/audio';
import { Showroom3D } from '../game3d/Showroom3D';
import {
  Palette,
  Gauge,
  Sparkles,
  RotateCcw,
  Check,
  Coins,
  ChevronRight,
  Layers,
  ArrowUp
} from 'lucide-react';

interface Screen06CustomizationProps {
  vehicle: Vehicle;
  player: PlayerProfile;
  onSaveCustomization: (custom: VehicleCustomization, coinCost: number) => void;
  onNavigate: (screen: GameScreen) => void;
}

export const Screen06Customization: React.FC<Screen06CustomizationProps> = ({
  vehicle,
  player,
  onSaveCustomization,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'exterior' | 'performance'>('exterior');
  const [draftCustom, setDraftCustom] = useState<VehicleCustomization>({ ...vehicle.customization });

  // Color Swatches
  const PAINT_COLORS = [
    { label: 'Crimson Red', hex: '#FF3434' },
    { label: 'Electric Blue', hex: '#27B9FF' },
    { label: 'Obsidian Black', hex: '#0B0D12' },
    { label: 'Pearl White', hex: '#F1F5F9' },
    { label: 'Sunset Orange', hex: '#FF8A32' },
    { label: 'Emerald Acid', hex: '#35D58A' },
    { label: 'Cyber Violet', hex: '#8B5CF6' },
    { label: 'Titanium Gold', hex: '#FFB547' }
  ];

  const NEON_COLORS = [
    { label: 'None', hex: 'none' },
    { label: 'Electric Cyan', hex: '#27B9FF' },
    { label: 'Laser Red', hex: '#FF3434' },
    { label: 'Acid Green', hex: '#35D58A' },
    { label: 'Neon Amber', hex: '#FF8A32' },
    { label: 'Hyper Violet', hex: '#8B5CF6' }
  ];

  const SPOILER_STYLES = [
    { id: 'stock', label: 'Stock Aero Lip' },
    { id: 'sport', label: 'Sport Downforce' },
    { id: 'gt-wing', label: 'GT-3 Carbon Wing' },
    { id: 'hyper-aero', label: 'Hyper Apex Wing' }
  ];

  const FINISH_TYPES: Array<'gloss' | 'metallic' | 'matte' | 'carbon'> = [
    'gloss',
    'metallic',
    'matte',
    'carbon'
  ];

  // Calculate upgrade coin costs for performance parts
  const performanceParts: Array<{
    key: keyof VehicleCustomization;
    label: string;
    level: number;
    statBoost: string;
  }> = [
    { key: 'engineLevel', label: 'Engine V8 Tuning', level: draftCustom.engineLevel, statBoost: '+10 KM/H Top Speed' },
    { key: 'turboLevel', label: 'Twin Turbos', level: draftCustom.turboLevel, statBoost: '+4 Acceleration' },
    { key: 'brakesLevel', label: 'Ceramic Brakes', level: draftCustom.brakesLevel, statBoost: '+5 Braking Response' },
    { key: 'tiresLevel', label: 'Track Slick Tires', level: draftCustom.tiresLevel, statBoost: '+4 Handling' },
    { key: 'suspensionLevel', label: 'Active Suspension', level: draftCustom.suspensionLevel, statBoost: '+3 Handling' },
    { key: 'nitroLevel', label: 'Liquid Nitro Injectors', level: draftCustom.nitroLevel, statBoost: '+8 Nitro Duration' }
  ];

  // Estimate cost of pending upgrades
  let totalPendingCost = 0;
  performanceParts.forEach((part) => {
    const origLevel = (vehicle.customization as unknown as Record<string, number>)[part.key] || 1;
    const diff = part.level - origLevel;
    if (diff > 0) {
      totalPendingCost += diff * 4500;
    }
  });

  const handleReset = () => {
    sound.playClick();
    setDraftCustom({ ...vehicle.customization });
  };

  const handleApply = () => {
    sound.playSelect();
    onSaveCustomization(draftCustom, totalPendingCost);
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] bg-[#08090D] flex flex-col justify-between overflow-x-hidden select-none">
      {/* 3D Live Vehicle Preview */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Showroom3D customization={draftCustom} autoRotate={false} />
      </div>

      {/* Top Header / Mode Switcher */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 p-4 sm:p-6 bg-gradient-to-b from-[#08090D]/90 via-[#08090D]/50 to-transparent">
        <div>
          <div className="text-[10px] font-racing font-bold tracking-[0.3em] text-[#27B9FF] uppercase">
            Performance Atelier & Paint Shop
          </div>
          <h1 className="text-2xl sm:text-4xl font-racing font-black text-white uppercase tracking-tight">
            CUSTOMIZATION <span className="text-[#FF3434]">LAB</span>
          </h1>
        </div>

        {/* Category Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#171B24]/90 backdrop-blur-md rounded border border-white/10">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('exterior');
            }}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-racing font-bold tracking-wider rounded transition-all ${
              activeTab === 'exterior'
                ? 'bg-[#FF3434] text-white shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Exterior Styling</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('performance');
            }}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-racing font-bold tracking-wider rounded transition-all ${
              activeTab === 'performance'
                ? 'bg-[#FF3434] text-white shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gauge className="w-4 h-4" />
            <span>Performance Tuning</span>
          </button>
        </div>
      </div>

      {/* Floating Side Inspector (Left/Right) */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 p-4 sm:p-6 gap-6 pointer-events-none">
        {/* Left Side: Customization Tool Panel */}
        <div className="lg:col-span-4 pointer-events-auto racing-panel p-5 rounded border border-white/15 space-y-5 max-h-[520px] overflow-y-auto">
          {activeTab === 'exterior' ? (
            <>
              {/* Finish Type */}
              <div>
                <label className="block text-xs font-racing font-bold text-[#A1A8B5] uppercase tracking-wider mb-2">
                  Paint Finish Formula
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FINISH_TYPES.map((finish) => {
                    const isSelected = draftCustom.finish === finish;
                    return (
                      <button
                        key={finish}
                        onClick={() => {
                          sound.playClick();
                          setDraftCustom({ ...draftCustom, finish });
                        }}
                        className={`px-3 py-2 text-xs font-racing font-bold uppercase rounded border transition-all ${
                          isSelected
                            ? 'bg-[#FF3434] border-[#FF3434] text-white shadow'
                            : 'bg-[#11141B] border-white/10 text-slate-300 hover:bg-[#1a1f2b]'
                        }`}
                      >
                        {finish}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Body Paint Swatches */}
              <div>
                <label className="block text-xs font-racing font-bold text-[#A1A8B5] uppercase tracking-wider mb-2">
                  Body Color Palette
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {PAINT_COLORS.map((c) => {
                    const isSelected = draftCustom.bodyColor === c.hex;
                    return (
                      <button
                        key={c.hex}
                        onClick={() => {
                          sound.playClick();
                          setDraftCustom({ ...draftCustom, bodyColor: c.hex });
                        }}
                        style={{ backgroundColor: c.hex }}
                        className={`h-9 rounded border transition-transform ${
                          isSelected ? 'ring-2 ring-white scale-110 shadow-lg' : 'border-white/15 hover:scale-105'
                        }`}
                        title={c.label}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Underglow Neon */}
              <div>
                <label className="block text-xs font-racing font-bold text-[#A1A8B5] uppercase tracking-wider mb-2">
                  Neon Underglow Light Bar
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {NEON_COLORS.map((n) => {
                    const isSelected = draftCustom.neonColor === n.hex;
                    return (
                      <button
                        key={n.hex}
                        onClick={() => {
                          sound.playClick();
                          setDraftCustom({ ...draftCustom, neonColor: n.hex });
                        }}
                        className={`px-2 py-1.5 text-[11px] font-racing font-bold uppercase rounded border transition-all truncate ${
                          isSelected
                            ? 'bg-[#27B9FF] border-[#27B9FF] text-black shadow'
                            : 'bg-[#11141B] border-white/10 text-slate-300 hover:bg-[#1a1f2b]'
                        }`}
                      >
                        {n.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Spoiler Style */}
              <div>
                <label className="block text-xs font-racing font-bold text-[#A1A8B5] uppercase tracking-wider mb-2">
                  Rear Wing Aerodynamics
                </label>
                <div className="space-y-1.5">
                  {SPOILER_STYLES.map((sp) => {
                    const isSelected = draftCustom.spoilerStyle === sp.id;
                    return (
                      <button
                        key={sp.id}
                        onClick={() => {
                          sound.playClick();
                          setDraftCustom({
                            ...draftCustom,
                            spoilerStyle: sp.id as VehicleCustomization['spoilerStyle']
                          });
                        }}
                        className={`w-full px-3 py-2 text-xs font-racing font-bold uppercase rounded border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-[#FF3434]/20 border-[#FF3434] text-white'
                            : 'bg-[#11141B] border-white/10 text-slate-300 hover:bg-[#1a1f2b]'
                        }`}
                      >
                        <span>{sp.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#FF3434]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            // Performance Upgrades
            <div className="space-y-4">
              <div className="text-xs text-[#A1A8B5]">
                Upgrade mechanical stages to increase top speed, handling, and nitro output.
              </div>

              {performanceParts.map((part) => {
                const currentLevel = part.level;
                return (
                  <div key={part.key} className="p-3 bg-[#11141B] rounded border border-white/10">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-racing font-bold text-white">{part.label}</span>
                      <span className="text-[#FFB547] font-mono-nums font-bold">STAGE {currentLevel} / 5</span>
                    </div>
                    <div className="text-[11px] text-[#35D58A] mb-2">{part.statBoost}</div>

                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((lvl) => {
                        return (
                          <button
                            key={lvl}
                            onClick={() => {
                              sound.playClick();
                              setDraftCustom({
                                ...draftCustom,
                                [part.key]: lvl
                              });
                            }}
                            className={`flex-1 h-3 rounded-sm transition-all ${
                              lvl <= currentLevel
                                ? 'bg-gradient-to-r from-[#FF8A32] to-[#FF3434]'
                                : 'bg-[#171B24] hover:bg-[#202633]'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Dock */}
      <div className="relative z-20 p-4 sm:p-6 bg-gradient-to-t from-[#08090D] via-[#08090D]/90 to-transparent border-t border-white/10">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={handleReset}
              className="h-10 flex items-center justify-center gap-2 px-4 bg-[#171B24] hover:bg-[#202633] text-slate-300 hover:text-white rounded border border-white/10 font-racing font-bold uppercase transition-all cursor-pointer touch-manipulation active:scale-[0.98]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Configuration</span>
            </button>

            {totalPendingCost > 0 && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[#A1A8B5]">Upgrade Cost:</span>
                <Coins className="w-4 h-4 text-[#FFB547]" />
                <span className="font-speed font-bold text-white">
                  {totalPendingCost.toLocaleString()} CR
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                sound.playClick();
                onNavigate('garage');
              }}
              className="h-10 px-4 flex items-center justify-center bg-[#171B24] hover:bg-[#202633] border border-white/10 text-white rounded text-xs font-racing font-bold uppercase tracking-wider transition-all cursor-pointer touch-manipulation active:scale-[0.98]"
            >
              Back to Showroom
            </button>

            <button
              onClick={handleApply}
              disabled={player.coins < totalPendingCost}
              className={`h-10 flex items-center justify-center gap-2 px-6 rounded text-xs font-racing font-bold uppercase tracking-wider transition-all ${
                player.coins >= totalPendingCost
                  ? 'bg-[#FF3434] hover:bg-[#e02626] text-white shadow-lg shadow-red-600/30 cursor-pointer touch-manipulation active:scale-[0.98]'
                  : 'bg-[#171B24] text-slate-500 cursor-not-allowed border border-white/5'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
