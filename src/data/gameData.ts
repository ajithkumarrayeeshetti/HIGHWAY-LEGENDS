import {
  Vehicle,
  GameCharacter,
  CareerChapter,
  WorldLocation,
  RaceEvent,
  DailyChallenge,
  Achievement,
  LeaderboardEntry,
  PlayerProfile
} from '../types/game';

export const INITIAL_PLAYER_PROFILE: PlayerProfile = {
  name: 'Alex Vance',
  callsign: 'PHANTOM',
  avatarId: 'racer-1',
  level: 18,
  xp: 14250,
  nextLevelXp: 18000,
  coins: 48500,
  reputation: 3420,
  totalRaces: 64,
  victories: 48,
  totalDistanceKm: 1248.6,
  bestSpeedKmh: 378.4,
  carsOwnedCount: 4,
  activeVehicleId: 'apex-gt'
};

export const INITIAL_VEHICLES: Vehicle[] = [
  // D CLASS (Starter)
  {
    id: 'strada-r',
    name: 'Strada R-Sport',
    class: 'D',
    subtitle: 'Balanced Urban Tuner',
    price: 0,
    unlocked: true,
    baseStats: { topSpeed: 235, acceleration: 65, handling: 72, braking: 70, nitro: 60 },
    currentStats: { topSpeed: 245, acceleration: 68, handling: 74, braking: 72, nitro: 65 },
    customization: {
      bodyColor: '#A1A8B5',
      finish: 'gloss',
      wheelColor: '#171B24',
      neonColor: 'none',
      spoilerStyle: 'stock',
      windowTint: 'light',
      engineLevel: 2,
      turboLevel: 1,
      brakesLevel: 2,
      tiresLevel: 2,
      suspensionLevel: 1,
      nitroLevel: 1
    },
    accentColor: '#A1A8B5',
    description: 'A nimble twin-turbo starter coupe engineered for tight street corners and city highway initiation.'
  },
  {
    id: 'kanso-turbo',
    name: 'Kanso RS-T',
    class: 'D',
    subtitle: 'Lightweight JDM Revival',
    price: 15000,
    unlocked: true,
    baseStats: { topSpeed: 248, acceleration: 68, handling: 76, braking: 72, nitro: 62 },
    currentStats: { topSpeed: 248, acceleration: 68, handling: 76, braking: 72, nitro: 62 },
    customization: {
      bodyColor: '#FFFFFF',
      finish: 'gloss',
      wheelColor: '#FFB547',
      neonColor: 'none',
      spoilerStyle: 'sport',
      windowTint: 'light',
      engineLevel: 1,
      turboLevel: 1,
      brakesLevel: 1,
      tiresLevel: 1,
      suspensionLevel: 1,
      nitroLevel: 1
    },
    accentColor: '#FFFFFF',
    description: 'High-revving rotary turbo with exceptional balance through chicane transitions.'
  },

  // C CLASS (Street Performance)
  {
    id: 'phantom-r32',
    name: 'Phantom R-32',
    class: 'C',
    subtitle: 'Underground Street Weapon',
    price: 28000,
    unlocked: true,
    baseStats: { topSpeed: 275, acceleration: 74, handling: 78, braking: 75, nitro: 70 },
    currentStats: { topSpeed: 285, acceleration: 78, handling: 80, braking: 78, nitro: 74 },
    customization: {
      bodyColor: '#27B9FF',
      finish: 'metallic',
      wheelColor: '#11141B',
      neonColor: '#27B9FF',
      spoilerStyle: 'sport',
      windowTint: 'dark',
      engineLevel: 2,
      turboLevel: 2,
      brakesLevel: 2,
      tiresLevel: 2,
      suspensionLevel: 2,
      nitroLevel: 2
    },
    accentColor: '#27B9FF',
    description: 'All-wheel drive grip platform with aggressive low-end torque for midnight street showdowns.'
  },
  {
    id: 'tormenta-gt',
    name: 'Tormenta 400',
    class: 'C',
    subtitle: 'Muscle Interceptor',
    price: 34000,
    unlocked: false,
    baseStats: { topSpeed: 282, acceleration: 77, handling: 70, braking: 73, nitro: 76 },
    currentStats: { topSpeed: 282, acceleration: 77, handling: 70, braking: 73, nitro: 76 },
    customization: {
      bodyColor: '#FF8A32',
      finish: 'matte',
      wheelColor: '#171B24',
      neonColor: 'none',
      spoilerStyle: 'stock',
      windowTint: 'dark',
      engineLevel: 1,
      turboLevel: 1,
      brakesLevel: 1,
      tiresLevel: 1,
      suspensionLevel: 1,
      nitroLevel: 1
    },
    accentColor: '#FF8A32',
    description: 'Supercharged V8 brute force delivering explosive straightaway acceleration.'
  },

  // B CLASS (Performance Sports)
  {
    id: 'apex-gt',
    name: 'Apex GT-V',
    class: 'B',
    subtitle: 'Precision Track Special',
    price: 45000,
    unlocked: true,
    baseStats: { topSpeed: 305, acceleration: 82, handling: 85, braking: 83, nitro: 80 },
    currentStats: { topSpeed: 320, acceleration: 87, handling: 89, braking: 86, nitro: 85 },
    customization: {
      bodyColor: '#FF3434', // Hero Red
      finish: 'metallic',
      wheelColor: '#11141B',
      neonColor: '#FF3434',
      spoilerStyle: 'gt-wing',
      windowTint: 'limo',
      engineLevel: 3,
      turboLevel: 3,
      brakesLevel: 3,
      tiresLevel: 3,
      suspensionLevel: 3,
      nitroLevel: 3
    },
    accentColor: '#FF3434',
    description: 'The iconic Highway Legends crimson stallion. Carbon composite monocoque with active downforce wings.'
  },
  {
    id: 'vortex-spec',
    name: 'Vortex Spec-R',
    class: 'B',
    subtitle: 'Mid-Engine Cyber Coupe',
    price: 52000,
    unlocked: false,
    baseStats: { topSpeed: 312, acceleration: 84, handling: 86, braking: 84, nitro: 82 },
    currentStats: { topSpeed: 312, acceleration: 84, handling: 86, braking: 84, nitro: 82 },
    customization: {
      bodyColor: '#8B5CF6',
      finish: 'gloss',
      wheelColor: '#FFFFFF',
      neonColor: '#8B5CF6',
      spoilerStyle: 'sport',
      windowTint: 'dark',
      engineLevel: 1,
      turboLevel: 1,
      brakesLevel: 1,
      tiresLevel: 1,
      suspensionLevel: 1,
      nitroLevel: 1
    },
    accentColor: '#8B5CF6',
    description: 'Laser-guided chassis response with twin hybrid electric motors assisting the rear axle.'
  },

  // A CLASS (Supercars)
  {
    id: 'chimera-s',
    name: 'Chimera S-Concept',
    class: 'A',
    subtitle: 'Aero-Sculpted Predator',
    price: 85000,
    unlocked: false,
    baseStats: { topSpeed: 345, acceleration: 89, handling: 90, braking: 88, nitro: 88 },
    currentStats: { topSpeed: 345, acceleration: 89, handling: 90, braking: 88, nitro: 88 },
    customization: {
      bodyColor: '#35D58A',
      finish: 'metallic',
      wheelColor: '#171B24',
      neonColor: '#35D58A',
      spoilerStyle: 'gt-wing',
      windowTint: 'limo',
      engineLevel: 1,
      turboLevel: 1,
      brakesLevel: 1,
      tiresLevel: 1,
      suspensionLevel: 1,
      nitroLevel: 1
    },
    accentColor: '#35D58A',
    description: 'V10 naturally aspirated screamer generating 850 horsepower at 9,200 RPM.'
  },
  {
    id: 'solstice-evo',
    name: 'Solstice EVO 1',
    class: 'A',
    subtitle: 'Endurance Prototype',
    price: 98000,
    unlocked: false,
    baseStats: { topSpeed: 352, acceleration: 91, handling: 92, braking: 90, nitro: 89 },
    currentStats: { topSpeed: 352, acceleration: 91, handling: 92, braking: 90, nitro: 89 },
    customization: {
      bodyColor: '#FFB547',
      finish: 'gloss',
      wheelColor: '#11141B',
      neonColor: '#FF8A32',
      spoilerStyle: 'hyper-aero',
      windowTint: 'dark',
      engineLevel: 1,
      turboLevel: 1,
      brakesLevel: 1,
      tiresLevel: 1,
      suspensionLevel: 1,
      nitroLevel: 1
    },
    accentColor: '#FFB547',
    description: 'Derived directly from 24-Hour Aurelia endurance racing with inverted ground effect tunnels.'
  },

  // S CLASS (Hypercars)
  {
    id: 'shadow-x',
    name: 'Shadow X-900',
    class: 'S',
    subtitle: "Victor Blaze's Rival Machine",
    price: 180000,
    unlocked: false,
    baseStats: { topSpeed: 390, acceleration: 95, handling: 94, braking: 93, nitro: 94 },
    currentStats: { topSpeed: 390, acceleration: 95, handling: 94, braking: 93, nitro: 94 },
    customization: {
      bodyColor: '#0A0C10',
      finish: 'matte',
      wheelColor: '#FF3434',
      neonColor: '#FF3434',
      spoilerStyle: 'hyper-aero',
      windowTint: 'limo',
      engineLevel: 1,
      turboLevel: 1,
      brakesLevel: 1,
      tiresLevel: 1,
      suspensionLevel: 1,
      nitroLevel: 1
    },
    accentColor: '#FF3434',
    description: 'The terrifying obsidian black apex machine driven by Victor Blaze. Quad-turbo quad-motor 1,400 HP hybrid.'
  },
  {
    id: 'valkyrie-zero',
    name: 'Valkyrie Zero',
    class: 'S',
    subtitle: 'Carbon Aero Hypercar',
    price: 210000,
    unlocked: false,
    baseStats: { topSpeed: 405, acceleration: 96, handling: 95, braking: 95, nitro: 96 },
    currentStats: { topSpeed: 405, acceleration: 96, handling: 95, braking: 95, nitro: 96 },
    customization: {
      bodyColor: '#E2E8F0',
      finish: 'metallic',
      wheelColor: '#27B9FF',
      neonColor: '#27B9FF',
      spoilerStyle: 'hyper-aero',
      windowTint: 'dark',
      engineLevel: 1,
      turboLevel: 1,
      brakesLevel: 1,
      tiresLevel: 1,
      suspensionLevel: 1,
      nitroLevel: 1
    },
    accentColor: '#27B9FF',
    description: 'Zero-compromise aerodynamics with cockpit canopy modeled after fighter jets.'
  },
  {
    id: 'kronos-v12',
    name: 'Kronos V12 Speedster',
    class: 'S',
    subtitle: 'Pure Atmospheric Hypercar',
    price: 240000,
    unlocked: false,
    baseStats: { topSpeed: 412, acceleration: 97, handling: 93, braking: 94, nitro: 95 },
    currentStats: { topSpeed: 412, acceleration: 97, handling: 93, braking: 94, nitro: 95 },
    customization: {
      bodyColor: '#38BDF8',
      finish: 'gloss',
      wheelColor: '#171B24',
      neonColor: 'none',
      spoilerStyle: 'gt-wing',
      windowTint: 'light',
      engineLevel: 1,
      turboLevel: 1,
      brakesLevel: 1,
      tiresLevel: 1,
      suspensionLevel: 1,
      nitroLevel: 1
    },
    accentColor: '#38BDF8',
    description: 'A titanium-chassis speedster that screams past 400 KM/H with unfiltered V12 acoustics.'
  },

  // X CLASS (Legendary Special)
  {
    id: 'hyperion-gtr',
    name: 'Hyperion GTR Apex',
    class: 'X',
    subtitle: 'The Ultimate Racing God',
    price: 500000,
    unlocked: false,
    baseStats: { topSpeed: 435, acceleration: 99, handling: 98, braking: 97, nitro: 99 },
    currentStats: { topSpeed: 435, acceleration: 99, handling: 98, braking: 97, nitro: 99 },
    customization: {
      bodyColor: '#FF3434',
      finish: 'carbon',
      wheelColor: '#FFD700',
      neonColor: '#FF8A32',
      spoilerStyle: 'hyper-aero',
      windowTint: 'limo',
      engineLevel: 1,
      turboLevel: 1,
      brakesLevel: 1,
      tiresLevel: 1,
      suspensionLevel: 1,
      nitroLevel: 1
    },
    accentColor: '#FFD700',
    description: 'Experimental hyper-kinetic racing machine. Surpasses all legal competition boundaries.'
  },
  {
    id: 'aegis-pulsar',
    name: 'Aegis Pulsar-X',
    class: 'X',
    subtitle: 'Quantum Drive Concept',
    price: 650000,
    unlocked: false,
    baseStats: { topSpeed: 440, acceleration: 100, handling: 99, braking: 98, nitro: 100 },
    currentStats: { topSpeed: 440, acceleration: 100, handling: 99, braking: 98, nitro: 100 },
    customization: {
      bodyColor: '#10B981',
      finish: 'metallic',
      wheelColor: '#11141B',
      neonColor: '#10B981',
      spoilerStyle: 'hyper-aero',
      windowTint: 'dark',
      engineLevel: 1,
      turboLevel: 1,
      brakesLevel: 1,
      tiresLevel: 1,
      suspensionLevel: 1,
      nitroLevel: 1
    },
    accentColor: '#10B981',
    description: 'State of the art torque vectoring that defies centrifugal limits.'
  },
  {
    id: 'aurora-zenith',
    name: 'Aurora Zenith LM',
    class: 'X',
    subtitle: 'Prototype Le Mans Champion',
    price: 750000,
    unlocked: false,
    baseStats: { topSpeed: 445, acceleration: 100, handling: 100, braking: 99, nitro: 99 },
    currentStats: { topSpeed: 445, acceleration: 100, handling: 100, braking: 99, nitro: 99 },
    customization: {
      bodyColor: '#F43F5E',
      finish: 'gloss',
      wheelColor: '#FFFFFF',
      neonColor: '#27B9FF',
      spoilerStyle: 'hyper-aero',
      windowTint: 'limo',
      engineLevel: 1,
      turboLevel: 1,
      brakesLevel: 1,
      tiresLevel: 1,
      suspensionLevel: 1,
      nitroLevel: 1
    },
    accentColor: '#F43F5E',
    description: 'Built purely for high-speed supremacy across the longest straightaways in Aurelia.'
  },
  {
    id: 'centurion-infinite',
    name: 'Centurion 00-Infinite',
    class: 'X',
    subtitle: 'Autonomous Ghost Racer',
    price: 900000,
    unlocked: false,
    baseStats: { topSpeed: 450, acceleration: 100, handling: 100, braking: 100, nitro: 100 },
    currentStats: { topSpeed: 450, acceleration: 100, handling: 100, braking: 100, nitro: 100 },
    customization: {
      bodyColor: '#1E1B4B',
      finish: 'carbon',
      wheelColor: '#FF3434',
      neonColor: '#FF3434',
      spoilerStyle: 'hyper-aero',
      windowTint: 'limo',
      engineLevel: 1,
      turboLevel: 1,
      brakesLevel: 1,
      tiresLevel: 1,
      suspensionLevel: 1,
      nitroLevel: 1
    },
    accentColor: '#FF3434',
    description: 'The pinnacle of automotive engineering. Built to dominate any highway in existence.'
  }
];

