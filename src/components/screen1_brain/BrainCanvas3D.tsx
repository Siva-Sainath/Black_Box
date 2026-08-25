import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { useAgentRun } from '../../context/AgentRunContext';
import { BrainNode3D, RunStep } from '../../types';
import { BRAIN_NODES_3D, SYNAPSE_CONNECTIONS_3D } from '../../data/mockNodes';
import { createAnatomicalBrain, createNeuronConnections } from './BrainMeshGenerator';
import { cn } from '../../utils/cn';
import {
  Rotate3d,
  ShieldAlert,
  Activity,
  Layers,
  Sparkles,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Target,
  Info,
} from 'lucide-react';

interface BrainCanvas3DProps {
  onNodeClick?: (nodeId: string) => void;
}

export const BrainCanvas3D: React.FC<BrainCanvas3DProps> = ({ onNodeClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    currentScenario,
    currentStepIndex,
    playbackState,
    openDrawerForStep,
    openDrawerForNodeId,
  } = useAgentRun();

  const [hoveredNode, setHoveredNode] = useState<BrainNode3D | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeCameraPreset, setActiveCameraPreset] = useState<'iso' | 'axial' | 'sagittal' | 'coronal'>('iso');
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [renderMode, setRenderMode] = useState<'hologram' | 'cortex' | 'connectome'>('hologram');

  // References for Three.js scene objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const nodeMeshesRef = useRef<Map<string, {
    group: THREE.Group;
    sphere: THREE.Mesh;
    halo: THREE.Mesh;
    shockRing: THREE.Mesh;
    light: THREE.PointLight;
    beaconBeam?: THREE.Mesh;
  }>>(new Map());

  const pulsePacketRef = useRef<THREE.Mesh | null>(null);
  const brainPointCloudRef = useRef<THREE.Points | null>(null);
  const cortexMeshLeftRef = useRef<THREE.Mesh | null>(null);
  const cortexMeshRightRef = useRef<THREE.Mesh | null>(null);
  const cerebellumMeshRef = useRef<THREE.Mesh | null>(null);
  const brainstemMeshRef = useRef<THREE.Mesh | null>(null);
  const tractsGroupRef = useRef<THREE.Group | null>(null);

  const nodeMap = useMemo(() => {
    const map = new Map<string, BrainNode3D>();
    BRAIN_NODES_3D.forEach((n) => map.set(n.id, n));
    return map;
  }, []);

  const activeStep: RunStep | null =
    currentStepIndex >= 0 ? currentScenario.steps[currentStepIndex] : null;

  // Smooth camera view transitions
  const setCameraView = useCallback((preset: 'iso' | 'axial' | 'sagittal' | 'coronal') => {
    setActiveCameraPreset(preset);
    const camera = cameraRef.current;
    if (!camera) return;

    const targets: Record<string, { x: number; y: number; z: number }> = {
      iso: { x: 13, y: 9, z: 16 },
      axial: { x: 0.01, y: 22, z: 0.01 }, // Top-down
      sagittal: { x: 22, y: 1.5, z: 0.01 }, // Lateral side profile
      coronal: { x: 0.01, y: 1.5, z: 22 }, // Frontal face
    };

    const target = targets[preset] || targets.iso;
    const startPos = camera.position.clone();
    const endPos = new THREE.Vector3(target.x, target.y, target.z);
    let progress = 0;

    const animateCamera = () => {
      progress += 0.05;
      camera.position.lerpVectors(startPos, endPos, Math.min(1, progress));
      camera.lookAt(0, 0.5, 0);
      if (progress < 1) {
        requestAnimationFrame(animateCamera);
      }
    };
    animateCamera();
  }, []);

  // Focus camera on specific node
  const focusOnNode = useCallback((node: BrainNode3D) => {
    setSelectedNodeId(node.id);
    const camera = cameraRef.current;
    if (!camera) return;

    const startPos = camera.position.clone();
    const targetPos = new THREE.Vector3(node.x * 2.0 + 4, node.y * 1.5 + 4, node.z * 2.0 + 8);
    let progress = 0;

    const animate = () => {
      progress += 0.05;
      camera.position.lerpVectors(startPos, targetPos, Math.min(1, progress));
      camera.lookAt(node.x, node.y, node.z);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  }, []);

  // Initialize Three.js Anatomical Brain Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Atmosphere
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.015);

    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(8, 6, 10);
    camera.lookAt(0, 0.2, 0);
    cameraRef.current = camera;

    // 2. High Dynamic Range WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 3. Create anatomical brain
    const { brainGroup, leftHemisphere, rightHemisphere, cerebellum } = createAnatomicalBrain();
    scene.add(brainGroup);
    cortexMeshLeftRef.current = leftHemisphere;
    cortexMeshRightRef.current = rightHemisphere;
    cerebellumMeshRef.current = cerebellum;

    // 3. Studio Lighting & Specular Rims
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(12, 18, 15);
    scene.add(keyLight);

    const rimLightBlue = new THREE.DirectionalLight(0x38bdf8, 1.8);
    rimLightBlue.position.set(-15, 8, -12);
    scene.add(rimLightBlue);

    const fillLightEmerald = new THREE.DirectionalLight(0x10b981, 1.2);
    fillLightEmerald.position.set(0, -15, 10);
    scene.add(fillLightEmerald);

    // 4. LITERAL ANATOMICAL 3D CORTEX MESH (Dual Hemispheres + Cerebellum + Brainstem)
    // Left Cerebral Hemisphere with sulcal convolutions
    const leftHemiGeom = new THREE.SphereGeometry(4.8, 64, 48);
    const leftPos = leftHemiGeom.attributes.position;
    for (let i = 0; i < leftPos.count; i++) {
      let x = leftPos.getX(i);
      let y = leftPos.getY(i);
      let z = leftPos.getZ(i);

      // Anatomical brain deform: flatten medial longitudinal fissure
      if (x > 0) x = x * 0.15 - 0.2; // flatten inner boundary
      else x = x * 0.95 - 0.3; // round outer hemisphere

      // Elongate front-to-back, taper occipital & frontal poles
      z = z * 1.22;
      y = y * 0.88;

      // Organic gyri / sulcal surface ripples
      const gyriWave = Math.sin(x * 3.5) * Math.cos(z * 3.5) * Math.sin(y * 4.0) * 0.28;
      x += gyriWave * 0.4;
      y += gyriWave * 0.3;
      z += gyriWave * 0.4;

      leftPos.setXYZ(i, x, y + 0.8, z);
    }
    leftHemiGeom.computeVertexNormals();

    // Right Cerebral Hemisphere with symmetric sulcal grooves
    const rightHemiGeom = new THREE.SphereGeometry(4.8, 64, 48);
    const rightPos = rightHemiGeom.attributes.position;
    for (let i = 0; i < rightPos.count; i++) {
      let x = rightPos.getX(i);
      let y = rightPos.getY(i);
      let z = rightPos.getZ(i);

      // Flatten inner boundary
      if (x < 0) x = x * 0.15 + 0.2;
      else x = x * 0.95 + 0.3;

      z = z * 1.22;
      y = y * 0.88;

      const gyriWave = Math.sin(x * 3.5) * Math.cos(z * 3.5) * Math.sin(y * 4.0) * 0.28;
      x += gyriWave * 0.4;
      y += gyriWave * 0.3;
      z += gyriWave * 0.4;

      rightPos.setXYZ(i, x, y + 0.8, z);
    }
    rightHemiGeom.computeVertexNormals();

    // Translucent biological glass cortex material
    const cortexGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x18181b,
      emissive: 0x27272a,
      emissiveIntensity: 0.12,
      roughness: 0.25,
      metalness: 0.1,
      transmission: 0.82,
      ior: 1.35,
      transparent: true,
      opacity: 0.38,
      wireframe: false,
      depthWrite: false,
    });

    const leftHemiMesh = new THREE.Mesh(leftHemiGeom, cortexGlassMat);
    const rightHemiMesh = new THREE.Mesh(rightHemiGeom, cortexGlassMat.clone());
    scene.add(leftHemiMesh);
    scene.add(rightHemiMesh);
    cortexMeshLeftRef.current = leftHemiMesh;
    cortexMeshRightRef.current = rightHemiMesh;

    // Anatomical Cerebellum (Posterior-Inferior)
    const cerebellumGeom = new THREE.SphereGeometry(2.2, 32, 24);
    const cbPos = cerebellumGeom.attributes.position;
    for (let i = 0; i < cbPos.count; i++) {
      let x = cbPos.getX(i) * 1.4;
      let y = cbPos.getY(i) * 0.7;
      let z = cbPos.getZ(i) * 0.9;
      cbPos.setXYZ(i, x, y - 2.6, z - 3.4);
    }
    cerebellumGeom.computeVertexNormals();
    const cbMat = cortexGlassMat.clone();
    const cerebellumMesh = new THREE.Mesh(cerebellumGeom, cbMat);
    scene.add(cerebellumMesh);
    cerebellumMeshRef.current = cerebellumMesh;

    // Anatomical Brainstem (Inferior Column)
    const stemGeom = new THREE.CylinderGeometry(0.75, 0.55, 3.2, 24);
    stemGeom.translate(0, -3.8, -0.6);
    const brainstemMesh = new THREE.Mesh(stemGeom, cortexGlassMat.clone());
    scene.add(brainstemMesh);
    brainstemMeshRef.current = brainstemMesh;

    // 5. HIGH-DENSITY 3D CORTICAL CONNECTOME POINT CLOUD (4,800 Luminous Photons)
    const particleCount = 4800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorSilver = new THREE.Color(0xffffff);
    const colorEmerald = new THREE.Color(0x10b981);
    const colorIndigo = new THREE.Color(0x38bdf8);

    let pIdx = 0;
    for (let i = 0; i < particleCount; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = (Math.random() - 0.5) * Math.PI;
      const hemisphere = Math.random() > 0.5 ? 1 : -1;

      const rx = 4.6;
      const ry = 3.4;
      const rz = 5.6;

      const sulciNoise = Math.sin(u * 7) * Math.cos(v * 7) * 0.42;
      const fissureGap = Math.abs(Math.sin(u)) < 0.12 ? 0.65 : 0.0;
      const r = (1.0 + sulciNoise - fissureGap) * (0.88 + Math.random() * 0.22);

      const x = (rx * Math.cos(v) * Math.cos(u) + hemisphere * 0.55) * r;
      const y = (ry * Math.sin(v) + 0.6) * r;
      const z = (rz * Math.cos(v) * Math.sin(u)) * r;

      positions[pIdx] = x;
      positions[pIdx + 1] = y;
      positions[pIdx + 2] = z;

      const mixVal = Math.sin(x * 0.5) * 0.5 + 0.5;
      const c = colorSilver.clone().lerp(colorEmerald, mixVal * 0.4).lerp(colorIndigo, Math.random() * 0.3);

      colors[pIdx] = c.r;
      colors[pIdx + 1] = c.g;
      colors[pIdx + 2] = c.b;
      sizes[i] = Math.random() * 2.2 + 0.8;

      pIdx += 3;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const pointMaterial = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const brainPointCloud = new THREE.Points(geometry, pointMaterial);
    scene.add(brainPointCloud);
    brainPointCloudRef.current = brainPointCloud;

    // 6. 3D SYNAPTIC AXON TRACTS (High-Fidelity Bezier Fiber Streamlines)
    const tractsGroup = new THREE.Group();
    scene.add(tractsGroup);
    tractsGroupRef.current = tractsGroup;

    SYNAPSE_CONNECTIONS_3D.forEach((syn) => {
      const from = nodeMap.get(syn.fromNodeId);
      const to = nodeMap.get(syn.toNodeId);
      if (!from || !to) return;

      const p1 = new THREE.Vector3(from.x, from.y, from.z);
      const p2 = new THREE.Vector3(to.x, to.y, to.z);
      const mid = p1.clone().add(p2).multiplyScalar(0.5);

      if (syn.controlOffset) {
        mid.x += syn.controlOffset.x;
        mid.y += syn.controlOffset.y;
        mid.z += syn.controlOffset.z;
      }

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const tubeGeom = new THREE.TubeGeometry(curve, 32, 0.045, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: 0x52525b,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });

      const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
      tubeMesh.userData = { id: syn.id, curve, fromId: from.id, toId: to.id };
      tractsGroup.add(tubeMesh);
    });

    // 7. TRAVELING PHOTON PACKET
    const pulseGeom = new THREE.SphereGeometry(0.24, 16, 16);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.98,
      blending: THREE.AdditiveBlending,
    });
    const pulsePacket = new THREE.Mesh(pulseGeom, pulseMat);
    pulsePacket.visible = false;
    scene.add(pulsePacket);
    pulsePacketRef.current = pulsePacket;

    // 8. 3D INTERACTIVE NEURON NUCLEI (Spheres + Halos + Shockwave Beacon)
    BRAIN_NODES_3D.forEach((node) => {
      const nodeGroup = new THREE.Group();
      nodeGroup.position.set(node.x, node.y, node.z);

      // Core Luminous Sphere
      const sphereGeom = new THREE.SphereGeometry(0.48, 32, 32);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0x27272a,
        emissive: 0x3f3f46,
        emissiveIntensity: 0.3,
        roughness: 0.15,
        metalness: 0.85,
      });
      const sphere = new THREE.Mesh(sphereGeom, sphereMat);
      sphere.userData = { nodeId: node.id, nodeData: node };

      // Orbital Halo Ring
      const ringGeom = new THREE.RingGeometry(0.68, 0.82, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xa1a1aa,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.rotation.x = Math.PI / 2;

      // Volumetric Shockwave Ring (For Caught Hallucinations)
      const shockRingGeom = new THREE.RingGeometry(0.95, 1.35, 32);
      const shockRingMat = new THREE.MeshBasicMaterial({
        color: 0xff2244,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
      });
      const shockRing = new THREE.Mesh(shockRingGeom, shockRingMat);
      shockRing.rotation.x = Math.PI / 2;

      // Laser Point Light
      const light = new THREE.PointLight(0xffffff, 0.6, 6);

      nodeGroup.add(sphere);
      nodeGroup.add(ring);
      nodeGroup.add(shockRing);
      nodeGroup.add(light);
      scene.add(nodeGroup);

      nodeMeshesRef.current.set(node.id, {
        group: nodeGroup,
        sphere,
        halo: ring,
        shockRing,
        light,
      });
    });

    // 9. Interactive Raycasting & 360 Orbit Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isDragging = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);

      const interactiveSpheres = Array.from(nodeMeshesRef.current.values()).map((v) => v.sphere);
      const intersects = raycaster.intersectObjects(interactiveSpheres);

      if (intersects.length > 0) {
        const hitNode = intersects[0].object.userData.nodeData as BrainNode3D;
        setHoveredNode(hitNode);
        container.style.cursor = 'pointer';
      } else {
        setHoveredNode(null);
        container.style.cursor = isDragging ? 'grabbing' : 'grab';
      }

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;

        const spherical = new THREE.Spherical().setFromVector3(camera.position);
        spherical.theta -= deltaX * 0.0055;
        spherical.phi -= deltaY * 0.0055;
        spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

        camera.position.setFromSpherical(spherical);
        camera.lookAt(0, 0.5, 0);
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
      container.style.cursor = 'grab';
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomSpeed = 0.0028;
      const spherical = new THREE.Spherical().setFromVector3(camera.position);
      spherical.radius += e.deltaY * zoomSpeed;
      spherical.radius = Math.max(6, Math.min(32, spherical.radius));
      camera.position.setFromSpherical(spherical);
      camera.lookAt(0, 0.5, 0);
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);

      const interactiveSpheres = Array.from(nodeMeshesRef.current.values()).map((v) => v.sphere);
      const intersects = raycaster.intersectObjects(interactiveSpheres);

      if (intersects.length > 0) {
        const hitNode = intersects[0].object.userData.nodeData as BrainNode3D;
        setSelectedNodeId(hitNode.id);
        if (onNodeClick) {
          onNodeClick(hitNode.id);
        } else {
          openDrawerForNodeId(hitNode.id);
        }
      }
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('click', handleClick);

    // 10. Main Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (isAutoRotate && !isDragging) {
        const spherical = new THREE.Spherical().setFromVector3(camera.position);
        spherical.theta += 0.0016;
        camera.position.setFromSpherical(spherical);
        camera.lookAt(0, 0.5, 0);
      }

      // Pulse the point cloud
      if (brainPointCloudRef.current) {
        const pMat = brainPointCloudRef.current.material as THREE.PointsMaterial;
        pMat.opacity = 0.55 + Math.sin(elapsedTime * 1.5) * 0.1;
      }

      // Rotate orbital neuron halos & animate shockwaves
      nodeMeshesRef.current.forEach((meshObj) => {
        meshObj.halo.rotation.z += 0.014;
        meshObj.shockRing.rotation.z -= 0.01;

        if (meshObj.shockRing.material) {
          const sMat = meshObj.shockRing.material as THREE.MeshBasicMaterial;
          if (sMat.opacity > 0) {
            const scale = 1.0 + Math.sin(elapsedTime * 4.0) * 0.2;
            meshObj.shockRing.scale.set(scale, scale, scale);
          }
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isAutoRotate, nodeMap, onNodeClick, openDrawerForNodeId]);

  // Update Dynamic Lighting & Laser Highlight States
  useEffect(() => {
    if (!sceneRef.current) return;

    BRAIN_NODES_3D.forEach((node) => {
      const meshObj = nodeMeshesRef.current.get(node.id);
      if (!meshObj) return;

      const stepIndex = currentScenario.steps.findIndex((s) => s.nodeId === node.id);
      const isPast = stepIndex !== -1 && stepIndex < currentStepIndex;
      const isCurrent = stepIndex !== -1 && stepIndex === currentStepIndex;
      const isFlagged =
        stepIndex !== -1 &&
        currentScenario.steps[stepIndex]?.status === 'flagged' &&
        (isCurrent || isPast || playbackState === 'flagged');
      const isVerified =
        stepIndex !== -1 && currentScenario.steps[stepIndex]?.status === 'verified';
      const isSelected = selectedNodeId === node.id;

      const sphereMat = meshObj.sphere.material as THREE.MeshStandardMaterial;
      const haloMat = meshObj.halo.material as THREE.MeshBasicMaterial;
      const shockRingMat = meshObj.shockRing.material as THREE.MeshBasicMaterial;

      if (isFlagged) {
        // 🔥 CRITICAL HALLUCINATION / MISTAKE: Laser Glowing Crimson Red (#FF2244)
        sphereMat.color.setHex(0xff2244);
        sphereMat.emissive.setHex(0xff0033);
        sphereMat.emissiveIntensity = 3.5; // Super bright!
        haloMat.color.setHex(0xff2244);
        haloMat.opacity = 0.95;
        shockRingMat.opacity = 0.9;
        meshObj.light.color.setHex(0xff2244);
        meshObj.light.intensity = 4.2;
        meshObj.light.distance = 9.0;
      } else if (isVerified) {
        // 🟢 VERIFIED GROUND TRUTH FIX: Radiant Emerald (#10B981)
        sphereMat.color.setHex(0x10b981);
        sphereMat.emissive.setHex(0x34d399);
        sphereMat.emissiveIntensity = 2.4;
        haloMat.color.setHex(0x10b981);
        haloMat.opacity = 0.9;
        shockRingMat.opacity = 0.0;
        meshObj.light.color.setHex(0x10b981);
        meshObj.light.intensity = 2.5;
      } else if (isCurrent || isSelected) {
        // ⚪ ACTIVE STREAMING / SELECTED: Radiant Hyper White (#FFFFFF)
        sphereMat.color.setHex(0xffffff);
        sphereMat.emissive.setHex(0xffffff);
        sphereMat.emissiveIntensity = 2.8;
        haloMat.color.setHex(0xffffff);
        haloMat.opacity = 0.95;
        shockRingMat.opacity = 0.0;
        meshObj.light.color.setHex(0xffffff);
        meshObj.light.intensity = 3.0;
      } else if (isPast) {
        // 🟢 PASSED NOMINAL: Subtle Emerald
        sphereMat.color.setHex(0x059669);
        sphereMat.emissive.setHex(0x10b981);
        sphereMat.emissiveIntensity = 0.8;
        haloMat.color.setHex(0x10b981);
        haloMat.opacity = 0.5;
        shockRingMat.opacity = 0.0;
        meshObj.light.color.setHex(0x10b981);
        meshObj.light.intensity = 0.8;
      } else {
        // 🌑 IDLE NEURON
        sphereMat.color.setHex(0x27272a);
        sphereMat.emissive.setHex(0x3f3f46);
        sphereMat.emissiveIntensity = 0.2;
        haloMat.color.setHex(0x71717a);
        haloMat.opacity = 0.2;
        shockRingMat.opacity = 0.0;
        meshObj.light.color.setHex(0xffffff);
        meshObj.light.intensity = 0.2;
      }
    });

    // 3D Traveling Photon Pulse along active synaptic tract
    if (pulsePacketRef.current && tractsGroupRef.current) {
      if (playbackState === 'running' && currentStepIndex > 0 && currentStepIndex < currentScenario.steps.length) {
        const prevStep = currentScenario.steps[currentStepIndex - 1];
        const currStep = currentScenario.steps[currentStepIndex];

        const activeTract = tractsGroupRef.current.children.find(
          (c) =>
            (c.userData.fromId === prevStep.nodeId && c.userData.toId === currStep.nodeId) ||
            (c.userData.fromId === currStep.nodeId && c.userData.toId === prevStep.nodeId)
        ) as THREE.Mesh | undefined;

        if (activeTract && activeTract.userData.curve) {
          pulsePacketRef.current.visible = true;
          const curve = activeTract.userData.curve as THREE.QuadraticBezierCurve3;
          const midPt = curve.getPoint(0.5);
          pulsePacketRef.current.position.copy(midPt);
        } else {
          pulsePacketRef.current.visible = false;
        }
      } else {
        pulsePacketRef.current.visible = false;
      }
    }
  }, [playbackState, currentStepIndex, currentScenario, selectedNodeId]);

  return (
    <div className="relative w-full h-full rounded-2xl border border-white/[0.08] bg-[#000000] overflow-hidden select-none shadow-modal-depth group">
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left: Anatomical Status & Lobe Legend */}
      <div className="absolute top-4 left-5 flex flex-col gap-1.5 text-[11px] font-mono pointer-events-none z-10">
        <div className="flex items-center gap-2 text-white font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="tracking-wide uppercase">Anatomical 3D Brain Cortex</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400 text-[10px]">
          <span>DUAL HEMISPHERES</span>
          <span>•</span>
          <span>SULCAL TRACTOGRAPHY</span>
          <span>•</span>
          <span className="text-emerald-400">65K SAE LATENTS</span>
        </div>
      </div>

      {/* Top Right: Camera Presets & Interactive View Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-1 p-1 rounded-xl bg-zinc-950/90 border border-white/[0.1] backdrop-blur-md z-20 font-mono text-xs shadow-lg">
        <button
          onClick={() => setCameraView('iso')}
          className={cn(
            'px-2.5 py-1 rounded-lg transition-colors',
            activeCameraPreset === 'iso'
              ? 'bg-white text-black font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          )}
          title="Isometric 3D Perspective"
        >
          3D ISO
        </button>
        <button
          onClick={() => setCameraView('axial')}
          className={cn(
            'px-2.5 py-1 rounded-lg transition-colors',
            activeCameraPreset === 'axial'
              ? 'bg-white text-black font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          )}
          title="Axial (Superior Top View)"
        >
          Axial
        </button>
        <button
          onClick={() => setCameraView('sagittal')}
          className={cn(
            'px-2.5 py-1 rounded-lg transition-colors',
            activeCameraPreset === 'sagittal'
              ? 'bg-white text-black font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          )}
          title="Sagittal (Lateral Side View)"
        >
          Sagittal
        </button>
        <button
          onClick={() => setCameraView('coronal')}
          className={cn(
            'px-2.5 py-1 rounded-lg transition-colors',
            activeCameraPreset === 'coronal'
              ? 'bg-white text-black font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          )}
          title="Coronal (Anterior Frontal View)"
        >
          Coronal
        </button>

        <div className="h-4 w-px bg-white/[0.1] mx-1" />

        <button
          onClick={() => setIsAutoRotate(!isAutoRotate)}
          className={cn(
            'flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors',
            isAutoRotate
              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-medium'
              : 'text-zinc-400 hover:text-zinc-200'
          )}
          title="Toggle 3D Orbit Rotation"
        >
          <Rotate3d className="w-3.5 h-3.5" />
          <span className="text-[10px]">{isAutoRotate ? 'Orbit On' : 'Paused'}</span>
        </button>
      </div>

      {/* Floating 3D Hover/Click Tooltip Card */}
      {hoveredNode && (
        <div className="absolute bottom-5 left-5 z-20 max-w-sm p-4 rounded-xl border border-white/[0.14] bg-zinc-950/95 backdrop-blur-xl shadow-modal-depth text-xs font-mono animate-fade-in pointer-events-none">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 mb-2">
            <span className="font-semibold text-white text-xs">{hoveredNode.label}</span>
            <span className="text-[10px] text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-900 border border-white/[0.06]">
              {hoveredNode.anatomicalRegion}
            </span>
          </div>

          <div className="space-y-2 text-zinc-300 text-[11px]">
            <p className="leading-snug text-zinc-400">{hoveredNode.description}</p>
            <div className="p-2.5 rounded-lg bg-black/80 border border-white/[0.08] text-[10px] space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span className="text-zinc-200">{hoveredNode.saeFeature.featureId}</span>
                <span
                  className={cn(
                    'px-1.5 py-0.2 rounded font-mono',
                    hoveredNode.saeFeature.activationSigma > 3.0
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'text-emerald-400'
                  )}
                >
                  +{hoveredNode.saeFeature.activationSigma}σ
                </span>
              </div>
              <p className="text-zinc-300 italic truncate">"{hoveredNode.saeFeature.monosemanticLabel}"</p>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-zinc-400 font-medium">
            Click 3D neuron to inspect full circuit trace →
          </div>
        </div>
      )}

      {/* 🔥 FLAGGED ERROR / HALLUCINATION BANNER (Super Bright in 3D Space) */}
      {playbackState === 'flagged' && activeStep && (
        <div className="absolute bottom-5 right-5 z-20 flex items-center gap-4 p-4 rounded-xl border border-red-500/50 bg-zinc-950/95 backdrop-blur-xl shadow-glow-danger font-mono text-xs animate-fade-in">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 font-bold shrink-0">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-red-400 tracking-wide uppercase">
                🚨 Reasoning Anomaly Intercepted
              </span>
              <span className="text-[10px] text-red-300 px-1.5 py-0.2 rounded bg-red-950/60 border border-red-800/40">
                SAE Latent L28.14892 (+4.82σ)
              </span>
            </div>
            <p className="text-zinc-200 text-[11px] max-w-md line-clamp-1 mt-0.5">
              {activeStep.flagReason || 'Unverified monetary refund authorized'}
            </p>
          </div>
          <button
            onClick={() => openDrawerForStep(activeStep)}
            className="ml-2 rounded-lg bg-red-500 text-black hover:bg-red-400 px-4 py-2 font-semibold transition-colors shadow-sm shrink-0"
          >
            Inspect SAE Latent →
          </button>
        </div>
      )}
    </div>
  );
};
