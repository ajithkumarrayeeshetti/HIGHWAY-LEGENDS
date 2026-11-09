import React, { useState } from 'react';
import { GameSettings, GameScreen } from '../../types/game';
import { sound } from '../../utils/audio';
import {
  Monitor,
  Volume2,
  Sliders,
  Keyboard,
  RotateCcw,
  Check,
  Maximize2
} from 'lucide-react';

interface Screen15SettingsProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onResetProgress: () => void;
  onNavigate: (screen: GameScreen) => void;
}

export const Screen15Settings: React.FC<Screen15SettingsProps> = ({
  settings,
  onUpdateSettings,
  onResetProgress,
  onNavigate
}) => {
  const [localSettings, setLocalSettings] = useState<GameSettings>({ ...settings });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSave = () => {
    sound.playSelect();
    onUpdateSettings(localSettings);
    sound.setMasterVolume(localSettings.masterVolume);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const toggleFullscreen = () => {
    sound.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-65px)] p-4 sm:p-8 lg:p-12 space-y-8 select-none bg-[#08090D]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="text-xs font-racing font-bold tracking-[0.3em] text-[#FF8A32] uppercase">
            Hardware & Simulation Config
          </div>
          <h1 className="text-3xl sm:text-5xl font-racing font-black text-white uppercase tracking-tight">
            GAME <span className="text-[#FF3434]">SETTINGS</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A8B5] mt-1 max-w-2xl">
            Configure WebGL rendering pipelines, procedural audio synthesizers, camera dynamics, and steering inputs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-2 px-4 py-2 bg-[#171B24] hover:bg-[#202633] border border-white/10 text-white rounded text-xs font-racing font-bold uppercase tracking-wider transition-colors"
          >
            <Maximize2 className="w-4 h-4 text-[#27B9FF]" />
            <span>Toggle Fullscreen</span>
          </button>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Graphics Quality */}
        <div className="racing-panel p-6 rounded-xl border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-sm font-racing font-bold text-white uppercase">
            <Monitor className="w-4 h-4 text-[#27B9FF]" />
            <span>Visual Fidelity & Graphics</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[#A1A8B5] mb-2 uppercase">Render Quality Preset</label>
              <div className="grid grid-cols-4 gap-2">
                {(['low', 'medium', 'high', 'ultra'] as const).map((q) => {
                  const isSelected = localSettings.graphicsQuality === q;
                  return (
                    <button
                      key={q}
                      onClick={() => {
                        sound.playClick();
                        setLocalSettings({ ...localSettings, graphicsQuality: q });
                      }}
                      className={`h-9 flex items-center justify-center text-xs font-racing font-bold uppercase rounded border transition-all cursor-pointer touch-manipulation active:scale-[0.98] ${
                        isSelected
                          ? 'bg-[#FF3434] border-[#FF3434] text-white shadow'
                          : 'bg-[#11141B] border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {q}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-[#A1A8B5] mb-2 uppercase">Camera Chase Perspective</label>
              <div className="grid grid-cols-4 gap-2">
                {(['close', 'standard', 'far', 'cockpit'] as const).map((c) => {
                  const isSelected = localSettings.cameraDistance === c;
                  return (
                    <button
                      key={c}
                      onClick={() => {
                        sound.playClick();
                        setLocalSettings({ ...localSettings, cameraDistance: c });
                      }}
                      className={`h-9 flex items-center justify-center text-xs font-racing font-bold uppercase rounded border transition-all cursor-pointer touch-manipulation active:scale-[0.98] ${
                        isSelected
                          ? 'bg-[#27B9FF] border-[#27B9FF] text-black shadow font-black'
                          : 'bg-[#11141B] border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Audio Volume Controls */}
        <div className="racing-panel p-6 rounded-xl border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-sm font-racing font-bold text-white uppercase">
            <Volume2 className="w-4 h-4 text-[#FF8A32]" />
            <span>Audio & Exhaust Acoustics</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-[#A1A8B5] mb-1">
                <span className="uppercase">Master Volume</span>
                <span className="font-mono-nums font-bold text-white">
                  {Math.round(localSettings.masterVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={localSettings.masterVolume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setLocalSettings({ ...localSettings, masterVolume: val });
                  sound.setMasterVolume(val);
                }}
                className="w-full accent-[#FF3434] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[#A1A8B5] mb-1">
                <span className="uppercase">Engine RPM Acoustics</span>
                <span className="font-mono-nums font-bold text-white">
                  {Math.round(localSettings.engineVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={localSettings.engineVolume}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, engineVolume: parseFloat(e.target.value) })
                }
                className="w-full accent-[#FF8A32] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[#A1A8B5] mb-1">
                <span className="uppercase">Sound Effects (SFX / Nitro)</span>
                <span className="font-mono-nums font-bold text-white">
                  {Math.round(localSettings.sfxVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={localSettings.sfxVolume}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, sfxVolume: parseFloat(e.target.value) })
                }
                className="w-full accent-[#27B9FF] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Keybinding Reference Guide */}
        <div className="racing-panel p-6 rounded-xl border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-sm font-racing font-bold text-white uppercase">
            <Keyboard className="w-4 h-4 text-[#35D58A]" />
            <span>Driver Input Controls</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-white/5">
              <span className="text-slate-300">Accelerate / Gas</span>
              <div className="flex gap-1.5">
                <span className="px-2 py-0.5 rounded bg-black/60 border border-white/15 text-white font-mono-nums font-bold">W</span>
                <span className="px-2 py-0.5 rounded bg-black/60 border border-white/15 text-white font-mono-nums font-bold">↑</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-white/5">
              <span className="text-slate-300">Steer Left / Right</span>
              <div className="flex gap-1.5">
                <span className="px-2 py-0.5 rounded bg-black/60 border border-white/15 text-white font-mono-nums font-bold">A / D</span>
                <span className="px-2 py-0.5 rounded bg-black/60 border border-white/15 text-white font-mono-nums font-bold">← →</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-white/5">
              <span className="text-slate-300">Nitro Boost Injection</span>
              <span className="px-3 py-0.5 rounded bg-[#FF3434]/20 border border-[#FF3434]/40 text-[#FF3434] font-mono-nums font-bold">
                SHIFT (HOLD)
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-white/5">
              <span className="text-slate-300">Brake / Reverse</span>
              <div className="flex gap-1.5">
                <span className="px-2 py-0.5 rounded bg-black/60 border border-white/15 text-white font-mono-nums font-bold">SPACE</span>
                <span className="px-2 py-0.5 rounded bg-black/60 border border-white/15 text-white font-mono-nums font-bold">S</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-300">Pause / Menu</span>
              <span className="px-2 py-0.5 rounded bg-black/60 border border-white/15 text-white font-mono-nums font-bold">
                ESC
              </span>
            </div>
          </div>
        </div>

        {/* Career Reset / Danger Zone */}
        <div className="racing-panel p-6 rounded-xl border border-white/10 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-racing font-bold text-red-400 uppercase">
              <RotateCcw className="w-4 h-4 text-[#FF3434]" />
              <span>Career Data Management</span>
            </div>
            <p className="text-xs text-[#A1A8B5] mt-2 leading-relaxed">
              Reset all career trophies, coins, customized fleet configurations, and leaderboard ranking back to factory rookie state.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10">
            {showResetConfirm ? (
              <div className="space-y-2">
                <div className="text-xs text-red-400 font-bold uppercase">
                  Are you absolutely certain?
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      sound.playCrash();
                      onResetProgress();
                      setShowResetConfirm(false);
                    }}
                    className="h-10 flex-1 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded text-xs font-racing font-bold uppercase tracking-wider cursor-pointer touch-manipulation active:scale-[0.98]"
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="h-10 flex-1 flex items-center justify-center bg-[#171B24] hover:bg-[#202633] text-slate-300 hover:text-white rounded text-xs font-racing font-bold uppercase tracking-wider cursor-pointer touch-manipulation active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full h-10 flex items-center justify-center bg-[#171B24] hover:bg-red-950/40 border border-red-500/30 text-red-400 rounded text-xs font-racing font-bold uppercase tracking-wider transition-colors cursor-pointer touch-manipulation active:scale-[0.98]"
              >
                Reset Career Progress
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Save Settings Bar */}
      <div className="flex items-center justify-end gap-3 max-w-5xl mx-auto pt-4 border-t border-white/10">
        <button
          onClick={handleSave}
          className={`h-10 flex items-center justify-center gap-2 px-6 rounded text-xs font-racing font-bold uppercase tracking-wider transition-all shadow-lg cursor-pointer touch-manipulation active:scale-[0.98] ${
            savedFeedback
              ? 'bg-[#35D58A] text-black shadow-emerald-500/30 font-black'
              : 'bg-[#FF3434] hover:bg-[#e02626] text-white shadow-red-600/30'
          }`}
        >
          <Check className="w-4 h-4" />
          <span>{savedFeedback ? 'Saved Successfully!' : 'Save Preferences'}</span>
        </button>
      </div>
    </div>
  );
};
