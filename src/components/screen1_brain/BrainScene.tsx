import React, { useMemo, useRef, useState, useLayoutEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Line } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useAgentRun } from '../../context/AgentRunContext';
import { BRAIN_NODES_3D, SYNAPSE_CONNECTIONS_3D } from '../../data/mockNodes';
import {
  createLeftHemisphereGeometry,
  createRightHemisphereGeometry,
  createCerebellumGeometry,
  createBrainstemGeometry,
} from './brainMeshUtils';
import { NEURAL_CLOUD } from './internalNeuralCloud';

const WHITE_SHELL = '#f0f9ff';
const CYAN_GLOW = '#67e8f9';
const ERROR_RED = '#ff2244';

function HolographicShell({
  geometry,
}: {
  geometry: THREE.BufferGeometry;
}) {
  return (
    <group>
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color={WHITE_SHELL}
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color={WHITE_SHELL}
          wireframe
          transparent
          opacity={0.42}
        />
      </mesh>
    </group>
  );
}

function Cortex() {
  const leftGeom = useMemo(() => createLeftHemisphereGeometry(), []);
  const rightGeom = useMemo(() => createRightHemisphereGeometry(), []);
  const cerebellumGeom = useMemo(() => createCerebellumGeometry(), []);
  const stemGeom = useMemo(() => createBrainstemGeometry(), []);

  return (
    <group>
      <HolographicShell geometry={leftGeom} />
      <HolographicShell geometry={rightGeom} />
      <HolographicShell geometry={cerebellumGeom} />
      <HolographicShell geometry={stemGeom} />
    </group>
  );
}

function InternalNeuralCloud() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { positions, lineSegments } = NEURAL_CLOUD;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    const scale = 0.055;
    positions.forEach((p, i) => {
      dummy.position.copy(p);
      const jitter = 0.85 + ((i * 17) % 10) / 20;
      dummy.scale.setScalar(scale * jitter);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [positions, dummy]);

  return (
    <group>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[lineSegments, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={CYAN_GLOW} transparent opacity={0.22} />
      </lineSegments>
      <instancedMesh ref={meshRef} args={[undefined, undefined, positions.length]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color={CYAN_GLOW} transparent opacity={0.85} />
      </instancedMesh>
    </group>
  );
}

function SemanticNeuron({
  node,
  stepIdx,
  isCurrent,
  isPast,
  isFlagged,
  isActive,
  onSelect,
}: {
  node: typeof BRAIN_NODES_3D[0];
  stepIdx: number;
  isCurrent: boolean;
  isPast: boolean;
  isFlagged: boolean;
  isActive: boolean;
  onSelect: () => void;
}) {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const baseScale = 0.11;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (isFlagged && coreRef.current && glowRef.current) {
      const pulse = 1 + Math.sin(t * 6) * 0.35;
      coreRef.current.scale.setScalar(baseScale * 1.8 * pulse);
      glowRef.current.scale.setScalar(baseScale * 3.2 * pulse);
      const mat = coreRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.85 + Math.sin(t * 6) * 0.15;
    } else if (isActive && coreRef.current) {
      const pulse = 1 + Math.sin(t * 4) * 0.15;
      coreRef.current.scale.setScalar(baseScale * 1.5 * pulse);
    }
  });

  const coreColor = isFlagged ? ERROR_RED : isActive ? CYAN_GLOW : WHITE_SHELL;
  const glowColor = isFlagged ? ERROR_RED : CYAN_GLOW;
  const coreScale = isFlagged ? baseScale * 1.8 : isActive ? baseScale * 1.5 : baseScale;
  const showGlow = isFlagged || isActive || isPast;

  if (stepIdx < 0) return null;

  return (
    <group position={[node.x, node.y, node.z]}>
      {showGlow && (
        <mesh ref={glowRef} scale={isFlagged ? baseScale * 3.2 : baseScale * 2.2}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshBasicMaterial
            color={glowColor}
            transparent
            opacity={isFlagged ? 0.35 : 0.18}
            depthWrite={false}
          />
        </mesh>
      )}
      <mesh
        ref={coreRef}
        scale={coreScale}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <sphereGeometry args={[1, 14, 14]} />
        <meshBasicMaterial color={coreColor} transparent opacity={0.95} />
      </mesh>
    </group>
  );
}

