// ============================================================================
// [BASELINE 2017 LIVE FACTS & TARGET REFACTOR SPEC 2026]
// Authentic Citrix File Path: src/application/background/scenes/Scene0.ts
// Encapsulated 3D Scene Class for Act 1 Scrollytelling
// ============================================================================

import * as THREE from 'three';
import { SubActScene, type SceneOptions } from './Scene';

export class Scene0 extends SubActScene {
  public fov: number = 40;
  public camPos: [number, number, number] = [0, 0, -5];

  constructor(options: SceneOptions) {
    super(options);
  }

  public override start(): void {
    super.start();
  }

  public setupCameraMatrix(exportedCam: THREE.PerspectiveCamera): void {
    if (exportedCam && exportedCam.matrix) {
      this.camera.matrixAutoUpdate = false;
      this.camera.matrix.copy(exportedCam.matrix);
      this.camera.matrixWorld.copy(exportedCam.matrix);
      this.camera.matrixWorldNeedsUpdate = false;
    }
  }
}
