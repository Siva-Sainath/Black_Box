import * as THREE from 'three';

export function createAnatomicalBrain() {
  const brainGroup = new THREE.Group();

  // Left hemisphere — smooth organic shape
  const leftGeometry = new THREE.IcosahedronGeometry(2.8, 5);
  const leftVertices = leftGeometry.attributes.position;
  const leftPositionAttribute = leftVertices as THREE.BufferAttribute;

  // Shift left hemisphere left and add slight asymmetry
  for (let i = 0; i < leftPositionAttribute.count; i++) {
    const x = leftPositionAttribute.getX(i);
    const y = leftPositionAttribute.getY(i);
    const z = leftPositionAttribute.getZ(i);

    // Asymmetrical bulge
    const newX = x - 1.2 + Math.sin(y * 0.8) * 0.3;
    const newY = y + (Math.abs(x) > 1.5 ? 0.3 : 0);
    const newZ = z + Math.cos(y * 0.6) * 0.2;

    leftPositionAttribute.setXYZ(i, newX, newY, newZ);
  }
  leftPositionAttribute.needsUpdate = true;
  leftGeometry.computeVertexNormals();

  const leftMaterial = new THREE.MeshPhongMaterial({
    color: 0x4f46e5,
    emissive: 0x4338ca,
    emissiveIntensity: 0.6,
    shininess: 100,
    wireframe: false,
  });
  const leftHemisphere = new THREE.Mesh(leftGeometry, leftMaterial);
  leftHemisphere.position.set(-0.8, 0.2, 0);
  brainGroup.add(leftHemisphere);

  // Right hemisphere
  const rightGeometry = new THREE.IcosahedronGeometry(2.8, 5);
  const rightVertices = rightGeometry.attributes.position;
  const rightPositionAttribute = rightVertices as THREE.BufferAttribute;

  for (let i = 0; i < rightPositionAttribute.count; i++) {
    const x = rightPositionAttribute.getX(i);
    const y = rightPositionAttribute.getY(i);
    const z = rightPositionAttribute.getZ(i);

    const newX = -x + 1.2 + Math.sin(y * 0.8) * 0.3;
    const newY = y + (Math.abs(x) > 1.5 ? 0.3 : 0);
    const newZ = z + Math.cos(y * 0.6) * 0.2;

    rightPositionAttribute.setXYZ(i, newX, newY, newZ);
  }
  rightPositionAttribute.needsUpdate = true;
  rightGeometry.computeVertexNormals();

  const rightMaterial = new THREE.MeshPhongMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.6,
    shininess: 100,
  });
  const rightHemisphere = new THREE.Mesh(rightGeometry, rightMaterial);
  rightHemisphere.position.set(0.8, 0.2, 0);
  brainGroup.add(rightHemisphere);

  // Cerebellum — smaller bulge at bottom back
  const cerebellumGeometry = new THREE.IcosahedronGeometry(1.0, 4);
  const cerebellumMaterial = new THREE.MeshPhongMaterial({
    color: 0xa855f7,
    emissive: 0x7c3aed,
    emissiveIntensity: 0.5,
    shininess: 80,
  });
  const cerebellum = new THREE.Mesh(cerebellumGeometry, cerebellumMaterial);
  cerebellum.position.set(0, -1.2, 1.8);
  cerebellum.scale.set(0.8, 0.6, 0.9);
  brainGroup.add(cerebellum);

  // Brainstem — thin connector
  const brainstemGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.5, 8);
  const brainstemMaterial = new THREE.MeshPhongMaterial({
    color: 0xf59e0b,
    emissive: 0xd97706,
    emissiveIntensity: 0.5,
  });
  const brainstem = new THREE.Mesh(brainstemGeometry, brainstemMaterial);
  brainstem.position.set(0, -1.8, 0.8);
  brainGroup.add(brainstem);

  return { brainGroup, leftHemisphere, rightHemisphere, cerebellum, brainstem };
}

export function createNeuronConnections(nodePositions: Array<{ x: number; y: number; z: number }>) {
  const lineGroup = new THREE.Group();
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x06b6d4,
    linewidth: 2,
    fog: true,
  });

  // Connect nearby neurons with glow
  for (let i = 0; i < nodePositions.length; i++) {
    for (let j = i + 1; j < nodePositions.length; j++) {
      const p1 = nodePositions[i];
      const p2 = nodePositions[j];
      const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y, p1.z - p2.z);

      if (dist < 2.5) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array([p1.x, p1.y, p1.z, p2.x, p2.y, p2.z]);
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const line = new THREE.Line(geometry, lineMaterial);
        lineGroup.add(line);
      }
    }
  }

  return lineGroup;
}
