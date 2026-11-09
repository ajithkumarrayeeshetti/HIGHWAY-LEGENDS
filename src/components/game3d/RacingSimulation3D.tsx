import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Vehicle, RaceEvent, RaceLiveState, CameraViewMode, InRaceChallenge } from '../../types/game';
import { createProceduralCar, Car3DObject } from './carModelGenerator';
import { sound } from '../../utils/audio';

interface RacingSimulation3DProps {
  vehicle: Vehicle;
  event: RaceEvent;
  isPaused: boolean;
  onUpdateState: (state: RaceLiveState) => void;
  onFinishRace: (isVictory: boolean, finalState: RaceLiveState) => void;
  cameraMode: CameraViewMode;
  onCycleCamera: () => void;
  onPause?: () => void;
  // External inputs (e.g. from mobile controls or keyboard)
  steeringInput: number; // -1 (left) to +1 (right)
  throttleInput: number; // 0 to 1
  brakeInput: boolean;
  nitroInput: boolean;
}

interface TrafficCar {
  group: THREE.Group;
  speed: number;
  lane: number;
  z: number;
  x: number;
  color: string;
  type: 'sedan' | 'suv' | 'sport' | 'truck' | 'tanker';
  length: number;
  width: number;
  nearMissTriggered?: boolean;
}

interface CoinPickup {
  mesh: THREE.Mesh;
  z: number;
  x: number;
  collected: boolean;
}