function SemanticNeurons() {
  const {
    currentScenario,
    currentStepIndex,
    playbackState,
    openDrawerForNodeId,
  } = useAgentRun();

  return (
    <group>
      {BRAIN_NODES_3D.map((node) => {
        const stepIdx = currentScenario.steps.findIndex((s) => s.nodeId === node.id);
        const step = stepIdx >= 0 ? currentScenario.steps[stepIdx] : null;
        const isCurrent = currentStepIndex === stepIdx;
        const isPast = currentStepIndex > stepIdx;
        const isFlagged =
          step?.status === 'flagged' && (isCurrent || isPast || playbackState === 'flagged');
        const isActive = isCurrent && playbackState === 'running';

        return (
          <SemanticNeuron
            key={node.id}
            node={node}
            stepIdx={stepIdx}
            isCurrent={isCurrent}
            isPast={isPast}
            isFlagged={isFlagged}
            isActive={isActive}
            onSelect={() => openDrawerForNodeId(node.id)}
          />
        );
      })}
    </group>
  );
}

function Synapses() {
  const { currentScenario, currentStepIndex, playbackState } = useAgentRun();
  const nodeMap = useMemo(() => {
    const m = new Map<string, typeof BRAIN_NODES_3D[0]>();
    BRAIN_NODES_3D.forEach((n) => m.set(n.id, n));
    return m;
  }, []);

  const flaggedNodeIds = useMemo(() => {
    const ids = new Set<string>();
    currentScenario.steps.forEach((step, idx) => {
      if (step.status === 'flagged' && idx <= currentStepIndex) {
        ids.add(step.nodeId);
      }
    });
    return ids;
  }, [currentScenario, currentStepIndex]);

  const activePair = useMemo(() => {
    if (currentStepIndex <= 0) return null;
    const prev = currentScenario.steps[currentStepIndex - 1];
    const curr = currentScenario.steps[currentStepIndex];
    return { from: prev.nodeId, to: curr.nodeId };
  }, [currentScenario, currentStepIndex]);

  return (
    <group>
      {SYNAPSE_CONNECTIONS_3D.map((syn) => {
        const from = nodeMap.get(syn.fromNodeId);
        const to = nodeMap.get(syn.toNodeId);
        if (!from || !to) return null;

        const touchesFlagged =
          flaggedNodeIds.has(syn.fromNodeId) || flaggedNodeIds.has(syn.toNodeId);
        const isActive =
          activePair &&
          ((activePair.from === syn.fromNodeId && activePair.to === syn.toNodeId) ||
            (activePair.from === syn.toNodeId && activePair.to === syn.fromNodeId));

        const p1 = new THREE.Vector3(from.x, from.y, from.z);
        const p2 = new THREE.Vector3(to.x, to.y, to.z);
        const mid = p1.clone().add(p2).multiplyScalar(0.5);
        if (syn.controlOffset) {
          mid.x += syn.controlOffset.x;
          mid.y += syn.controlOffset.y;
          mid.z += syn.controlOffset.z;
        }
        const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
        const points = curve.getPoints(28);

        let color = CYAN_GLOW;
        let opacity = 0.35;
        if (touchesFlagged) {
          color = ERROR_RED;
          opacity = 0.75;
        } else if (isActive) {
          color = CYAN_GLOW;
          opacity = 0.9;
        }

        return (
          <Line
            key={syn.id}
            points={points}
            color={color}
            transparent
            opacity={opacity}
            lineWidth={touchesFlagged ? 2 : 1}
          />
        );
      })}
    </group>
  );
}