export const CHARACTERS: GameCharacter[] = [
  {
    id: 'player',
    name: 'Alex "Phantom" Vance',
    role: 'The Unknown Challenger (You)',
    bio: 'An exceptionally gifted driver rising from underground midnight runs to challenge the established racing elite.',
    vehicle: 'Apex GT-V',
    quote: '"I don\'t race for points. I race to break limits."',
    avatarColor: '#FF3434'
  },
  {
    id: 'victor',
    name: 'Victor Blaze',
    role: 'Reigning Apex League Champion',
    bio: 'Three-time international titleholder. Ruthless, cold-blooded precision behind the wheel of the Shadow X-900.',
    vehicle: 'Shadow X-900',
    quote: '"The highway belongs to predators. Rookies merely bleed upon it."',
    avatarColor: '#FF3434'
  },
  {
    id: 'sophia',
    name: 'Sophia Carter',
    role: 'Veteran Racing Mentor',
    bio: 'Former Grand Prix champion turned underground strategist. She sees legendary potential in the player.',
    vehicle: 'Solstice EVO 1',
    quote: '"Speed without control is just a spectacular crash. Master the apex."',
    avatarColor: '#27B9FF'
  },
  {
    id: 'marcus',
    name: 'Marcus Steel',
    role: 'King of Metro Underground',
    bio: 'Rules the downtown tunnels and urban expressways with an iron grip and an aggressive modified fleet.',
    vehicle: 'Tormenta 400',
    quote: '"In my city, you earn your asphalt one quarter-mile at a time."',
    avatarColor: '#FF8A32'
  },
  {
    id: 'emma',
    name: 'Emma Rodriguez',
    role: 'Chief Automotive Engineer',
    bio: 'Mechanical prodigy who can extract 200 extra horsepower from any turbocharger with surgical tuning.',
    vehicle: 'Kanso RS-T',
    quote: '"Give me twenty minutes in the garage and you\'ll shatter their records."',
    avatarColor: '#35D58A'
  }
];