export const RacingSimulation3D: React.FC<RacingSimulation3DProps> = ({
  vehicle,
  event,
  isPaused,
  onUpdateState,
  onFinishRace,
  cameraMode,
  onCycleCamera,
  onPause,
  steeringInput,
  throttleInput,
  brakeInput,
  nitroInput
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isPausedRef.current = isPaused;
    if (isPaused) {
      sound.stopEngine();
    }
  }, [isPaused]);

  // References to keep mutable simulation state outside React render cycles
  const simState = useRef<RaceLiveState>({
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
    cameraMode: cameraMode,
    vehicleHealth: 100,
    crashStrikes: 0,
    consecutiveDashes: 0,
    challenges: [
      {
        id: 'triple-dash',
        title: 'Triple Dash: Pass 3 cars in a row',
        progress: 0,
        target: 3,
        completed: false
      },
      {
        id: 'speed-demon',
        title: 'Speed Barrier: Hit 280 KM/H',
        progress: 0,
        target: 280,
        completed: false
      },
      {
        id: 'survivor',
        title: 'Chassis Shield: Max 2 Strikes',
        progress: 0,
        target: 3,
        completed: false
      }
    ],
    objectiveProgress: 0,
    objectiveTarget: event.distanceKm > 0 ? event.distanceKm * 1000 : 5000,
    objectiveLabel: event.distanceKm > 0 ? `Target: ${event.distanceKm} KM` : 'Endless Run',
    recentNotification: null
  });

  const controlsRef = useRef({
    steer: 0,
    throttle: 0,
    brake: false,
    nitro: false
  });

  const currentCamModeRef = useRef<CameraViewMode>(cameraMode);
  useEffect(() => {
    currentCamModeRef.current = cameraMode;
    simState.current.cameraMode = cameraMode;
  }, [cameraMode]);

  // Sync prop inputs
  useEffect(() => {
    controlsRef.current.steer = steeringInput;
    controlsRef.current.throttle = throttleInput;
    controlsRef.current.brake = brakeInput;
    controlsRef.current.nitro = nitroInput;
  }, [steeringInput, throttleInput, brakeInput, nitroInput]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    sound.startEngine();

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06070a);
    scene.fog = new THREE.FogExp2(0x06070a, 0.015);

    const width = container.clientWidth || 1200;
    const height = container.clientHeight || 700;
    const camera = new THREE.PerspectiveCamera(54, width / height, 0.2, 350);
    camera.position.set(0, 2.2, 5.2);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Studio & Environmental Lighting
    const ambientLight = new THREE.AmbientLight(0x202838, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff0dd, 2.5);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // Player Car Setup
    const playerCarObj: Car3DObject = createProceduralCar(vehicle.customization);
    const playerGroup = playerCarObj.group;
    playerGroup.position.set(0, 0, 0);
    scene.add(playerGroup);

    // Road Setup - 4 Lanes, road width 16m
    const ROAD_CHUNK_LENGTH = 120;
    const NUM_ROAD_CHUNKS = 4;
    const roadChunks: THREE.Group[] = [];

    // Road asphalt texture with procedural canvas
    const roadTexCanvas = document.createElement('canvas');
    roadTexCanvas.width = 512;
    roadTexCanvas.height = 512;
    const rCtx = roadTexCanvas.getContext('2d')!;
    rCtx.fillStyle = '#12141a';
    rCtx.fillRect(0, 0, 512, 512);
    // Noise speckles
    for (let i = 0; i < 2000; i++) {
      rCtx.fillStyle = Math.random() > 0.5 ? '#181b24' : '#0d0e13';
      rCtx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
    // Solid boundary lines on left & right
    rCtx.fillStyle = '#ff8a32';
    rCtx.fillRect(16, 0, 10, 512);
    rCtx.fillRect(486, 0, 10, 512);
    // 3 Dashed white lane dividers
    rCtx.fillStyle = '#ffffff';
    for (let y = 0; y < 512; y += 64) {
      rCtx.fillRect(135, y + 12, 6, 32);
      rCtx.fillRect(253, y + 12, 6, 32);
      rCtx.fillRect(371, y + 12, 6, 32);
    }

    const roadTexture = new THREE.CanvasTexture(roadTexCanvas);
    roadTexture.wrapS = THREE.RepeatWrapping;
    roadTexture.wrapT = THREE.RepeatWrapping;
    roadTexture.repeat.set(1, 6);
    roadTexture.anisotropy = 4;

    const roadMaterial = new THREE.MeshStandardMaterial({
      map: roadTexture,
      roughness: 0.6,
      metalness: 0.1
    });

    const barrierMat = new THREE.MeshStandardMaterial({
      color: 0x222630,
      roughness: 0.5,
      metalness: 0.3
    });

    for (let i = 0; i < NUM_ROAD_CHUNKS; i++) {
      const chunk = new THREE.Group();
      chunk.position.z = -i * ROAD_CHUNK_LENGTH;

      // Asphalt Plane
      const roadGeom = new THREE.PlaneGeometry(16, ROAD_CHUNK_LENGTH);
      roadGeom.rotateX(-Math.PI / 2);
      const roadMesh = new THREE.Mesh(roadGeom, roadMaterial);
      roadMesh.receiveShadow = true;
      chunk.add(roadMesh);

      // Left & Right Safety Barriers
      const bGeom = new THREE.BoxGeometry(0.6, 0.9, ROAD_CHUNK_LENGTH);
      const leftB = new THREE.Mesh(bGeom, barrierMat);
      leftB.position.set(-8.3, 0.45, 0);
      const rightB = leftB.clone();
      rightB.position.x = 8.3;
      chunk.add(leftB, rightB);

      // Street Light Poles along the highway
      for (let pz = -ROAD_CHUNK_LENGTH / 2; pz < ROAD_CHUNK_LENGTH / 2; pz += 30) {
        const poleGeom = new THREE.CylinderGeometry(0.1, 0.12, 8, 8);
        const poleMat = new THREE.MeshStandardMaterial({ color: 0x333b4d, metalness: 0.8 });
        const leftPole = new THREE.Mesh(poleGeom, poleMat);
        leftPole.position.set(-9.5, 4, pz);

        // Light head
        const headGeom = new THREE.BoxGeometry(1.6, 0.2, 0.4);
        const headMat = new THREE.MeshBasicMaterial({ color: 0xffeebb });
        const head = new THREE.Mesh(headGeom, headMat);
        head.position.set(0.7, 3.9, 0);
        leftPole.add(head);

        chunk.add(leftPole);
      }

      scene.add(chunk);
      roadChunks.push(chunk);
    }

    // City Skyline Backdrop (instanced boxes with glowing windows)
    const buildingGeom = new THREE.BoxGeometry(18, 70, 18);
    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0x0c0f16,
      roughness: 0.8,
      metalness: 0.2
    });
    for (let b = 0; b < 24; b++) {
      const bMesh = new THREE.Mesh(buildingGeom, buildingMat);
      const side = b % 2 === 0 ? -1 : 1;
      bMesh.position.set(side * (32 + Math.random() * 25), 25 + Math.random() * 15, -b * 16 - 20);
      scene.add(bMesh);
    }

    // Traffic Fleet (Including heavy trucks and tankers)
    const LANES_X = [-5.4, -1.8, 1.8, 5.4];
    const trafficList: TrafficCar[] = [];
    const TRAFFIC_COLORS = [0x27b9ff, 0xffffff, 0xff8a32, 0xa1a8b5, 0x35d58a, 0x8b5cf6, 0xef4444];

    function createTrafficCar(laneIdx: number, zDist: number): TrafficCar {
      const tGroup = new THREE.Group();
      const rand = Math.random();
      const type: TrafficCar['type'] =
        rand > 0.82 ? 'truck' : rand > 0.7 ? 'tanker' : rand > 0.45 ? 'suv' : rand > 0.2 ? 'sedan' : 'sport';

      const col = type === 'truck' ? 0x223344 : type === 'tanker' ? 0x778899 : TRAFFIC_COLORS[Math.floor(Math.random() * TRAFFIC_COLORS.length)];

      const tBodyMat = new THREE.MeshStandardMaterial({
        color: col,
        roughness: 0.35,
        metalness: 0.55
      });
      const tGlassMat = new THREE.MeshStandardMaterial({
        color: 0x05070a,
        roughness: 0.1
      });

      // Dimensions based on vehicle type
      const isHeavy = type === 'truck' || type === 'tanker';
      const bLength = isHeavy ? 8.6 : type === 'suv' ? 4.5 : 4.0;
      const bHeight = isHeavy ? 2.5 : type === 'suv' ? 1.4 : 1.0;
      const bWidth = isHeavy ? 2.3 : 1.9;

      if (type === 'tanker') {
        // Cylindrical tanker tank
        const tankGeom = new THREE.CylinderGeometry(1.05, 1.05, 6.2, 16);
        tankGeom.rotateX(Math.PI / 2);
        const tankMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.15 });
        const tankMesh = new THREE.Mesh(tankGeom, tankMat);
        tankMesh.position.set(0, 1.45, 0.4);
        tGroup.add(tankMesh);

        // Front Cab
        const cabGeom = new THREE.BoxGeometry(bWidth, 2.0, 2.2);
        const cabMesh = new THREE.Mesh(cabGeom, tBodyMat);
        cabMesh.position.set(0, 1.2, -3.2);
        tGroup.add(cabMesh);
      } else if (type === 'truck') {
        // Cargo Box Container
        const cargoGeom = new THREE.BoxGeometry(bWidth, 2.3, 6.2);
        const cargoMat = new THREE.MeshStandardMaterial({ color: 0x242833, roughness: 0.6 });
        const cargoMesh = new THREE.Mesh(cargoGeom, cargoMat);
        cargoMesh.position.set(0, 1.5, 0.4);
        tGroup.add(cargoMesh);

        // Cab
        const cabGeom = new THREE.BoxGeometry(bWidth, 2.2, 2.2);
        const cabMesh = new THREE.Mesh(cabGeom, tBodyMat);
        cabMesh.position.set(0, 1.3, -3.2);
        tGroup.add(cabMesh);
      } else {
        // Standard Car / SUV Body
        const bGeom = new THREE.BoxGeometry(bWidth, bHeight * 0.5, bLength);
        const bMesh = new THREE.Mesh(bGeom, tBodyMat);
        bMesh.position.y = 0.45;
        tGroup.add(bMesh);

        // Cabin
        const cGeom = new THREE.BoxGeometry(bWidth * 0.85, bHeight * 0.5, bLength * 0.55);
        const cMesh = new THREE.Mesh(cGeom, tGlassMat);
        cMesh.position.set(0, 0.45 + bHeight * 0.45, -0.15);
        tGroup.add(cMesh);
      }

      // Taillights (Red glow at rear)
      const tTailGeom = new THREE.BoxGeometry(0.35, 0.12, 0.05);
      const tTailMat = new THREE.MeshBasicMaterial({ color: 0xff1122 });
      const leftTail = new THREE.Mesh(tTailGeom, tTailMat);
      leftTail.position.set(-0.7, 0.6, bLength * 0.5 + 0.02);
      const rightTail = leftTail.clone();
      rightTail.position.x = 0.7;
      tGroup.add(leftTail, rightTail);

      tGroup.position.set(LANES_X[laneIdx], 0, zDist);
      scene.add(tGroup);

      return {
        group: tGroup,
        speed: isHeavy ? 75 + Math.random() * 25 : 90 + Math.random() * 45,
        lane: laneIdx,
        z: zDist,
        x: LANES_X[laneIdx],
        color: '#' + col.toString(16),
        type,
        length: bLength,
        width: bWidth
      };
    }

    // Populate initial traffic fleet
    for (let i = 0; i < 9; i++) {
      const lane = Math.floor(Math.random() * 4);
      const z = -35 - i * 32 - Math.random() * 15;
      trafficList.push(createTrafficCar(lane, z));
    }

    // Pickups: Gold Coins
    const coinList: CoinPickup[] = [];
    const coinGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 16);
    coinGeom.rotateX(Math.PI / 2);
    const coinMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.95,
      roughness: 0.2,
      emissive: 0xffa500,
      emissiveIntensity: 0.4
    });

    for (let i = 0; i < 8; i++) {
      const coinMesh = new THREE.Mesh(coinGeom, coinMat);
      const lane = Math.floor(Math.random() * 4);
      const z = -20 - i * 45;
      coinMesh.position.set(LANES_X[lane], 0.45, z);
      scene.add(coinMesh);
      coinList.push({ mesh: coinMesh, z, x: LANES_X[lane], collected: false });
    }

    // Nitro Flame Trail Particles
    const nitroParticles: THREE.Mesh[] = [];
    const nitroPartGeom = new THREE.SphereGeometry(0.12, 8, 8);
    const nitroPartMat = new THREE.MeshBasicMaterial({
      color: 0x27b9ff,
      transparent: true,
      opacity: 0.8
    });
    for (let p = 0; p < 12; p++) {
      const part = new THREE.Mesh(nitroPartGeom, nitroPartMat);
      part.visible = false;
      scene.add(part);
      nitroParticles.push(part);
    }

    // Keyboard Listeners
    const keys = {
      ArrowLeft: false,
      ArrowRight: false,
      ArrowUp: false,
      ArrowDown: false,
      KeyA: false,
      KeyD: false,
      KeyW: false,
      KeyS: false,
      ShiftLeft: false,
      ShiftRight: false,
      Space: false
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code in keys) {
        keys[e.code as keyof typeof keys] = true;
      }
      if (e.code === 'KeyC') {
        sound.playClick();
        onCycleCamera();
      }
      if (e.code === 'Escape' || e.code === 'KeyP') {
        sound.playClick();
        onPause?.();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code in keys) {
        keys[e.code as keyof typeof keys] = false;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Resize Handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Physics & Car kinematics variables
    let playerX = 0;
    let playerVx = 0;
    let playerSpeedKmh = 60; // Start at 60 km/h
    let currentHeadingYaw = 0;
    let currentRollAngle = 0;
    let currentFrontWheelSteer = 0;
    let cameraShake = 0;
    let crashCooldown = 0;
    let dashChainTimeout = 0;

    const clock = new THREE.Clock();
    let frameId = 0;

    // Simulation Tick Loop
    const tick = () => {
      if (!isPausedRef.current && !simState.current.isGameOver && !simState.current.isVictory) {
        const dt = Math.min(clock.getDelta(), 0.1);

        // Chain Dash timer expiration check
        if (dashChainTimeout > 0) {
          dashChainTimeout -= dt;
          if (dashChainTimeout <= 0 && simState.current.consecutiveDashes < 3) {
            simState.current.consecutiveDashes = 0;
          }
        }

        // 1. Gather Inputs (Combines keyboard + mobile touch controls)
        let steerDir = controlsRef.current.steer;
        if (keys.ArrowLeft || keys.KeyA) steerDir -= 1;
        if (keys.ArrowRight || keys.KeyD) steerDir += 1;
        steerDir = Math.max(-1, Math.min(1, steerDir));

        let throttle = controlsRef.current.throttle > 0 ? controlsRef.current.throttle : 1;
        if (keys.ArrowUp || keys.KeyW) throttle = 1;
        if (keys.ArrowDown || keys.KeyS || controlsRef.current.brake || keys.Space) throttle = -0.6;

        const isNitroRequested =
          (keys.ShiftLeft || keys.ShiftRight || controlsRef.current.nitro) &&
          simState.current.nitroRemaining > 2;

        // 2. Acceleration & Top Speed Calculation
        const topBase = vehicle.currentStats.topSpeed;
        const maxSpeed = isNitroRequested ? topBase + 45 : topBase;
        const accelRate = (vehicle.currentStats.acceleration / 100) * 110;

        if (isNitroRequested) {
          playerSpeedKmh = Math.min(maxSpeed, playerSpeedKmh + accelRate * 1.8 * dt);
          simState.current.nitroRemaining = Math.max(0, simState.current.nitroRemaining - 22 * dt);
          simState.current.isNitroActive = true;
          sound.playNitro();
        } else {
          simState.current.isNitroActive = false;
          simState.current.nitroRemaining = Math.min(100, simState.current.nitroRemaining + 4 * dt);

          if (throttle > 0) {
            playerSpeedKmh = Math.min(topBase, playerSpeedKmh + accelRate * dt);
          } else if (throttle < 0) {
            playerSpeedKmh = Math.max(20, playerSpeedKmh - 160 * dt);
          }
        }

        // 3. Lateral Steering, Velocity Kinematics & Realistic Heading
        const forwardSpeedMs = playerSpeedKmh * (1000 / 3600);
        const handlingFactor = vehicle.currentStats.handling / 100;
        const maxLateralSpeed = handlingFactor * 16.5;
        const speedGripFactor = THREE.MathUtils.clamp(playerSpeedKmh / 35, 0.25, 1.0);
        const targetVx = steerDir * maxLateralSpeed * speedGripFactor;

        // Realistic tire grip damping: smooth, responsive lateral acceleration
        playerVx = THREE.MathUtils.damp(playerVx, targetVx, 10.0, dt);
        playerX += playerVx * dt;

        // Highway boundary collision & elastic guardrail deflection
        if (playerX < -6.8) {
          playerX = -6.8;
          playerVx = Math.max(0, playerVx * -0.2);
        } else if (playerX > 6.8) {
          playerX = 6.8;
          playerVx = Math.min(0, playerVx * -0.2);
        }
        playerGroup.position.x = playerX;

        // Align vehicle yaw directly to its instantaneous velocity vector (heading)
        // With dynamic slip lead from driver steering input for responsive feel
        const steerSlipLead = steerDir * 0.05 * speedGripFactor;
        const targetHeadingYaw = Math.atan2(playerVx, Math.max(12, forwardSpeedMs)) * 1.35 + steerSlipLead;
        currentHeadingYaw = THREE.MathUtils.damp(currentHeadingYaw, targetHeadingYaw, 14.0, dt);
        playerGroup.rotation.y = currentHeadingYaw;

        // Centrifugal body roll: vehicle leans outward during cornering
        const targetRoll = (playerVx / Math.max(15, forwardSpeedMs)) * 0.42;
        currentRollAngle = THREE.MathUtils.damp(currentRollAngle, targetRoll, 9.0, dt);
        playerGroup.rotation.z = currentRollAngle;

        // Turn front wheels visually into steering angle
        const targetWheelSteer = steerDir * 0.35;
        currentFrontWheelSteer = THREE.MathUtils.damp(currentFrontWheelSteer, targetWheelSteer, 14.0, dt);
        playerCarObj.steerFrontWheels(currentFrontWheelSteer);

        // Spin wheels based on forward motion
        const wheelSpin = (forwardSpeedMs * dt) / 0.36;
        playerCarObj.spinWheels(wheelSpin);

        // 4. Nitro Particle Tail
        if (simState.current.isNitroActive) {
          nitroParticles.forEach((p, idx) => {
            p.visible = true;
            p.position.set(
              playerX + (Math.random() - 0.5) * 0.4,
              0.36 + (Math.random() - 0.5) * 0.15,
              2.3 + idx * 0.35 + Math.random() * 0.2
            );
            p.scale.setScalar(1.2 - idx * 0.08);
          });
        } else {
          nitroParticles.forEach((p) => (p.visible = false));
        }

        // 5. Road Scrolling (Relative movement using forward speed)
        roadChunks.forEach((chunk) => {
          chunk.position.z += forwardSpeedMs * dt;
          if (chunk.position.z > ROAD_CHUNK_LENGTH) {
            chunk.position.z -= NUM_ROAD_CHUNKS * ROAD_CHUNK_LENGTH;
          }
        });

        // 6. Traffic Simulation & Collision / Near-Miss Detection
        crashCooldown = Math.max(0, crashCooldown - dt);

        trafficList.forEach((t) => {
          const relativeSpeedMs = (playerSpeedKmh - t.speed) * (1000 / 3600);
          t.z += relativeSpeedMs * dt;

          // Recycle traffic if passed behind player
          if (t.z > 25) {
            t.z = -180 - Math.random() * 50;
            t.lane = Math.floor(Math.random() * 4);
            t.x = LANES_X[t.lane];
            t.speed = t.type === 'truck' || t.type === 'tanker' ? 75 + Math.random() * 25 : 90 + Math.random() * 50;
          } else if (t.z < -260) {
            t.z = 20;
          }

          t.group.position.set(t.x, 0, t.z);

          // Bounding Box Collision
          const dx = Math.abs(playerX - t.x);
          const dz = Math.abs(t.z);
          const hitThresholdX = (t.width + 1.9) * 0.48;
          const hitThresholdZ = (t.length + 4.2) * 0.42;

          if (dx < hitThresholdX && dz < hitThresholdZ && crashCooldown <= 0) {
            // CRASH OCCURRED!
            crashCooldown = 1.4;
            cameraShake = 0.85;
            playerSpeedKmh = Math.max(25, playerSpeedKmh * 0.35);
            simState.current.comboMultiplier = 1;
            simState.current.consecutiveDashes = 0; // Reset consecutive chain
            sound.playCrash();

            const isHeavyCrash = t.type === 'truck' || t.type === 'tanker';
            const strikesDealt = isHeavyCrash ? 2 : 1;
            simState.current.crashStrikes += strikesDealt;
            simState.current.vehicleHealth = Math.max(0, simState.current.vehicleHealth - (isHeavyCrash ? 68 : 34));

            // Check for Totaled / Game Over condition
            if (simState.current.crashStrikes >= 3 || simState.current.vehicleHealth <= 0) {
              simState.current.isGameOver = true;
              simState.current.isWrecked = true;
              simState.current.isVictory = false;
              sound.stopEngine();

              simState.current.recentNotification = {
                text: 'TOTALED! GAME OVER',
                sub: 'Vehicle Destroyed by Collision',
                id: Date.now()
              };

              onFinishRace(false, { ...simState.current });
              return;
            } else {
              simState.current.recentNotification = {
                text: isHeavyCrash ? 'HEAVY TRUCK CRASH!' : 'COLLISION!',
                sub: `Chassis Damage: ${simState.current.crashStrikes}/3 Strikes`,
                id: Date.now()
              };
            }
          } else if (dx < hitThresholdX + 1.1 && dz < hitThresholdZ + 0.8 && !t.nearMissTriggered && playerSpeedKmh > 140) {
            // NEAR MISS / DASH TRIGGERED!
            t.nearMissTriggered = true;
            simState.current.nearMisses += 1;
            simState.current.consecutiveDashes += 1;
            dashChainTimeout = 4.0; // 4 seconds to chain the next car!

            simState.current.comboMultiplier = Math.min(8, simState.current.comboMultiplier + 1);
            const bonus = 500 * simState.current.comboMultiplier;
            simState.current.score += bonus;
            sound.playNearMiss();

            // Check Consecutive 3-Car Dash Challenge
            if (simState.current.consecutiveDashes >= 3) {
              simState.current.score += 2500;
              simState.current.nitroRemaining = 100; // Reward full nitro!
              sound.playVictory();

              // Mark challenge 1 completed
              const ch = simState.current.challenges.find((c) => c.id === 'triple-dash');
              if (ch) {
                ch.progress = 3;
                ch.completed = true;
              }

              simState.current.recentNotification = {
                text: 'TRIPLE CHAIN DASH!',
                sub: '+2,500 CR · 100% NITRO REFILLED',
                id: Date.now()
              };
              simState.current.consecutiveDashes = 0;
            } else {
              // Update challenge progress
              const ch = simState.current.challenges.find((c) => c.id === 'triple-dash');
              if (ch && !ch.completed) {
                ch.progress = simState.current.consecutiveDashes;
              }

              simState.current.recentNotification = {
                text: `+${bonus} NEAR MISS!`,
                sub: `${simState.current.consecutiveDashes}/3 CHAIN DASH`,
                id: Date.now()
              };
            }
          }

          if (dz > 8.0) {
            t.nearMissTriggered = false;
          }
        });

        // 7. Coin Pickups
        coinList.forEach((c) => {
          c.z += forwardSpeedMs * dt;
          c.mesh.rotation.z += dt * 3.5;
          if (c.z > 20) {
            c.z = -200 - Math.random() * 40;
            c.x = LANES_X[Math.floor(Math.random() * 4)];
            c.collected = false;
            c.mesh.visible = true;
          }
          c.mesh.position.set(c.x, 0.45, c.z);

          if (!c.collected && Math.abs(playerX - c.x) < 1.4 && Math.abs(c.z) < 1.8) {
            c.collected = true;
            c.mesh.visible = false;
            simState.current.coinsCollected += 1;
            simState.current.score += 250 * simState.current.comboMultiplier;
            sound.playCoin();
          }
        });

        // 8. Distance & Objective Progress
        const distAddedMeters = forwardSpeedMs * dt;
        simState.current.distanceMeters += distAddedMeters;
        simState.current.score += Math.floor(distAddedMeters * 0.4 * simState.current.comboMultiplier);
        simState.current.raceTimeSeconds += dt;
        simState.current.speedKmh = Math.floor(playerSpeedKmh);

        // Speed demon challenge check
        const speedCh = simState.current.challenges.find((c) => c.id === 'speed-demon');
        if (speedCh && !speedCh.completed) {
          speedCh.progress = Math.max(speedCh.progress, simState.current.speedKmh);
          if (speedCh.progress >= speedCh.target) {
            speedCh.completed = true;
            simState.current.recentNotification = {
              text: 'CHALLENGE COMPLETE!',
              sub: 'Speed Demon: 280 KM/H Broken',
              id: Date.now()
            };
          }
        }

        // Survivor challenge check
        const survCh = simState.current.challenges.find((c) => c.id === 'survivor');
        if (survCh) {
          survCh.progress = simState.current.crashStrikes;
        }

        // RPM & Gear calculation
        const gearRatio = [0, 60, 110, 175, 240, 315, 420];
        let currentGear = 1;
        for (let g = 1; g <= 6; g++) {
          if (playerSpeedKmh > gearRatio[g - 1]) {
            currentGear = g;
          }
        }
        const minGearSpeed = gearRatio[currentGear - 1] || 0;
        const maxGearSpeed = gearRatio[currentGear] || 450;
        const gearProgress = Math.max(0, Math.min(1, (playerSpeedKmh - minGearSpeed) / (maxGearSpeed - minGearSpeed)));
        const rpm = Math.floor(2200 + gearProgress * 6800);
        simState.current.currentGear = currentGear;
        simState.current.rpm = rpm;

        sound.updateEngineRPM(rpm / 9000, playerSpeedKmh, simState.current.isNitroActive);

        // Check Victory
        if (event.distanceKm > 0 && simState.current.distanceMeters >= simState.current.objectiveTarget) {
          simState.current.isVictory = true;
          sound.stopEngine();
          sound.playVictory();
          onFinishRace(true, { ...simState.current });
        }

        // 9. Camera View Perspectives (Chase vs Hood vs Close)
        const mode = currentCamModeRef.current;
        let targetFov = 54;
        const camTargetX = playerX * 0.35;

        if (mode === 'hood') {
          // 1st Person Hood/Bumper View
          targetFov = simState.current.isNitroActive ? 85 : 72 + (playerSpeedKmh / 350) * 10;
          camera.position.x = playerX;
          camera.position.y = 0.95 + (Math.random() - 0.5) * cameraShake * 0.5;
          camera.position.z = -0.5;
          camera.lookAt(playerX + Math.sin(currentHeadingYaw) * 14, 0.85, -28);
        } else if (mode === 'close') {
          // Dynamic Close Action Chase View
          targetFov = simState.current.isNitroActive ? 74 : 60 + (playerSpeedKmh / 350) * 8;
          camera.position.x = THREE.MathUtils.damp(camera.position.x, playerX * 0.5, 9, dt);
          camera.position.y = 1.45 + (Math.random() - 0.5) * cameraShake;
          camera.position.z = 3.4 + (simState.current.isNitroActive ? 0.3 : 0);
          camera.lookAt(playerX * 0.7 + Math.sin(currentHeadingYaw) * 8, 0.75, -15);
        } else {
          // Standard Third-Person Chase Cam
          targetFov = simState.current.isNitroActive ? 68 : 54 + (playerSpeedKmh / 350) * 8;
          camera.position.x = THREE.MathUtils.damp(camera.position.x, camTargetX, 8, dt);
          camera.position.y = 2.1 + (Math.random() - 0.5) * cameraShake;
          camera.position.z = 5.2 + (simState.current.isNitroActive ? 0.4 : 0);
          camera.lookAt(playerX * 0.5 + Math.sin(currentHeadingYaw) * 10, 0.8, -13);
        }

        camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 6, dt);
        camera.updateProjectionMatrix();

        cameraShake = Math.max(0, cameraShake - dt * 2.0);

        // Push state up to React UI
        onUpdateState({ ...simState.current });
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      sound.stopEngine();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [vehicle, event]);

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden select-none bg-black">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
};
