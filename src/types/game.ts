export type GameScreen =
  | 'intro'
  | 'main-menu'
  | 'career'
  | 'world-map'
  | 'garage'
  | 'customization'
  | 'race-select'
  | 'racing'
  | 'pause'
  | 'results'
  | 'profile'
  | 'leaderboard'
  | 'daily-challenges'
  | 'achievements'
  | 'settings';

export type VehicleClass = 'D' | 'C' | 'B' | 'A' | 'S' | 'X';

export interface VehicleStats {
  topSpeed: number; // km/h (e.g. 240 - 430)
  acceleration: number; // 0-100 score (e.g. 60 - 99)
  handling: number; // 0-100
  braking: number; // 0-100
  nitro: number; // 0-100
}

export interface VehicleCustomization {
  bodyColor: string;
  finish: 'gloss' | 'metallic' | 'matte' | 'carbon';
  wheelColor: string;
  neonColor: string; // e.g. '#27B9FF' or 'none'
  spoilerStyle: 'stock' | 'sport' | 'gt-wing' | 'hyper-aero';
  windowTint: 'clear' | 'light' | 'dark' | 'limo';
  engineLevel: number; // 1 to 5
  turboLevel: number;
  brakesLevel: number;
  tiresLevel: number;
  suspensionLevel: number;
  nitroLevel: number;
}

export interface Vehicle {
  id: string;
  name: string;
  class: VehicleClass;
  subtitle: string;
  price: number;
  unlocked: boolean;
  baseStats: VehicleStats;
  currentStats: VehicleStats;
  customization: VehicleCustomization;
  accentColor: string;
  description: string;
}

export interface GameCharacter {
  id: string;
  name: string;
  role: string;
  bio: string;
  vehicle: string;
  quote: string;
  avatarColor: string;
}

export interface CareerChapter {
  id: number;
  chapterNumber: string;
  title: string;
  location: string;
  locationId: string;
  objective: string;
  bossRival: string;
  rewardCoins: number;
  rewardXp: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  progressPercent: number;
  imageKey: string;
}

export interface WorldLocation {
  id: string;
  name: string;
  tagline: string;
  description: string;
  mapX: number; // percent 0-100
  mapY: number; // percent 0-100
  racesAvailable: number;
  completionPercent: number;
  unlocked: boolean;
  environmentType: string;
  bestLap: string;
}

export interface RaceEvent {
  id: string;
  title: string;
  type: 'Endless Highway' | 'Career Race' | 'Time Trial' | 'Police Chase' | 'Drift Challenge' | 'Daily Challenge';
  location: string;
  difficulty: 'Rookie' | 'Street' | 'Pro' | 'Apex' | 'Legendary';
  distanceKm: number;
  entryRequirement: string;
  rewardCoins: number;
  rewardXp: number;
  trafficDensity: 'low' | 'medium' | 'high' | 'extreme';
  targetScore: number;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  unit: string;
  rewardCoins: number;
  rewardXp: number;
  completed: boolean;
  claimed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress: number;
  target: number;
  rewardXp: number;
  iconName: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Apex';
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  level: number;
  score: number;
  wins: number;
  car: string;
  isPlayer: boolean;
}

export interface PlayerProfile {
  name: string;
  callsign: string;
  avatarId: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  coins: number;
  reputation: number;
  totalRaces: number;
  victories: number;
  totalDistanceKm: number;
  bestSpeedKmh: number;
  carsOwnedCount: number;
  activeVehicleId: string;
}

export interface GameSettings {
  graphicsQuality: 'ultra' | 'high' | 'medium' | 'low';
  masterVolume: number;
  sfxVolume: number;
  engineVolume: number;
  musicVolume: number;
  cameraDistance: 'close' | 'standard' | 'far' | 'cockpit';
  controlSensitivity: number; // 0.5 to 1.5
  controlType: 'keyboard' | 'touch';
  fullScreen: boolean;
  bloomEnabled: boolean;
  motionBlur: boolean;
}

export type CameraViewMode = 'chase' | 'hood' | 'close';

export interface InRaceChallenge {
  id: string;
  title: string;
  progress: number;
  target: number;
  completed: boolean;
}

export interface RaceLiveState {
  speedKmh: number;
  distanceMeters: number;
  score: number;
  coinsCollected: number;
  nearMisses: number;
  comboMultiplier: number;
  nitroRemaining: number; // 0 - 100
  isNitroActive: boolean;
  rpm: number;
  currentGear: number;
  raceTimeSeconds: number;
  isGameOver: boolean;
  isVictory: boolean;
  isWrecked: boolean;
  cameraMode: CameraViewMode;
  vehicleHealth: number; // 0 to 100
  crashStrikes: number; // 0 to 3 (3 = game over wrecked)
  consecutiveDashes: number; // consecutive near misses (target 3)
  challenges: InRaceChallenge[];
  objectiveProgress: number;
  objectiveTarget: number;
  objectiveLabel: string;
  recentNotification: { text: string; sub?: string; id: number } | null;
}