export const CAREER_CHAPTERS: CareerChapter[] = [
  {
    id: 1,
    chapterNumber: 'CHAPTER 01',
    title: 'THE BEGINNING',
    location: 'Metro City',
    locationId: 'metro-city',
    objective: 'Become a recognized street racer by winning 3 rookie midnight duels.',
    bossRival: 'Leo "Sparks" Chen',
    rewardCoins: 12000,
    rewardXp: 2500,
    isUnlocked: true,
    isCompleted: true,
    progressPercent: 100,
    imageKey: 'metro'
  },
  {
    id: 2,
    chapterNumber: 'CHAPTER 02',
    title: 'RISE OF THE STREET RACER',
    location: 'Metro City Expressway',
    locationId: 'metro-city',
    objective: 'Defeat Marcus Steel in a high-stakes midnight tunnel showdown.',
    bossRival: 'Marcus Steel',
    rewardCoins: 25000,
    rewardXp: 4800,
    isUnlocked: true,
    isCompleted: true,
    progressPercent: 85,
    imageKey: 'metro'
  },
  {
    id: 3,
    chapterNumber: 'CHAPTER 03',
    title: 'THE DESERT CHALLENGE',
    location: 'Aurelia Desert',
    locationId: 'aurelia-desert',
    objective: 'Survive extreme sand gusts and win the grueling Desert Grand Prix.',
    bossRival: 'Darius Thorne',
    rewardCoins: 45000,
    rewardXp: 7500,
    isUnlocked: true,
    isCompleted: false,
    progressPercent: 35,
    imageKey: 'desert'
  },
  {
    id: 4,
    chapterNumber: 'CHAPTER 04',
    title: 'MOUNTAIN WARRIORS',
    location: 'Mountain Pass',
    locationId: 'mountain-pass',
    objective: 'Master hairpins in heavy fog and qualify for the Apex Championship.',
    bossRival: 'Maya Lin',
    rewardCoins: 75000,
    rewardXp: 11000,
    isUnlocked: false,
    isCompleted: false,
    progressPercent: 0,
    imageKey: 'mountain'
  },
  {
    id: 5,
    chapterNumber: 'CHAPTER 05',
    title: 'THE APEX CHAMPIONSHIP',
    location: 'International Speedway',
    locationId: 'international-speedway',
    objective: 'Defeat the best professional competitors on the world stage.',
    bossRival: 'Carlos Silva',
    rewardCoins: 120000,
    rewardXp: 18000,
    isUnlocked: false,
    isCompleted: false,
    progressPercent: 0,
    imageKey: 'speedway'
  },
  {
    id: 6,
    chapterNumber: 'CHAPTER 06',
    title: 'THE FINAL LEGEND',
    location: 'Aurelia International Highway',
    locationId: 'neon-district',
    objective: 'Defeat reigning champion Victor Blaze in a 20-kilometer high-speed duel.',
    bossRival: 'Victor Blaze',
    rewardCoins: 250000,
    rewardXp: 35000,
    isUnlocked: false,
    isCompleted: false,
    progressPercent: 0,
    imageKey: 'final'
  }
];

