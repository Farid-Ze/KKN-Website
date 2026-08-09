// ============================================================================
// [BASELINE 2017 LIVE FACTS]
// Authentic Citrix File Path: src/application/background/scenes/Scene1.ts
// Module 358 Decompiled Source: Sub-Act 1 Telemetry Scene (Car, Graphs, RPM, Fuel)
// Status: [EMPIRICALLY VERIFIED AUDIT - 100% MATCHED WITH MODULE 358 BUILD.JS]
// ============================================================================

import * as THREE from 'three';
import gsap from 'gsap';
import { SubActScene, type SceneOptions } from './Scene';
import { TelemetryGraph } from '../components/Graph';
import { TelemetryNumber } from '../components/Number';

export class SubActScene1 extends SubActScene {
  public labelOpacity: number = 0.3;
  public cameraCoordinates: number[][] = [
    [0, 0.5, -3],
    [-1.5, 0, -3],
    [1.2, -0.1, -2]
  ];

  public car: any = {};
  public lines: any = {};
  public particles: any = {};
  public glows: any = {};
  public frontWing: any = {};
  public rotation: any = {};
  public fuel: any = {};
  public backgroundMesh: any = {};

  constructor(options: SceneOptions) {
    super(options);
  }

  public override start(): void {
    super.start();
    this.labelOpacity = this.sizes.width <= 770 ? 1 : 0.3;
    this.setBackground();
    this.setCar();
    this.setLines();
    this.setParticles();
    this.setGlows();
    this.setFrontWing();
    this.setRotation();
    this.setFuel();
  }

