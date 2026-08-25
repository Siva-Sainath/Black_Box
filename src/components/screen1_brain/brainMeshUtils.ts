import * as THREE from 'three';

/** Deform sphere into left cerebral hemisphere with sulcal ripples */
export function createLeftHemisphereGeometry(): THREE.BufferGeometry {
  const geom = new THREE.SphereGeometry(4.2, 64, 48);
  const pos = geom.attributes.position as THREE.BufferAttribute;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    if (x > 0) x = x * 0.12 - 0.25;
    else x = x * 0.95 - 0.35;

    z = z * 1.18;
    y = y * 0.88;

    const gyri = Math.sin(x * 3.5) * Math.cos(z * 3.5) * Math.sin(y * 4.0) * 0.22;
    x += gyri * 0.35;
    y += gyri * 0.28;
    z += gyri * 0.35;

    pos.setXYZ(i, x, y + 0.5, z);
  }
  pos.needsUpdate = true;
  geom.computeVertexNormals();
  return geom;
}

/** Deform sphere into right cerebral hemisphere */
export function createRightHemisphereGeometry(): THREE.BufferGeometry {
  const geom = new THREE.SphereGeometry(4.2, 64, 48);
  const pos = geom.attributes.position as THREE.BufferAttribute;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    if (x < 0) x = x * 0.12 + 0.25;
    else x = x * 0.95 + 0.35;

    z = z * 1.18;
    y = y * 0.88;

    const gyri = Math.sin(x * 3.5) * Math.cos(z * 3.5) * Math.sin(y * 4.0) * 0.22;
    x += gyri * 0.35;
    y += gyri * 0.28;
    z += gyri * 0.35;

    pos.setXYZ(i, x, y + 0.5, z);
  }
  pos.needsUpdate = true;
  geom.computeVertexNormals();
  return geom;
}

export function createCerebellumGeometry(): THREE.BufferGeometry {
  const geom = new THREE.SphereGeometry(1.8, 32, 24);
  const pos = geom.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) * 1.35;
    const y = pos.getY(i) * 0.65;
    const z = pos.getZ(i) * 0.85;
    pos.setXYZ(i, x, y - 2.4, z - 2.8);
  }
  pos.needsUpdate = true;
  geom.computeVertexNormals();
  return geom;
}

export function createBrainstemGeometry(): THREE.BufferGeometry {
  const geom = new THREE.CylinderGeometry(0.55, 0.4, 2.8, 16);
  geom.translate(0, -3.5, -0.5);
  return geom;
}

export const CORTEX_MATERIAL_PROPS = {
  color: '#1a1a22',
  emissive: '#2a2a35',
  emissiveIntensity: 0.35,
  roughness: 0.35,
  metalness: 0.15,
  transmission: 0.55,
  thickness: 0.8,
  transparent: true,
  opacity: 0.72,
};
