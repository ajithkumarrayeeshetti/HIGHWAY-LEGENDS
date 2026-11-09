import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { VehicleCustomization } from '../../types/game';
import { createProceduralCar, Car3DObject } from './carModelGenerator';

interface Showroom3DProps {
  customization: VehicleCustomization;
  accentColor?: string;
  autoRotate?: boolean;
}

export const Showroom3D: React.FC<Showroom3DProps> = ({
  customization,
  autoRotate = true
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const carObjectRef = useRef<Car3DObject | null>(null);
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const rotationTargetRef = useRef({ y: -0.65, x: 0.15 });
  const currentRotationRef = useRef({ y: -0.65, x: 0.15 });

  // Update customization reactively without tearing down the WebGL canvas
  useEffect(() => {
    if (carObjectRef.current) {
      carObjectRef.current.updateCustomization(customization);
    }
  }, [customization]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL guard
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0c12);
    scene.fog = new THREE.FogExp2(0x0a0c12, 0.04);

    // Camera
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.6, 6.2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment (RoomEnvironment)
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // Showroom Reflective Floor
    const floorGeom = new THREE.PlaneGeometry(30, 30);
    floorGeom.rotateX(-Math.PI / 2);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x090a0f,
      roughness: 0.18,
      metalness: 0.75,
      envMapIntensity: 1.2
    });
    const floorMesh = new THREE.Mesh(floorGeom, floorMat);
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Subtle Hexagonal Floor Podium Pattern
    const podiumGeom = new THREE.CylinderGeometry(3.6, 3.8, 0.04, 32);
    const podiumMat = new THREE.MeshStandardMaterial({
      color: 0x141822,
      roughness: 0.35,
      metalness: 0.8
    });
    const podium = new THREE.Mesh(podiumGeom, podiumMat);
    podium.position.y = 0.02;
    podium.receiveShadow = true;
    scene.add(podium);

    // Studio 3-Point Lighting
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 3.8);
    keyLight.position.set(5, 7, 5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x7fb5ff, 2.0);
    fillLight.position.set(-6, 5, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xff3434, 3.2);
    rimLight.position.set(0, 4, -7);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0x222a38, 1.2);
    scene.add(ambientLight);

    // Overhead Showroom LED Light Panels (Geometry accents)
    const ceilingLightGeom = new THREE.BoxGeometry(0.08, 0.08, 8);
    const ceilingLightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    [-2.2, 2.2].forEach((x) => {
      const strip = new THREE.Mesh(ceilingLightGeom, ceilingLightMat);
      strip.position.set(x, 4.5, 0);
      scene.add(strip);
    });

    // Create and Mount Procedural Car
    const car3D = createProceduralCar(customization);
    carObjectRef.current = car3D;
    // Pivot car on top of the podium
    car3D.group.position.y = 0.02;
    scene.add(car3D.group);

    // Interactive Drag / Orbit Controls
    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - prevMouseRef.current.x;
      const deltaY = e.clientY - prevMouseRef.current.y;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };

      rotationTargetRef.current.y += deltaX * 0.008;
      rotationTargetRef.current.x = Math.max(
        0.05,
        Math.min(0.45, rotationTargetRef.current.x + deltaY * 0.004)
      );
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop with exponential damping
    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();

      // Auto-rotation if idle
      if (autoRotate && !isDraggingRef.current) {
        rotationTargetRef.current.y += delta * 0.25;
      }

      // Smooth damping interpolation
      currentRotationRef.current.y = THREE.MathUtils.damp(
        currentRotationRef.current.y,
        rotationTargetRef.current.y,
        8,
        delta
      );
      currentRotationRef.current.x = THREE.MathUtils.damp(
        currentRotationRef.current.x,
        rotationTargetRef.current.x,
        8,
        delta
      );

      // Apply rotation to car group
      if (car3D) {
        car3D.group.rotation.y = currentRotationRef.current.y;
      }

      // Camera elevation based on pitch
      camera.position.y = 1.6 + currentRotationRef.current.x * 2.5;
      camera.lookAt(0, 0.65, 0);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);

      // Clean dispose
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [autoRotate]);

  return (
    <div className="relative w-full h-full min-h-[380px] overflow-hidden select-none cursor-grab active:cursor-grabbing">
      <div ref={mountRef} className="w-full h-full" />

      {/* Subtle Hint Badge in corner */}
      <div className="absolute top-4 right-4 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs text-slate-300">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF3434]" />
        <span>360° Interactive Showroom</span>
        <span className="text-slate-500">· Drag to Rotate</span>
      </div>
    </div>
  );
};