export const WORLD_LOCATIONS: WorldLocation[] = [
  {
    id: 'metro-city',
    name: 'METRO CITY',
    tagline: 'Neon-Drenched Urban Labyrinth',
    description: 'Modern skyscrapers, illuminated highway overpasses, and underground tunnels where street racing legends are born.',
    mapX: 72,
    mapY: 28,
    racesAvailable: 8,
    completionPercent: 92,
    unlocked: true,
    environmentType: 'City Highway',
    bestLap: '1:14.28'
  },
  {
    id: 'aurelia-desert',
    name: 'AURELIA DESERT',
    tagline: 'Scorched Canyon Ribbons',
    description: 'Vast sandstone arches, golden hour sunsets, dusty tarmac ribbons, and long open straights engineered for top speed runs.',
    mapX: 46,
    mapY: 48,
    racesAvailable: 6,
    completionPercent: 45,
    unlocked: true,
    environmentType: 'Desert Canyon',
    bestLap: '1:48.90'
  },
  {
    id: 'mountain-pass',
    name: 'MOUNTAIN PASS',
    tagline: 'Treacherous Alpine Switchbacks',
    description: 'Rocky cliffs, perilous bridges, pine forests, and elevation shifts that push tire grip and suspension to the absolute brink.',
    mapX: 25,
    mapY: 34,
    racesAvailable: 5,
    completionPercent: 15,
    unlocked: false,
    environmentType: 'Alpine Ridge',
    bestLap: '--:--.--'
  },
  {
    id: 'coastal-drive',
    name: 'COASTAL DRIVE',
    tagline: 'Oceanfront High-Speed Scenic',
    description: 'Turquoise ocean waters, palm-fringed seaside bridges, and undulating asphalt with dynamic crosswinds.',
    mapX: 58,
    mapY: 76,
    racesAvailable: 7,
    completionPercent: 60,
    unlocked: true,
    environmentType: 'Ocean Highway',
    bestLap: '1:32.10'
  },
  {
    id: 'neon-district',
    name: 'NEON DISTRICT',
    tagline: 'Midnight Cyber Rain',
    description: 'Towering holographic billboards, rain-slicked wet asphalt, and blinding light trails reflected in puddles.',
    mapX: 68,
    mapY: 18,
    racesAvailable: 9,
    completionPercent: 78,
    unlocked: true,
    environmentType: 'Rainy Metropolis',
    bestLap: '1:08.45'
  },
  {
    id: 'international-speedway',
    name: 'INTERNATIONAL SPEEDWAY',
    tagline: 'The Apex Colosseum',
    description: 'Full stadium grandstands, stadium lighting, championship asphalt, and high-banked turns built for 400 KM/H.',
    mapX: 82,
    mapY: 52,
    racesAvailable: 10,
    completionPercent: 20,
    unlocked: false,
    environmentType: 'Championship Oval',
    bestLap: '--:--.--'
  }
];

