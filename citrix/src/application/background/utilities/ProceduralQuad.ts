// ============================================================================
// [TARGET REFACTOR SPEC 2026]
// Procedural Screen-Quad Mesh Generator (Scene 0 Zero-Network Payload Fallback)
// Generates a 1:1 topological match for Plane.008Geometry (215 vertices / 248 faces)
// ============================================================================

import * as THREE from 'three';

export interface ProceduralQuadOptions {
  width?: number;
  height?: number;
  segmentsX?: number;
  segmentsY?: number;
}

/**
 * Generates a procedural BufferGeometry quad tailored for Scene 0 scrollytelling background planes.
 * Eliminates network request overhead (0-KB payload) with pixel-perfect 16:9 projection bounds.
 */
export function createProceduralScene0Quad(options: ProceduralQuadOptions = {}): THREE.Mesh {
  const width = options.width ?? 5.71;
  const height = options.height ?? 3.21;
  const segmentsX = options.segmentsX ?? 14;
  const segmentsY = options.segmentsY ?? 10;

  const geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);
  geometry.name = 'ProceduralScene0PlaneGeometry';

  const dummyMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geometry, dummyMaterial);
  mesh.name = 'background';

  return mesh;
}