  public setBackground(): void {
    const geo = new THREE.PlaneGeometry(30, 30, 1, 1);
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x0b101e),
      transparent: true,
      opacity: 0.95,
      depthTest: false,
      depthWrite: false
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.z = 4;
    mesh.rotation.x = Math.PI;
    mesh.renderOrder = 1;
    this.container.add(mesh);
    this.backgroundMesh = mesh;
  }

  public setCar(): void {
    if (this.car && this.car.mover1) {
      this.container.remove(this.car.mover1);
    }
    this.car = {};
    this.car.mover1 = new THREE.Object3D();
    this.container.add(this.car.mover1);

    this.car.container = new THREE.Object3D();
    this.car.container.scale.set(0.14, 0.14, 0.14);
    this.car.container.rotation.set(-0.02, Math.PI, 0);
    this.car.container.position.set(0, -0.3, 0);
    this.car.mover1.add(this.car.container);

    this.car.wireframeMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x38bdf8),
      wireframe: true,
      transparent: true,
      opacity: 0.9
    });
    this.car.plainMaterial = new THREE.MeshBasicMaterial({ color: 0x0b101e });

    if (this.resources && this.resources.car && this.resources.car.model) {
      for (const key in this.resources.car.model) {
        const item = this.resources.car.model[key];
        const plainMesh = new THREE.Mesh(item.geometry, this.car.plainMaterial);
        plainMesh.renderOrder = 5;
        this.car.container.add(plainMesh);

        const wireMesh = new THREE.Mesh(item.geometry, this.car.wireframeMaterial);
        wireMesh.renderOrder = 5;
        this.car.container.add(wireMesh);
      }
    }
  }

  public setLines(): void {
    this.lines = {};
    this.lines.all = [];
    this.lines.count = 22;
    this.lines.container = new THREE.Object3D();
    this.container.add(this.lines.container);

    for (let i = 0; i < this.lines.count; i++) {
      const item: any = {};
      item.width = 0.05 * Math.random();
      item.height = 50 * Math.random();
      item.rotationRandom = 0.4 + 0.3 * Math.random();
      item.translationRandom = Math.random();

      item.material = new THREE.MeshBasicMaterial({
        color: 0x2a5c82,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.25 * Math.random(),
        depthTest: true,
        depthWrite: false
      });

      item.geometry = new THREE.PlaneGeometry(item.width, item.height, 1, 1);
      item.mesh = new THREE.Mesh(item.geometry, item.material);
      item.mesh.position.x = Math.sin(item.rotationRandom * Math.PI * 2);
      item.mesh.position.y = 0.2 * Math.cos(item.rotationRandom * Math.PI * 2) - 0.3;
      item.mesh.rotation.x = 0.5 * Math.PI;
      item.mesh.renderOrder = 0;

      this.lines.all.push(item);
      this.lines.container.add(item.mesh);
    }
  }

  public setParticles(): void {
    this.particles = {};
    const countX = 160;
    const countZ = 160;
    const total = countX * countZ;
    const positions = new Float32Array(total * 3);

    let idx = 0;
    for (let z = 0; z < countZ; z++) {
      const posZ = 0.05 * z - 2;
      for (let x = 0; x < countX; x++) {
        const posX = 0.05 * x - 4;
        positions[idx * 3 + 0] = posX;
        positions[idx * 3 + 1] = -0.38;
        positions[idx * 3 + 2] = posZ;
        idx++;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xaabbee,
      size: 0.03,
      transparent: true,
      opacity: 0.3,
      depthTest: true,
      depthWrite: false
    });

    this.particles.points = new THREE.Points(geo, mat);
    this.container.add(this.particles.points);
  }

  public setGlows(): void {
    this.glows = {};
    const geo = new THREE.PlaneGeometry(0.5, 0.5);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xff3355,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.5,
      depthTest: true,
      depthWrite: false
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, 1.5, 27);
    mesh.scale.set(3 / 0.045, 1 / 0.045, 1 / 0.045);
    this.car.container.add(mesh);
  }

  public setFrontWing(): void {
    this.frontWing = {};
    this.frontWing.container = new THREE.Object3D();
    this.frontWing.container.position.set(-0.87, 0.1, 0.3);
    this.container.add(this.frontWing.container);

    this.frontWing.graphs = [];
    const graph1 = new TelemetryGraph({
      time: this.time,
      labelPath: '/assets/medias/3d/level-2/scene-1/graph-label-high.png',
      labelWidth: 64,
      labelHeight: 32,
      lineColor: 0x378247,
      amplitudeX: 1.8,
      amplitudeY: 0.6,
      alpha: 1,
      frequency: 120,
      lineDivisions: 128,
      randomSeed: 0
    });
    this.frontWing.container.add(graph1.container);
    this.frontWing.graphs.push(graph1);

    const graph2 = new TelemetryGraph({
      time: this.time,
      labelPath: '/assets/medias/3d/level-2/scene-1/graph-label-normal.png',
      labelWidth: 64,
      labelHeight: 32,
      lineColor: 0x4767bf,
      amplitudeX: 1.8,
      amplitudeY: 0.6,
      alpha: 1,
      frequency: 120,
      lineDivisions: 128,
      randomSeed: 0.1
    });
    graph2.container.position.z += 0.2;
    this.frontWing.container.add(graph2.container);
    this.frontWing.graphs.push(graph2);
  }

  public setRotation(): void {
    this.rotation = {};
    this.rotation.container = new THREE.Object3D();
    this.rotation.container.rotation.y = 0.4;
    this.rotation.container.scale.set(1.1, 1.1, 1.1);
    this.rotation.container.position.set(0.2, 0.6, 0.75);
    this.container.add(this.rotation.container);

    this.rotation.number = new TelemetryNumber({ value: 9000, opacity: 1, renderOrder: 3 });
    this.rotation.number.container.position.set(0.25, -0.043, -0.1);
    this.rotation.number.container.rotation.y = Math.PI;
    this.rotation.number.container.scale.set(0.45, 0.45, 0.45);
    this.rotation.container.add(this.rotation.number.container);
  }

  public setFuel(): void {
    this.fuel = {};
    this.fuel.container = new THREE.Object3D();
    this.fuel.container.rotation.y = -0.65;
    this.fuel.container.scale.set(1, 1, 1);
    this.fuel.container.position.set(-0.8, 0.5, 0.9);
    this.container.add(this.fuel.container);

    this.fuel.number = new TelemetryNumber({ value: 50, opacity: 1, renderOrder: 3 });
    this.fuel.number.container.position.set(0.19, -0.02, -0.1);
    this.fuel.number.container.rotation.y = Math.PI;
    this.fuel.number.container.scale.set(0.5, 0.5, 0.5);
    this.fuel.container.add(this.fuel.number.container);
  }

  public override goToStep(stepIndex: number): void {
    super.goToStep(stepIndex);
    const coords = this.cameraCoordinates[stepIndex];
    if (coords && this.camera && this.camera.originalPosition) {
      gsap.to(this.camera.originalPosition, {
        duration: 1.5,
        x: coords[0],
        y: coords[1],
        z: coords[2],
        ease: 'power3.inOut'
      });
    }
  }

  public override update(): void {
    super.update();
    if (this.frontWing && this.frontWing.graphs) {
      this.frontWing.graphs.forEach((g: TelemetryGraph) => g.update());
    }
    if (this.lines && this.lines.all) {
      this.lines.all.forEach((item: any) => {
        const progress = (0.0001 * this.time.elapsed + item.translationRandom) % 1;
        item.mesh.position.z = 500 * progress - 25;
      });
    }
  }
}