export const RACE_EVENTS: RaceEvent[] = [
  {
    id: 'endless-metro',
    title: 'Midnight Overpass Run',
    type: 'Endless Highway',
    location: 'Metro City',
    difficulty: 'Street',
    distanceKm: 0, // Endless
    entryRequirement: 'Class D or above',
    rewardCoins: 15000,
    rewardXp: 2200,
    trafficDensity: 'medium',
    targetScore: 45000
  },
  {
    id: 'career-desert-gp',
    title: 'Aurelia Desert Grand Prix',
    type: 'Career Race',
    location: 'Aurelia Desert',
    difficulty: 'Pro',
    distanceKm: 12.5,
    entryRequirement: 'Class B vehicle',
    rewardCoins: 35000,
    rewardXp: 5000,
    trafficDensity: 'high',
    targetScore: 80000
  },
  {
    id: 'speed-trap-neon',
    title: 'Neon District Radar Blitz',
    type: 'Time Trial',
    location: 'Neon District',
    difficulty: 'Apex',
    distanceKm: 8.0,
    entryRequirement: 'Top Speed > 320 KM/H',
    rewardCoins: 42000,
    rewardXp: 6400,
    trafficDensity: 'medium',
    targetScore: 95000
  },
  {
    id: 'police-interceptor',
    title: 'High-Threat Interception',
    type: 'Police Chase',
    location: 'Metro City Express',
    difficulty: 'Legendary',
    distanceKm: 15.0,
    entryRequirement: 'Reputation > 2500',
    rewardCoins: 60000,
    rewardXp: 9500,
    trafficDensity: 'extreme',
    targetScore: 120000
  },
  {
    id: 'drift-coastal',
    title: 'Seaside Drift Horizon',
    type: 'Drift Challenge',
    location: 'Coastal Drive',
    difficulty: 'Street',
    distanceKm: 6.2,
    entryRequirement: 'Handling > 75',
    rewardCoins: 28000,
    rewardXp: 3800,
    trafficDensity: 'low',
    targetScore: 65000
  },
  {
    id: 'daily-blitz',
    title: 'Daily Apex Sprint',
    type: 'Daily Challenge',
    location: 'Metro City',
    difficulty: 'Pro',
    distanceKm: 10.0,
    entryRequirement: 'None',
    rewardCoins: 30000,
    rewardXp: 4000,
    trafficDensity: 'high',
    targetScore: 70000
  }
];

