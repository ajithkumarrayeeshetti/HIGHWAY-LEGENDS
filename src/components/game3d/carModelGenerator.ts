import * as THREE from 'three';
import { VehicleCustomization } from '../../types/game';

export interface Car3DObject {
  group: THREE.Group;
  bodyMesh: THREE.Mesh;
  bodyMaterial: THREE.MeshStandardMaterial;
  rimMaterials: THREE.MeshStandardMaterial[];
  glassMaterial: THREE.MeshPhysicalMaterial;
  underglowLight: THREE.PointLight;
  underglowMesh: THREE.Mesh;
  exhaustMeshes: THREE.Mesh[];
  spoilerGroup: THREE.Group;
  wheels: THREE.Group[];
  spinWheels: (amount: number) => void;
  steerFrontWheels: (angle: number) => void;
  updateCustomization: (custom: VehicleCustomization) => void;
}

export function createProceduralCar(custom: VehicleCustomization): Car3DObject {
  const group = new THREE.Group();
  group.name = 'Car_Procedural_Supercar';

  // Internal vehicle assembly rotated by -Math.PI/2 so the car points forward (-Z)
  // instead of sideways (X-axis)
  const carModel = new THREE.Group();
  carModel.rotation.y = -Math.PI / 2;
  group.add(carModel);

  // 1. Materials
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(custom.bodyColor),
    metalness: custom.finish === 'metallic' ? 0.85 : custom.finish === 'matte' ? 0.2 : 0.6,
    roughness: custom.finish === 'metallic' ? 0.18 : custom.finish === 'matte' ? 0.65 : 0.28,
    envMapIntensity: 1.4
  });

  const carbonMaterial = new THREE.MeshStandardMaterial({
    color: 0x111317,
    roughness: 0.45,
    metalness: 0.2
  });

  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: 0xdddddd,
    metalness: 0.95,
    roughness: 0.1,
    envMapIntensity: 2.0
  });

  const rimMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(custom.wheelColor),
    metalness: 0.9,
    roughness: 0.2,
    envMapIntensity: 1.5
  });
  const rimMaterials = [rimMaterial];

  const tireMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1e,
    roughness: 0.85,
    metalness: 0.05
  });

  const brakeCaliperMat = new THREE.MeshStandardMaterial({
    color: 0xff3434,
    metalness: 0.7,
    roughness: 0.3
  });

  const brakeRotorMat = new THREE.MeshStandardMaterial({
    color: 0x888888,
    metalness: 0.9,
    roughness: 0.35
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x05070a,
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.8,
    transparent: true,
    opacity: custom.windowTint === 'limo' ? 0.95 : custom.windowTint === 'dark' ? 0.75 : 0.45,
    ior: 1.52,
    thickness: 0.5
  });

  const headlightMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xddeeff,
    emissiveIntensity: 2.5,
    roughness: 0.1
  });

  const taillightMaterial = new THREE.MeshStandardMaterial({
    color: 0xff1111,
    emissive: 0xff0022,
    emissiveIntensity: 3.5,
    roughness: 0.2
  });

  const neonActive = custom.neonColor && custom.neonColor !== 'none';
  const neonColorHex = neonActive ? new THREE.Color(custom.neonColor) : new THREE.Color(0x000000);

  const neonMaterial = new THREE.MeshBasicMaterial({
    color: neonColorHex,
    transparent: true,
    opacity: neonActive ? 0.85 : 0.0
  });

  // 2. Primary Silhouette - Main Car Body (Extruded aerodynamic profile)
  // Low-slung supercar body: Length ~ 4.4m, Width ~ 1.95m, Height ~ 1.15m
  const bodyShape = new THREE.Shape();
  // Side silhouette profile
  bodyShape.moveTo(-2.2, 0.25); // Front splitter bottom
  bodyShape.lineTo(-2.15, 0.42); // Front nose tip
  bodyShape.lineTo(-1.3, 0.65); // Front hood rise
  bodyShape.lineTo(-0.55, 0.78); // Windshield base
  bodyShape.lineTo(-0.15, 1.15); // Windshield top / roof start
  bodyShape.lineTo(0.55, 1.15); // Roof peak
  bodyShape.lineTo(1.4, 0.82); // Rear fastback glass drop
  bodyShape.lineTo(2.05, 0.75); // Rear deck lid
  bodyShape.lineTo(2.25, 0.52); // Rear bumper edge
  bodyShape.lineTo(2.18, 0.28); // Rear diffuser base
  bodyShape.lineTo(1.4, 0.24); // Rear wheel well arch
  bodyShape.lineTo(0.9, 0.24);
  bodyShape.lineTo(-0.8, 0.24);
  bodyShape.lineTo(-1.4, 0.24); // Front wheel well arch
  bodyShape.closePath();

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    steps: 1,
    depth: 1.84,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.08,
    bevelOffset: 0,
    bevelSegments: 3
  };

  const bodyGeom = new THREE.ExtrudeGeometry(bodyShape, extrudeSettings);
  bodyGeom.center(); // Center at origin
  // Shift up so wheels sit exactly on the floor Y = 0
  const bodyMesh = new THREE.Mesh(bodyGeom, bodyMaterial);
  bodyMesh.position.y = 0.58;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  carModel.add(bodyMesh);

  // 3. Cockpit Greenhouse / Glass Canopy
  const canopyGeom = new THREE.BoxGeometry(1.65, 0.46, 1.48);
  const canopyMesh = new THREE.Mesh(canopyGeom, glassMaterial);
  canopyMesh.position.set(0.12, 0.88, 0);
  canopyMesh.castShadow = true;
  carModel.add(canopyMesh);

  // 4. Front Splitter (Carbon Fiber)
  const splitterGeom = new THREE.BoxGeometry(0.7, 0.06, 1.96);
  const splitterMesh = new THREE.Mesh(splitterGeom, carbonMaterial);
  splitterMesh.position.set(-2.02, 0.24, 0);
  splitterMesh.castShadow = true;
  carModel.add(splitterMesh);

  // Front Headlight Bars (Dual angled LED strips)
  const headGeom = new THREE.BoxGeometry(0.24, 0.07, 0.48);
  const leftHeadlight = new THREE.Mesh(headGeom, headlightMaterial);
  leftHeadlight.position.set(-2.04, 0.54, 0.68);
  leftHeadlight.rotation.y = 0.25;
  const rightHeadlight = leftHeadlight.clone();
  rightHeadlight.position.set(-2.04, 0.54, -0.68);
  rightHeadlight.rotation.y = -0.25;
  carModel.add(leftHeadlight, rightHeadlight);

  // 5. Rear Taillight Lightbar (Continuous glowing neon blade)
  const tailGeom = new THREE.BoxGeometry(0.12, 0.06, 1.76);
  const taillight = new THREE.Mesh(tailGeom, taillightMaterial);
  taillight.position.set(2.18, 0.62, 0);
  carModel.add(taillight);

  // Rear Carbon Diffuser
  const diffuserGeom = new THREE.BoxGeometry(0.5, 0.16, 1.7);
  const diffuserMesh = new THREE.Mesh(diffuserGeom, carbonMaterial);
  diffuserMesh.position.set(2.05, 0.28, 0);
  carModel.add(diffuserMesh);

  // Exhaust tips (Quad titanium pipes)
  const exhaustMeshes: THREE.Mesh[] = [];
  const exhaustGeom = new THREE.CylinderGeometry(0.065, 0.065, 0.24, 16);
  exhaustGeom.rotateZ(Math.PI / 2);
  [-0.42, -0.28, 0.28, 0.42].forEach((offsetZ) => {
    const pipe = new THREE.Mesh(exhaustGeom, chromeMaterial);
    pipe.position.set(2.2, 0.36, offsetZ);
    carModel.add(pipe);
    exhaustMeshes.push(pipe);
  });

  // 6. Rear Spoiler / Wing
  const spoilerGroup = new THREE.Group();
  spoilerGroup.position.set(1.92, 0.76, 0);

  function rebuildSpoiler(style: string) {
    while (spoilerGroup.children.length > 0) {
      const obj = spoilerGroup.children[0];
      spoilerGroup.remove(obj);
    }
    if (style === 'stock') {
      const lipGeom = new THREE.BoxGeometry(0.25, 0.04, 1.6);
      const lip = new THREE.Mesh(lipGeom, carbonMaterial);
      lip.position.set(0, 0.02, 0);
      spoilerGroup.add(lip);
    } else {
      // Stanchions (vertical uprights)
      const stanchionHeight = style === 'hyper-aero' ? 0.38 : 0.26;
      const stanchionGeom = new THREE.BoxGeometry(0.08, stanchionHeight, 0.04);
      const sLeft = new THREE.Mesh(stanchionGeom, carbonMaterial);
      sLeft.position.set(-0.06, stanchionHeight / 2, 0.52);
      const sRight = sLeft.clone();
      sRight.position.z = -0.52;
      spoilerGroup.add(sLeft, sRight);

      // Main aerodynamic airfoil blade
      const wingWidth = style === 'hyper-aero' ? 1.95 : 1.74;
      const wingGeom = new THREE.BoxGeometry(0.32, 0.04, wingWidth);
      const wing = new THREE.Mesh(wingGeom, carbonMaterial);
      wing.position.set(0, stanchionHeight, 0);
      wing.rotation.z = -0.08; // Downforce angle of attack
      spoilerGroup.add(wing);

      // End plates
      const plateGeom = new THREE.BoxGeometry(0.38, 0.16, 0.02);
      const pLeft = new THREE.Mesh(plateGeom, carbonMaterial);
      pLeft.position.set(0, stanchionHeight, wingWidth / 2);
      const pRight = pLeft.clone();
      pRight.position.z = -wingWidth / 2;
      spoilerGroup.add(pLeft, pRight);
    }
  }
  rebuildSpoiler(custom.spoilerStyle);
  carModel.add(spoilerGroup);

  // 7. Wheels & Assemblies (4 high-detail wheels)
  const wheelRadius = 0.36;
  const tireWidth = 0.28;
  const wheels: THREE.Group[] = [];

  function buildWheelAssembly(isFront: boolean): THREE.Group {
    const wheelGroup = new THREE.Group();

    // Tire
    const tireGeom = new THREE.CylinderGeometry(wheelRadius, wheelRadius, tireWidth, 24);
    tireGeom.rotateX(Math.PI / 2);
    const tireMesh = new THREE.Mesh(tireGeom, tireMaterial);
    tireMesh.castShadow = true;
    wheelGroup.add(tireMesh);

    // Rim Outer Ring
    const rimGeom = new THREE.CylinderGeometry(wheelRadius * 0.78, wheelRadius * 0.78, tireWidth + 0.01, 20);
    rimGeom.rotateX(Math.PI / 2);
    const rimMesh = new THREE.Mesh(rimGeom, rimMaterial);
    wheelGroup.add(rimMesh);

    // Multi-spoke geometry
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const spokeGeom = new THREE.BoxGeometry(0.04, wheelRadius * 0.72, 0.03);
      const spoke = new THREE.Mesh(spokeGeom, rimMaterial);
      spoke.position.set(Math.cos(angle) * wheelRadius * 0.36, Math.sin(angle) * wheelRadius * 0.36, 0);
      spoke.rotation.z = angle;
      wheelGroup.add(spoke);
    }

    // Brake Rotor
    const rotorGeom = new THREE.CylinderGeometry(wheelRadius * 0.62, wheelRadius * 0.62, 0.03, 18);
    rotorGeom.rotateX(Math.PI / 2);
    const rotor = new THREE.Mesh(rotorGeom, brakeRotorMat);
    wheelGroup.add(rotor);

    // Brake Caliper
    const caliperGeom = new THREE.BoxGeometry(0.12, 0.16, 0.08);
    const caliper = new THREE.Mesh(caliperGeom, brakeCaliperMat);
    caliper.position.set(0.16, 0.12, 0);
    wheelGroup.add(caliper);

    return wheelGroup;
  }

  // Wheel positions: Front-Left, Front-Right, Rear-Left, Rear-Right
  const wheelXFront = -1.35;
  const wheelXRear = 1.35;
  const wheelY = wheelRadius;
  const wheelZ = 0.98;

  const flWheel = buildWheelAssembly(true);
  flWheel.position.set(wheelXFront, wheelY, wheelZ);

  const frWheel = buildWheelAssembly(true);
  frWheel.position.set(wheelXFront, wheelY, -wheelZ);
  frWheel.rotation.y = Math.PI;

  const rlWheel = buildWheelAssembly(false);
  rlWheel.position.set(wheelXRear, wheelY, wheelZ);

  const rrWheel = buildWheelAssembly(false);
  rrWheel.position.set(wheelXRear, wheelY, -wheelZ);
  rrWheel.rotation.y = Math.PI;

  carModel.add(flWheel, frWheel, rlWheel, rrWheel);
  wheels.push(flWheel, frWheel, rlWheel, rrWheel);

  const spinWheels = (deltaAngle: number) => {
    flWheel.rotation.z += deltaAngle;
    rlWheel.rotation.z += deltaAngle;
    frWheel.rotation.z -= deltaAngle;
    rrWheel.rotation.z -= deltaAngle;
  };

  const steerFrontWheels = (angle: number) => {
    // Steer front wheels relative to local chassis orientation
    flWheel.rotation.y = angle;
    frWheel.rotation.y = Math.PI + angle;
  };

  // 8. Underglow Neon Light Bar (ground illumination)
  const underglowGeom = new THREE.PlaneGeometry(3.0, 1.5);
  underglowGeom.rotateX(-Math.PI / 2);
  const underglowMesh = new THREE.Mesh(underglowGeom, neonMaterial);
  underglowMesh.position.set(0, 0.04, 0);
  carModel.add(underglowMesh);

  const underglowLight = new THREE.PointLight(neonColorHex, neonActive ? 3.5 : 0.0, 4.0);
  underglowLight.position.set(0, 0.12, 0);
  carModel.add(underglowLight);

  // Contact Shadow Plane (ground grounding)
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  const sCtx = shadowCanvas.getContext('2d')!;
  const gradient = sCtx.createRadialGradient(64, 64, 10, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
  gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.45)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  sCtx.fillStyle = gradient;
  sCtx.fillRect(0, 0, 128, 128);

  const shadowTex = new THREE.CanvasTexture(shadowCanvas);
  const shadowGeom = new THREE.PlaneGeometry(4.8, 2.4);
  shadowGeom.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.65,
    depthWrite: false
  });
  const shadowMesh = new THREE.Mesh(shadowGeom, shadowMat);
  shadowMesh.position.set(0, 0.015, 0);
  carModel.add(shadowMesh);

  // 9. Dynamic Customization Updater
  const updateCustomization = (newCustom: VehicleCustomization) => {
    // Body color & finish
    bodyMaterial.color.set(newCustom.bodyColor);
    bodyMaterial.metalness = newCustom.finish === 'metallic' ? 0.85 : newCustom.finish === 'matte' ? 0.2 : 0.6;
    bodyMaterial.roughness = newCustom.finish === 'metallic' ? 0.18 : newCustom.finish === 'matte' ? 0.65 : 0.28;
    bodyMaterial.needsUpdate = true;

    // Rim color
    rimMaterial.color.set(newCustom.wheelColor);
    rimMaterial.needsUpdate = true;

    // Glass tint
    glassMaterial.opacity = newCustom.windowTint === 'limo' ? 0.95 : newCustom.windowTint === 'dark' ? 0.75 : 0.45;
    glassMaterial.needsUpdate = true;

    // Underglow neon
    const isNeon = newCustom.neonColor && newCustom.neonColor !== 'none';
    const nColor = isNeon ? new THREE.Color(newCustom.neonColor) : new THREE.Color(0x000000);
    neonMaterial.color.copy(nColor);
    neonMaterial.opacity = isNeon ? 0.85 : 0.0;
    neonMaterial.needsUpdate = true;
    underglowLight.color.copy(nColor);
    underglowLight.intensity = isNeon ? 3.5 : 0.0;

    // Spoiler style
    rebuildSpoiler(newCustom.spoilerStyle);
  };

  return {
    group,
    bodyMesh,
    bodyMaterial,
    rimMaterials,
    glassMaterial,
    underglowLight,
    underglowMesh,
    exhaustMeshes,
    spoilerGroup,
    wheels,
    spinWheels,
    steerFrontWheels,
    updateCustomization
  };
}