function SignalPulse() {
  const { currentScenario, currentStepIndex, playbackState } = useAgentRun();
  const ref = useRef<THREE.Mesh>(null);
  const nodeMap = useMemo(() => {
    const m = new Map<string, typeof BRAIN_NODES_3D[0]>();
    BRAIN_NODES_3D.forEach((n) => m.set(n.id, n));
    return m;
  }, []);

  const flaggedStep =
    playbackState === 'flagged' && currentStepIndex >= 0
      ? currentScenario.steps[currentStepIndex]
      : null;

  const curve = useMemo(() => {
    if (playbackState === 'flagged' && flaggedStep) {
      const node = nodeMap.get(flaggedStep.nodeId);
      if (!node) return null;
      return {
        type: 'pulse' as const,
        center: new THREE.Vector3(node.x, node.y, node.z),
      };
    }
    if (currentStepIndex <= 0 || playbackState !== 'running') return null;
    const prev = currentScenario.steps[currentStepIndex - 1];
    const curr = currentScenario.steps[currentStepIndex];
    const syn = SYNAPSE_CONNECTIONS_3D.find(
      (s) =>
        (s.fromNodeId === prev.nodeId && s.toNodeId === curr.nodeId) ||
        (s.fromNodeId === curr.nodeId && s.toNodeId === prev.nodeId)
    );
    const from = nodeMap.get(prev.nodeId);
    const to = nodeMap.get(curr.nodeId);
    if (!from || !to) return null;
    const p1 = new THREE.Vector3(from.x, from.y, from.z);
    const p2 = new THREE.Vector3(to.x, to.y, to.z);
    const mid = p1.clone().add(p2).multiplyScalar(0.5);
    if (syn?.controlOffset) {
      mid.x += syn.controlOffset.x;
      mid.y += syn.controlOffset.y;
      mid.z += syn.controlOffset.z;
    }
    return {
      type: 'path' as const,
      curve: new THREE.QuadraticBezierCurve3(p1, mid, p2),
    };
  }, [currentScenario, currentStepIndex, playbackState, flaggedStep, nodeMap]);

  useFrame((state) => {
    if (!ref.current || !curve) {
      if (ref.current) ref.current.visible = false;
      return;
    }
    ref.current.visible = true;
    const t = state.clock.elapsedTime;
    if (curve.type === 'pulse') {
      const pulse = 1 + Math.sin(t * 8) * 0.4;
      ref.current.position.copy(curve.center);
      ref.current.scale.setScalar(0.35 * pulse);
      const mat = ref.current.material as THREE.MeshBasicMaterial;
      mat.color.set(ERROR_RED);
      mat.opacity = 0.6 + Math.sin(t * 8) * 0.3;
    } else {
      const p = curve.curve.getPoint((t * 0.5) % 1);
      ref.current.position.copy(p);
      ref.current.scale.setScalar(0.1);
      const mat = ref.current.material as THREE.MeshBasicMaterial;
      mat.color.set(CYAN_GLOW);
      mat.opacity = 0.95;
    }
  });

  if (!curve) return null;

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 10, 10]} />
      <meshBasicMaterial color={CYAN_GLOW} transparent opacity={0.95} />
    </mesh>
  );
}

function SceneContent() {
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.5, 14]} fov={38} />
      <OrbitControls
        enablePan={false}
        minDistance={7}
        maxDistance={26}
        target={[0, 0.4, 0]}
        autoRotate={autoRotate}
        autoRotateSpeed={0.28}
        onStart={() => setAutoRotate(false)}
      />
      <ambientLight intensity={0.15} />
      <Cortex />
      <InternalNeuralCloud />
      <Synapses />
      <SemanticNeurons />
      <SignalPulse />
      <EffectComposer>
        <Bloom
          intensity={1.4}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.85}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

export const BrainScene: React.FC = () => {
  return (
    <Canvas
      className="w-full h-full touch-none"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
      style={{ background: '#000000' }}
    >
      <color attach="background" args={['#000000']} />
      <SceneContent />
    </Canvas>
  );
};