export const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: 'daily-1',
    title: 'High Mileage',
    description: 'Drive a total distance of 5.0 KM in any race mode.',
    progress: 3.4,
    target: 5.0,
    unit: 'KM',
    rewardCoins: 8000,
    rewardXp: 1200,
    completed: false,
    claimed: false
  },
  {
    id: 'daily-2',
    title: 'Close Call Master',
    description: 'Execute 10 high-speed near-misses against highway traffic.',
    progress: 8,
    target: 10,
    unit: 'misses',
    rewardCoins: 12000,
    rewardXp: 1800,
    completed: false,
    claimed: false
  },
  {
    id: 'daily-3',
    title: 'Podium Dominance',
    description: 'Win 2 career or highway sprint challenges.',
    progress: 2,
    target: 2,
    unit: 'wins',
    rewardCoins: 15000,
    rewardXp: 2500,
    completed: true,
    claimed: false
  },
  {
    id: 'daily-4',
    title: 'Sound Barrier',
    description: 'Reach a top speed of 250 KM/H on the highway.',
    progress: 285,
    target: 250,
    unit: 'KM/H',
    rewardCoins: 10000,
    rewardXp: 1500,
    completed: true,
    claimed: true
  },
  {
    id: 'daily-5',
    title: 'Coin Magnet',
    description: 'Collect 100 bonus highway credit pickups during races.',
    progress: 74,
    target: 100,
    unit: 'coins',
    rewardCoins: 9000,
    rewardXp: 1400,
    completed: false,
    claimed: false
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'First Victory',
    description: 'Cross the finish line in first position for the first time.',
    unlocked: true,
    progress: 1,
    target: 1,
    rewardXp: 1000,
    iconName: 'Trophy',
    tier: 'Bronze'
  },
  {
    id: 'ach-2',
    title: 'Speed Demon',
    description: 'Break the 300 KM/H speed barrier on an active highway.',
    unlocked: true,
    progress: 320,
    target: 300,
    rewardXp: 2500,
    iconName: 'Zap',
    tier: 'Silver'
  },
  {
    id: 'ach-3',
    title: 'Drift Master',
    description: 'Accumulate over 50,000 drift score in a single event.',
    unlocked: true,
    progress: 58000,
    target: 50000,
    rewardXp: 3500,
    iconName: 'Compass',
    tier: 'Silver'
  },
  {
    id: 'ach-4',
    title: 'Highway Explorer',
    description: 'Unlock and explore all 6 scenic regions of Aurelia.',
    unlocked: false,
    progress: 4,
    target: 6,
    rewardXp: 5000,
    iconName: 'MapPin',
    tier: 'Gold'
  },
  {
    id: 'ach-5',
    title: 'Traffic Master',
    description: 'Execute 50 near-misses without causing a single collision.',
    unlocked: false,
    progress: 32,
    target: 50,
    rewardXp: 6000,
    iconName: 'ShieldAlert',
    tier: 'Gold'
  },
  {
    id: 'ach-6',
    title: 'Desert Champion',
    description: 'Conquer the Aurelia Desert Grand Prix with a 5-second lead.',
    unlocked: false,
    progress: 0,
    target: 1,
    rewardXp: 7500,
    iconName: 'Flame',
    tier: 'Gold'
  },
  {
    id: 'ach-7',
    title: 'Apex Champion',
    description: 'Defeat all regional bosses and reach the International Speedway.',
    unlocked: false,
    progress: 2,
    target: 5,
    rewardXp: 15000,
    iconName: 'Crown',
    tier: 'Apex'
  },
  {
    id: 'ach-8',
    title: 'Highway Legend',
    description: 'Dethrone Victor Blaze and become the ultimate champion of Aurelia.',
    unlocked: false,
    progress: 0,
    target: 1,
    rewardXp: 50000,
    iconName: 'Award',
    tier: 'Apex'
  }
];

