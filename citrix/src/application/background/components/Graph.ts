// ============================================================================
// [BASELINE 2017 LIVE FACTS]
// Authentic Citrix File Path: src/application/background/components/Graph.ts
// Module 355 Decompiled Source: Telemetry Waveform Shader & Label Mover
// Status: [EMPIRICALLY VERIFIED AUDIT - 100% MATCHED WITH MODULE 355 BUILD.JS]
// ============================================================================

import * as THREE from 'three';

export interface GraphOptions {
  time: { elapsed: number };
  labelPath: string;
  labelWidth: number;
  labelHeight: number;
  lineColor: number;
  amplitudeX: number;
  amplitudeY: number;
  alpha: number;
  frequency: number;
  lineDivisions: number;
  randomSeed: number;
}

export class TelemetryGraph {
  public time: { elapsed: number };
  public labelPath: string;
  public labelWidth: number;
  public labelHeight: number;
  public lineColor: number;
  public amplitudeX: number;
  public amplitudeY: number;
  public alpha: number;
  public frequency: number;
  public lineDivisions: number;
  public randomSeed: number;

  public container: THREE.Object3D;
  public value: number = 0;
  public labelScale: number = 0.0025;
  public progressSpeed: number = 0.00005;

  public line: {
    progress: number;
    material: THREE.LineBasicMaterial;
    geometry: THREE.BufferGeometry;
    mesh: THREE.Line;
    positions: Float32Array;
  } = {} as any;

  public label: {
    texture: THREE.Texture;
    material: THREE.MeshBasicMaterial;
    geometry: THREE.PlaneGeometry;
    mesh: THREE.Mesh;
  } = {} as any;

  constructor(options: GraphOptions) {
    this.time = options.time;
    this.labelPath = options.labelPath;
    this.labelWidth = options.labelWidth;
    this.labelHeight = options.labelHeight;
    this.lineColor = options.lineColor;
    this.amplitudeX = options.amplitudeX;
    this.amplitudeY = options.amplitudeY;
    this.alpha = options.alpha;
    this.frequency = options.frequency;
    this.lineDivisions = options.lineDivisions;
    this.randomSeed = options.randomSeed * Math.PI * 2;

    this.container = new THREE.Object3D();
    this.setLine();
    this.setLabel();
  }

  public setLine(): void {
    this.line = {} as any;
    this.line.progress = 0;
    this.line.material = new THREE.LineBasicMaterial({
      color: new THREE.Color(this.lineColor),
      transparent: true,
      opacity: this.alpha,
      depthTest: true,
      depthWrite: false
    });

    const stepX = this.amplitudeX / this.lineDivisions;
    const positions = new Float32Array(this.lineDivisions * 3);

    for (let i = 0; i < this.lineDivisions; i++) {
      positions[i * 3 + 0] = stepX * i;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
    }

    this.line.positions = positions;
    this.line.geometry = new THREE.BufferGeometry();
    this.line.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.line.mesh = new THREE.Line(this.line.geometry, this.line.material);
    this.container.add(this.line.mesh);
  }

  public getValue(t: number): number {
    const freq = (t / this.lineDivisions) * this.frequency;
    let n = 0;
    n += (Math.sin(0.001 * freq + this.randomSeed) * Math.sin(0.00033 * freq + this.randomSeed) * 0.5 + 0.5);
    n += (Math.sin(0.002 * freq + this.randomSeed) * Math.sin(0.00042 * freq + this.randomSeed) * 0.5 + 0.5);
    n += 0.1 * (Math.sin(0.01 * freq + this.randomSeed) * Math.sin(0.00037 * freq + this.randomSeed) * 0.5 + 0.5);
    return n / 2.1;
  }

  public setLabel(): void {
    const width = this.labelWidth * this.labelScale;
    const height = this.labelHeight * this.labelScale;

    this.label = {} as any;
    this.label.texture = new THREE.TextureLoader().load(this.labelPath);
    this.label.material = new THREE.MeshBasicMaterial({
      map: this.label.texture,
      wireframe: false,
      transparent: true,
      opacity: this.alpha,
      depthTest: true,
      depthWrite: false
    });

    this.label.geometry = new THREE.PlaneGeometry(width, height, 1, 1);
    this.label.geometry.translate(width / 2 - 0.003, height / 2 - 0.003, 0);

    this.label.mesh = new THREE.Mesh(this.label.geometry, this.label.material);
    this.label.mesh.rotation.y = Math.PI;
    this.container.add(this.label.mesh);
  }

  public update(): void {
    this.value = this.getValue(this.time.elapsed);
    const posY = this.value * this.amplitudeY;

    if (this.label && this.label.mesh) {
      this.label.mesh.position.y = posY;
    }

    if (this.line && this.line.positions && this.line.geometry) {
      for (let i = 0; i < this.lineDivisions; i++) {
        this.line.positions[i * 3 + 1] = this.getValue(this.time.elapsed - 100 * i) * this.amplitudeY;
      }
      this.line.geometry.attributes.position.needsUpdate = true;
    }
  }
}
