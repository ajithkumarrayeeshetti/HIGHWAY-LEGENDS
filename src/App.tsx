/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  GameScreen,
  PlayerProfile,
  Vehicle,
  VehicleCustomization,
  CareerChapter,
  WorldLocation,
  RaceEvent,
  RaceLiveState,
  GameSettings,
  DailyChallenge
} from './types/game';
import {
  INITIAL_PLAYER_PROFILE,
  INITIAL_VEHICLES,
  CHARACTERS,
  CAREER_CHAPTERS,
  WORLD_LOCATIONS,
  RACE_EVENTS,
  DAILY_CHALLENGES,
  ACHIEVEMENTS,
  LEADERBOARD_ENTRIES
} from './data/gameData';
import { sound } from './utils/audio';

import { GameHeader } from './components/ui/GameHeader';
import { Screen01Intro } from './components/screens/Screen01Intro';
import { Screen02MainMenu } from './components/screens/Screen02MainMenu';
import { Screen03Career } from './components/screens/Screen03Career';
import { Screen04WorldMap } from './components/screens/Screen04WorldMap';
import { Screen05Garage } from './components/screens/Screen05Garage';
import { Screen06Customization } from './components/screens/Screen06Customization';
import { Screen07RaceSelect } from './components/screens/Screen07RaceSelect';
import { Screen08RacingHUD } from './components/screens/Screen08RacingHUD';
import { Screen09PauseMenu } from './components/screens/Screen09PauseMenu';
import { Screen10RaceResults } from './components/screens/Screen10RaceResults';
import { Screen11Profile } from './components/screens/Screen11Profile';
import { Screen12Leaderboard } from './components/screens/Screen12Leaderboard';
import { Screen13DailyChallenges } from './components/screens/Screen13DailyChallenges';
import { Screen14Achievements } from './components/screens/Screen14Achievements';
import { Screen15Settings } from './components/screens/Screen15Settings';

// LocalStorage Persistence Keys
const STORAGE_KEYS = {
  PLAYER: 'hl_player_profile',
  VEHICLES: 'hl_vehicles',
  CAREER: 'hl_career_chapters',
  CHALLENGES: 'hl_daily_challenges',
  SETTINGS: 'hl_settings'
};

function loadStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('intro');
  const [player, setPlayer] = useState<PlayerProfile>(() => loadStored(STORAGE_KEYS.PLAYER, INITIAL_PLAYER_PROFILE));
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => loadStored(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES));
  const [careerChapters, setCareerChapters] = useState<CareerChapter[]>(() => loadStored(STORAGE_KEYS.CAREER, CAREER_CHAPTERS));
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>(() => loadStored(STORAGE_KEYS.CHALLENGES, DAILY_CHALLENGES));
  const [isMuted, setIsMuted] = useState(false);

  // Settings State
  const [settings, setSettings] = useState<GameSettings>(() => loadStored(STORAGE_KEYS.SETTINGS, {
    graphicsQuality: 'ultra',
    masterVolume: 0.8,
    sfxVolume: 0.8,
    engineVolume: 0.75,
    musicVolume: 0.6,
    cameraDistance: 'standard',
    controlSensitivity: 1.0,
    controlType: 'keyboard',
    fullScreen: false,
    bloomEnabled: true,
    motionBlur: true
  }));

  // Auto-persist state changes
  useEffect(() => {
    saveStored(STORAGE_KEYS.PLAYER, player);
  }, [player]);

  useEffect(() => {
    saveStored(STORAGE_KEYS.VEHICLES, vehicles);
  }, [vehicles]);

  useEffect(() => {
    saveStored(STORAGE_KEYS.CAREER, careerChapters);
  }, [careerChapters]);

  useEffect(() => {
    saveStored(STORAGE_KEYS.CHALLENGES, dailyChallenges);
  }, [dailyChallenges]);

  useEffect(() => {
    saveStored(STORAGE_KEYS.SETTINGS, settings);
    sound.setMasterVolume(settings.masterVolume);
  }, [settings]);

  // Active Race State
  const [activeRaceEvent, setActiveRaceEvent] = useState<RaceEvent>(RACE_EVENTS[0]);
  const [isPaused, setIsPaused] = useState(false);
  const [lastRaceState, setLastRaceState] = useState<RaceLiveState>({
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
    challenges: [],
    objectiveProgress: 0,
    objectiveTarget: 5000,
    objectiveLabel: 'Target: 5 KM',
    recentNotification: null
  });
  const [raceVictory, setRaceVictory] = useState<boolean>(true);

  // Current Active Car
  const activeVehicle =
    vehicles.find((v) => v.id === player.activeVehicleId) || vehicles[0];

  // Navigation Helper
  const navigateTo = (screen: GameScreen) => {
    setIsPaused(false);
    setCurrentScreen(screen);
  };

  // Sound Mute Toggle
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  // Select Active Vehicle in Garage
  const handleSelectActiveCar = (vehicleId: string) => {
    setPlayer((prev) => ({
      ...prev,
      activeVehicleId: vehicleId
    }));
  };

  // Buy Vehicle
  const handleBuyVehicle = (vehicleId: string) => {
    const target = vehicles.find((v) => v.id === vehicleId);
    if (!target || player.coins < target.price) return;

    setPlayer((prev) => ({
      ...prev,
      coins: prev.coins - target.price,
      carsOwnedCount: prev.carsOwnedCount + 1,
      activeVehicleId: vehicleId
    }));

    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, unlocked: true } : v))
    );
  };

  // Save Customization
  const handleSaveCustomization = (custom: VehicleCustomization, coinCost: number) => {
    setPlayer((prev) => ({
      ...prev,
      coins: Math.max(0, prev.coins - coinCost)
    }));

    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === activeVehicle.id) {
          // Recalculate stats based on upgrade levels
          const boostTop = (custom.engineLevel - 1) * 8;
          const boostAcc = (custom.turboLevel - 1) * 3;
          const boostBrake = (custom.brakesLevel - 1) * 3;
          const boostHandle = (custom.suspensionLevel - 1) * 2 + (custom.tiresLevel - 1) * 2;
          const boostNitro = (custom.nitroLevel - 1) * 4;

          return {
            ...v,
            customization: custom,
            currentStats: {
              topSpeed: v.baseStats.topSpeed + boostTop,
              acceleration: Math.min(100, v.baseStats.acceleration + boostAcc),
              handling: Math.min(100, v.baseStats.handling + boostHandle),
              braking: Math.min(100, v.baseStats.braking + boostBrake),
              nitro: Math.min(100, v.baseStats.nitro + boostNitro)
            }
          };
        }
        return v;
      })
    );

    navigateTo('garage');
  };

  // Launch a race
  const handleLaunchRace = (event: RaceEvent) => {
    setActiveRaceEvent(event);
    setIsPaused(false);
    setCurrentScreen('racing');
  };

  // Quick Race
  const handleQuickRace = () => {
    handleLaunchRace(RACE_EVENTS[0]); // Endless Highway
  };

  // Test Drive
  const handleTestDrive = (v: Vehicle) => {
    handleSelectActiveCar(v.id);
    handleLaunchRace(RACE_EVENTS[0]);
  };

  // Start Career Chapter
  const handleStartChapter = (ch: CareerChapter) => {
    const matchingEvent: RaceEvent = {
      id: `career-${ch.id}`,
      title: `${ch.chapterNumber}: ${ch.title}`,
      type: 'Career Race',
      location: ch.location,
      difficulty: ch.id <= 2 ? 'Street' : ch.id <= 4 ? 'Pro' : 'Apex',
      distanceKm: 8.0 + ch.id * 2.5,
      entryRequirement: 'None',
      rewardCoins: ch.rewardCoins,
      rewardXp: ch.rewardXp,
      trafficDensity: ch.id > 3 ? 'high' : 'medium',
      targetScore: 50000 + ch.id * 15000
    };
    handleLaunchRace(matchingEvent);
  };

  // World Map Location Race
  const handleLocationRace = (loc: WorldLocation) => {
    const locEvent: RaceEvent = {
      id: `world-${loc.id}`,
      title: `${loc.name} Grand Sprint`,
      type: 'Career Race',
      location: loc.name,
      difficulty: 'Pro',
      distanceKm: 10.0,
      entryRequirement: 'None',
      rewardCoins: 28000,
      rewardXp: 4200,
      trafficDensity: 'medium',
      targetScore: 65000
    };
    handleLaunchRace(locEvent);
  };

  // Finish Race Handler
  const handleFinishRace = (isVictory: boolean, finalState: RaceLiveState) => {
    setRaceVictory(isVictory);
    setLastRaceState(finalState);

    // Credit rewards
    const earnedCoins = isVictory ? activeRaceEvent.rewardCoins : Math.round(activeRaceEvent.rewardCoins * 0.4);
    const earnedXp = isVictory ? activeRaceEvent.rewardXp : Math.round(activeRaceEvent.rewardXp * 0.4);
    const nearMissBonus = finalState.nearMisses * 500;
    const coinPickupsBonus = finalState.coinsCollected * 250;
    const totalAwarded = earnedCoins + nearMissBonus + coinPickupsBonus;

    setPlayer((prev) => {
      const newXp = prev.xp + earnedXp;
      let newLevel = prev.level;
      let nextLevelXp = prev.nextLevelXp;
      if (newXp >= nextLevelXp) {
        newLevel += 1;
        nextLevelXp += 5000;
      }

      return {
        ...prev,
        coins: prev.coins + totalAwarded,
        xp: newXp,
        level: newLevel,
        nextLevelXp,
        reputation: prev.reputation + (isVictory ? 150 : 50),
        totalRaces: prev.totalRaces + 1,
        victories: prev.victories + (isVictory ? 1 : 0),
        totalDistanceKm: parseFloat((prev.totalDistanceKm + finalState.distanceMeters / 1000).toFixed(1)),
        bestSpeedKmh: Math.max(prev.bestSpeedKmh, finalState.speedKmh)
      };
    });

    // Advance Career chapter ONLY IF player actually won the race (isVictory) and wasn't wrecked
    if (activeRaceEvent.id.startsWith('career-')) {
      const chNum = parseInt(activeRaceEvent.id.replace('career-', ''), 10);
      setCareerChapters((prev) =>
        prev.map((c) => {
          if (c.id === chNum) {
            if (isVictory && !finalState.isWrecked) {
              return { ...c, isCompleted: true, progressPercent: 100 };
            } else {
              // Failed mission: update partial progress up to 90%, do not mark completed
              const partial = activeRaceEvent.distanceKm > 0
                ? Math.min(90, Math.round((finalState.distanceMeters / (activeRaceEvent.distanceKm * 1000)) * 100))
                : c.progressPercent;
              return { ...c, isCompleted: false, progressPercent: Math.max(c.progressPercent, partial) };
            }
          }
          if (c.id === chNum + 1) {
            // ONLY unlock next chapter if previous chapter was won
            if (isVictory && !finalState.isWrecked) {
              return { ...c, isUnlocked: true, progressPercent: Math.max(c.progressPercent, 10) };
            }
          }
          return c;
        })
      );
    }

    // Advance daily challenges
    setDailyChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === 'daily-1') {
          // Distance
          const newProg = parseFloat((ch.progress + finalState.distanceMeters / 1000).toFixed(1));
          return { ...ch, progress: newProg, completed: newProg >= ch.target };
        }
        if (ch.id === 'daily-2') {
          // Near misses
          const newMiss = ch.progress + finalState.nearMisses;
          return { ...ch, progress: newMiss, completed: newMiss >= ch.target };
        }
        if (ch.id === 'daily-3' && isVictory) {
          // Win race
          const newWins = ch.progress + 1;
          return { ...ch, progress: newWins, completed: newWins >= ch.target };
        }
        if (ch.id === 'daily-4' && finalState.speedKmh >= 250) {
          return { ...ch, progress: Math.max(ch.progress, finalState.speedKmh), completed: true };
        }
        if (ch.id === 'daily-5') {
          // Coins collected
          const newCoins = ch.progress + finalState.coinsCollected;
          return { ...ch, progress: newCoins, completed: newCoins >= ch.target };
        }
        return ch;
      })
    );

    setCurrentScreen('results');
  };

  // Claim Daily Challenge Reward
  const handleClaimChallengeReward = (id: string) => {
    const ch = dailyChallenges.find((c) => c.id === id);
    if (!ch || ch.claimed || !ch.completed) return;

    setPlayer((prev) => ({
      ...prev,
      coins: prev.coins + ch.rewardCoins,
      xp: prev.xp + ch.rewardXp
    }));

    setDailyChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, claimed: true } : c))
    );
  };

  // Update Callsign
  const handleUpdateCallsign = (newCallsign: string) => {
    setPlayer((prev) => ({ ...prev, callsign: newCallsign }));
  };

  // Reset Progress
  const handleResetProgress = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.PLAYER);
      localStorage.removeItem(STORAGE_KEYS.VEHICLES);
      localStorage.removeItem(STORAGE_KEYS.CAREER);
      localStorage.removeItem(STORAGE_KEYS.CHALLENGES);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    } catch {}
    setPlayer(INITIAL_PLAYER_PROFILE);
    setVehicles(INITIAL_VEHICLES);
    setCareerChapters(CAREER_CHAPTERS);
    setDailyChallenges(DAILY_CHALLENGES);
    setSettings({
      graphicsQuality: 'ultra',
      masterVolume: 0.8,
      sfxVolume: 0.8,
      engineVolume: 0.75,
      musicVolume: 0.6,
      cameraDistance: 'standard',
      controlSensitivity: 1.0,
      controlType: 'keyboard',
      fullScreen: false,
      bloomEnabled: true,
      motionBlur: true
    });
    sound.setMasterVolume(0.8);
    navigateTo('main-menu');
  };

  return (
    <div className="w-full min-h-screen bg-[#08090D] text-white flex flex-col font-sans select-none antialiased">
      {/* Global AAA Header (Hidden in Intro and Racing HUD) */}
      {currentScreen !== 'intro' && currentScreen !== 'racing' && (
        <GameHeader
          player={player}
          currentScreen={currentScreen}
          onNavigate={navigateTo}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          showBack={currentScreen !== 'main-menu'}
        />
      )}

      {/* Main Screen Router */}
      <main className="flex-1 w-full">
        {currentScreen === 'intro' && (
          <Screen01Intro onStart={() => navigateTo('main-menu')} />
        )}

        {currentScreen === 'main-menu' && (
          <Screen02MainMenu
            player={player}
            activeVehicle={activeVehicle}
            onNavigate={navigateTo}
            onQuickRace={handleQuickRace}
          />
        )}

        {currentScreen === 'career' && (
          <Screen03Career
            chapters={careerChapters}
            onStartChapter={handleStartChapter}
            onNavigate={navigateTo}
          />
        )}

        {currentScreen === 'world-map' && (
          <Screen04WorldMap
            locations={WORLD_LOCATIONS}
            onSelectLocationRace={handleLocationRace}
            onNavigate={navigateTo}
          />
        )}

        {currentScreen === 'garage' && (
          <Screen05Garage
            vehicles={vehicles}
            activeVehicleId={player.activeVehicleId}
            player={player}
            onSelectActiveCar={handleSelectActiveCar}
            onBuyVehicle={handleBuyVehicle}
            onNavigate={navigateTo}
            onTestDrive={handleTestDrive}
          />
        )}

        {currentScreen === 'customization' && (
          <Screen06Customization
            vehicle={activeVehicle}
            player={player}
            onSaveCustomization={handleSaveCustomization}
            onNavigate={navigateTo}
          />
        )}

        {currentScreen === 'race-select' && (
          <Screen07RaceSelect
            events={RACE_EVENTS}
            onSelectEvent={handleLaunchRace}
            onNavigate={navigateTo}
          />
        )}

        {currentScreen === 'racing' && (
          <>
            <Screen08RacingHUD
              vehicle={activeVehicle}
              event={activeRaceEvent}
              isPaused={isPaused}
              onPause={() => setIsPaused(true)}
              onFinishRace={handleFinishRace}
            />

            {/* In-game Pause Overlay */}
            {isPaused && (
              <Screen09PauseMenu
                event={activeRaceEvent}
                liveState={lastRaceState}
                onResume={() => setIsPaused(false)}
                onRestart={() => {
                  setIsPaused(false);
                  handleLaunchRace(activeRaceEvent);
                }}
                onOpenSettings={() => {
                  setIsPaused(false);
                  navigateTo('settings');
                }}
                onMainMenu={() => {
                  setIsPaused(false);
                  navigateTo('main-menu');
                }}
              />
            )}
          </>
        )}

        {currentScreen === 'results' && (
          <Screen10RaceResults
            isVictory={raceVictory}
            vehicle={activeVehicle}
            event={activeRaceEvent}
            finalState={lastRaceState}
            onRaceAgain={() => handleLaunchRace(activeRaceEvent)}
            onNextMission={() => {
              if (activeRaceEvent.id.startsWith('career-') && raceVictory && !lastRaceState.isWrecked) {
                const currentChNum = parseInt(activeRaceEvent.id.replace('career-', ''), 10);
                const nextCh = careerChapters.find((c) => c.id === currentChNum + 1);
                if (nextCh && nextCh.isUnlocked) {
                  handleStartChapter(nextCh);
                  return;
                }
              }
              navigateTo('career');
            }}
            onReturnToGarage={() => navigateTo('garage')}
          />
        )}

        {currentScreen === 'profile' && (
          <Screen11Profile
            player={player}
            characters={CHARACTERS}
            onUpdateCallsign={handleUpdateCallsign}
            onNavigate={navigateTo}
          />
        )}

        {currentScreen === 'leaderboard' && (
          <Screen12Leaderboard
            entries={LEADERBOARD_ENTRIES}
            onNavigate={navigateTo}
          />
        )}

        {currentScreen === 'daily-challenges' && (
          <Screen13DailyChallenges
            challenges={dailyChallenges}
            onClaimReward={handleClaimChallengeReward}
            onNavigate={navigateTo}
          />
        )}

        {currentScreen === 'achievements' && (
          <Screen14Achievements
            achievements={ACHIEVEMENTS}
            onNavigate={navigateTo}
          />
        )}

        {currentScreen === 'settings' && (
          <Screen15Settings
            settings={settings}
            onUpdateSettings={setSettings}
            onResetProgress={handleResetProgress}
            onNavigate={navigateTo}
          />
        )}
      </main>
    </div>
  );
}