export const LEADERBOARD_ENTRIES: LeaderboardEntry[] = [
  { rank: 1, name: 'Victor_Blaze', level: 50, score: 2845000, wins: 382, car: 'Shadow X-900', isPlayer: false },
  { rank: 2, name: 'Apex_Ghost', level: 48, score: 2610200, wins: 340, car: 'Valkyrie Zero', isPlayer: false },
  { rank: 3, name: 'Vortex_Rider', level: 45, score: 2390800, wins: 312, car: 'Hyperion GTR', isPlayer: false },
  { rank: 4, name: 'Sophia_C', level: 44, score: 2180400, wins: 295, car: 'Solstice EVO 1', isPlayer: false },
  { rank: 5, name: 'Marcus_Steel', level: 41, score: 1950000, wins: 260, car: 'Tormenta 400', isPlayer: false },
  { rank: 6, name: 'Alex Vance (You)', level: 18, score: 1420500, wins: 48, car: 'Apex GT-V', isPlayer: true },
  { rank: 7, name: 'NightCrawl_99', level: 38, score: 1395000, wins: 180, car: 'Chimera S', isPlayer: false },
  { rank: 8, name: 'KansoDrifter', level: 35, score: 1280000, wins: 165, car: 'Phantom R-32', isPlayer: false },
  { rank: 9, name: 'NeonPulse', level: 33, score: 1140000, wins: 142, car: 'Apex GT-V', isPlayer: false },
  { rank: 10, name: 'TurbineKing', level: 30, score: 980000, wins: 120, car: 'Strada R-Sport', isPlayer: false }
];
