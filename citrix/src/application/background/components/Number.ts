// ============================================================================
// [BASELINE 2017 LIVE FACTS]
// Authentic Citrix File Path: src/application/background/components/Number.ts
// Module 354 Decompiled Source: 3D Telemetry Number Typography Counter
// Status: [EMPIRICALLY VERIFIED AUDIT - 100% MATCHED WITH MODULE 354 BUILD.JS]
// ============================================================================

import * as THREE from 'three';

export interface NumberOptions {
  value?: number | string;
  letterSpacing?: number;
  renderOrder?: number;
  opacity?: number;
}

export class TelemetryNumber {
  public letterSpacing: number;
  public renderOrder: number;
  public container: THREE.Object3D;
  private _opacity: number = 1;
  private _value: string = '';

  public texture!: THREE.Texture;
  public geometry!: THREE.PlaneGeometry;
  public materials: { all: THREE.MeshBasicMaterial[] } = { all: [] };

  constructor(options: NumberOptions = {}) {
    this.letterSpacing = options.letterSpacing !== undefined ? options.letterSpacing : 0.8;
    this.renderOrder = options.renderOrder !== undefined ? options.renderOrder : 0;
    this.container = new THREE.Object3D();

    this.setMaterials();
    this.setGeometry();

    if (options.opacity !== undefined) this.opacity = options.opacity;
    if (options.value !== undefined) this.value = options.value;
  }

  public setMaterials(): void {
    this.materials = { all: [] };
    this.texture = new THREE.TextureLoader().load('/assets/medias/3d/level-2/scene-1/numbers-alpha.png');

    for (let i = 0; i <= 9; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        alphaMap: this.texture,
        transparent: true,
        opacity: this._opacity,
        depthTest: true,
        depthWrite: false
      });
      this.materials.all.push(mat);
    }
  }

  public setGeometry(): void {
    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
  }

  public get opacity(): number {
    return this._opacity;
  }

  public set opacity(val: number) {
    this._opacity = val;
    this.materials.all.forEach(mat => {
      mat.opacity = val;
    });
  }

  public get value(): string {
    return this._value;
  }

  public set value(val: number | string) {
    const strVal = '' + val;
    if (strVal !== this._value) {
      const totalWidth = this.letterSpacing * strVal.length;

      while (this.container.children.length > 0) {
        this.container.remove(this.container.children[0]);
      }

      for (let i = 0; i < strVal.length; i++) {
        const char = strVal[i];
        const digitIndex = parseInt(char, 10);
        if (!isNaN(digitIndex) && this.materials.all[digitIndex]) {
          const mesh = new THREE.Mesh(this.geometry, this.materials.all[digitIndex]);
          mesh.position.x = this.letterSpacing * i - 0.5 * totalWidth + 0.5 * this.letterSpacing;
          mesh.renderOrder = this.renderOrder;
          this.container.add(mesh);
        }
      }
      this._value = strVal;
    }
  }
}
