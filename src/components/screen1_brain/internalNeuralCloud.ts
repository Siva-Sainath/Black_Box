import * as THREE from 'three';

/** Seeded PRNG for stable neuron layout across reloads */
function createRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function insideBrainBounds(x: number, y: number, z: number): boolean {
  if (y < -2.8) return false;
  const stemDist = Math.hypot(x, z + 0.5);
  if (y < -1.8 && stemDist > 0.9) return false;

  const ny = (y - 0.5) / 3.2;
  const nz = z / 4.2;
  const nx = x / 4.0;
  const ellipsoid = nx * nx + ny * ny * 0.9 + nz * nz * 0.85;
  return ellipsoid < 0.92;
}

export interface NeuralCloudData {
  positions: THREE.Vector3[];
  lineSegments: Float32Array;
}

export function generateNeuralCloud(
  nodeCount = 320,
  maxNeighbors = 3,
  maxDist = 1.35
): NeuralCloudData {
  const rng = createRng(42);
  const positions: THREE.Vector3[] = [];

  let attempts = 0;
  while (positions.length < nodeCount && attempts < nodeCount * 40) {
    attempts += 1;
    const u = rng();
    const v = rng();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = 3.6 * Math.cbrt(rng());
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta) + 0.45;
    const z = r * Math.cos(phi);

    if (insideBrainBounds(x, y, z)) {
      positions.push(new THREE.Vector3(x, y, z));
    }
  }

  const segments: number[] = [];
  for (let i = 0; i < positions.length; i++) {
    const neighbors: { j: number; d: number }[] = [];
    for (let j = 0; j < positions.length; j++) {
      if (i === j) continue;
      const d = positions[i].distanceTo(positions[j]);
      if (d < maxDist) neighbors.push({ j, d });
    }
    neighbors.sort((a, b) => a.d - b.d);
    const connect = neighbors.slice(0, maxNeighbors);
    for (const { j } of connect) {
      if (i < j) {
        segments.push(
          positions[i].x,
          positions[i].y,
          positions[i].z,
          positions[j].x,
          positions[j].y,
          positions[j].z
        );
      }
    }
  }

  return {
    positions,
    lineSegments: new Float32Array(segments),
  };
}

export const NEURAL_CLOUD = generateNeuralCloud();
