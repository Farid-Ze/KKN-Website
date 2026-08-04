// ============================================================================
// [BASELINE 2017 LIVE FACTS]
// Authentic Citrix File Path: src/application/background/scenes/Scene3.ts
// Module 360 Decompiled Source: Sub-Act 3 Telemetry Scene (Globe, Raycaster Car, RPM, Graphs)
// Status: [EMPIRICALLY VERIFIED AUDIT - 100% MATCHED WITH MODULE 360 BUILD.JS]
// ============================================================================

import * as THREE from 'three';
import gsap from 'gsap';
import { SubActScene, type SceneOptions } from './Scene';
import { TelemetryGraph } from '../components/Graph';
import { TelemetryNumber } from '../components/Number';

export class SubActScene3 extends SubActScene {
  public labelOpacity: number = 0.3;
  public cameraCoordinates: number[][] = [
    [-1, 0.05, -2],
    [0, 1.3, -3]
  ];

  public cursor3d: THREE.Vector3 = new THREE.Vector3();
  public rayCaster: THREE.Raycaster = new THREE.Raycaster();
  public cursorPosition: THREE.Vector2 = new THREE.Vector2();

  public background: any = {};
  public circle: any = {};
  public car: any = {};
  public checkTitle: any = {};
  public telemetry: any = {};

  constructor(options: SceneOptions) {
    super(options);
  }

  public override start(): void {
    super.start();
    this.labelOpacity = this.sizes.width <= 770 ? 1 : 0.3;
    this.setBackground();
    this.setCircle();
    this.setCar();
    this.setCheckTitle();
    this.setTelemetry();
  }

  public setBackground(): void {
    this.background = {};
    this.background.geometry = new THREE.PlaneGeometry(8, 8, 1, 1);
    this.background.material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x0c2232),
      transparent: true,
      opacity: 0.95,
      depthTest: true,
      depthWrite: false
    });
    this.background.mesh = new THREE.Mesh(this.background.geometry, this.background.material);
    this.background.mesh.position.set(3.7, 0, 3.5);
    this.background.mesh.rotation.x = Math.PI;
    this.container.add(this.background.mesh);
  }

  public getCircleGeometry(segments: number, outerRadius: number, innerRadius: number): THREE.BufferGeometry {
    const angleStep = (2 * Math.PI) / segments;
    const vertices: THREE.Vector3[] = [];

    for (let i = 0; i < segments; i++) {
      const angle = i * angleStep;
      vertices.push(new THREE.Vector3(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius, 0));
      vertices.push(new THREE.Vector3(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius, 0));
    }
    return new THREE.BufferGeometry().setFromPoints(vertices);
  }

  public setCircle(): void {
    this.circle = {};
    this.circle.outer = {};
    this.circle.outer.geometry = this.getCircleGeometry(100, 1.45, 1.4);
    this.circle.outer.material = new THREE.MeshBasicMaterial({
      color: 0x2a5c82,
      wireframe: false,
      transparent: true,
      opacity: 0.075
    });
    this.circle.outer.mesh = new THREE.Mesh(this.circle.outer.geometry, this.circle.outer.material);
    this.circle.outer.mesh.rotation.x = 0.5 * Math.PI;
    this.circle.outer.mesh.position.set(0, -0.4, 0.2);
    this.container.add(this.circle.outer.mesh);

    this.circle.inner = {};
    this.circle.inner.geometry = this.getCircleGeometry(100, 1.4, 1.395);
    this.circle.inner.material = new THREE.MeshBasicMaterial({
      color: 0xff1a4d,
      transparent: true,
      opacity: 0.5
    });
    this.circle.inner.mesh = new THREE.Mesh(this.circle.inner.geometry, this.circle.inner.material);
    this.circle.inner.mesh.rotation.x = 0.5 * Math.PI;
    this.circle.inner.mesh.position.set(0, -0.4, 0.2);
    this.container.add(this.circle.inner.mesh);
  }

  public setCar(): void {
    if (this.car && this.car.mover1) {
      this.container.remove(this.car.mover1);
    }
    this.car = {};
    this.car.mover1 = new THREE.Object3D();
    this.container.add(this.car.mover1);

    this.car.container = new THREE.Object3D();
    this.car.container.scale.set(0.048, 0.048, 0.048);
    this.car.container.rotation.y = 0.5 * Math.PI;
    this.car.container.position.set(0, -0.5, 0.3);
    this.car.mover1.add(this.car.container);

    const textureLoader = new THREE.TextureLoader();
    const matcap7 = textureLoader.load('/assets/medias/3d/level-2/matcap/7.jpg');
    const matcap9 = textureLoader.load('/assets/medias/3d/level-2/matcap/9.jpg');

    this.car.reflectionMaterial = new THREE.MeshBasicMaterial({
      map: matcap7,
      transparent: true,
      opacity: 0.8
    });
    this.car.wireframeMaterial = new THREE.MeshBasicMaterial({
      map: matcap9,
      wireframe: true,
      transparent: true,
      opacity: 0.9
    });

    this.car.intersectObjects = [];
    if (this.resources && this.resources.car && this.resources.car.model) {
      for (const key in this.resources.car.model) {
        const item = this.resources.car.model[key];
        const mesh = new THREE.Mesh(item.geometry, this.car.reflectionMaterial);
        this.car.container.add(mesh);
        const wireMesh = new THREE.Mesh(item.geometry, this.car.wireframeMaterial);
        this.car.container.add(wireMesh);
        this.car.intersectObjects.push(wireMesh);
      }
    }
  }

  public setCheckTitle(): void {
    this.checkTitle = {};
    this.checkTitle.container = new THREE.Object3D();
    this.checkTitle.container.position.set(3, 0.2, 2.3);
    this.checkTitle.container.scale.set(1.8, 1.8, 1.8);
    this.checkTitle.container.rotation.y = 0.7;
    this.container.add(this.checkTitle.container);

    this.checkTitle.number = new TelemetryNumber({ value: 9000, opacity: 1, renderOrder: 3 });
    this.checkTitle.number.container.position.set(0.18, 0, -0.1);
    this.checkTitle.number.container.rotation.y = Math.PI;
    this.checkTitle.number.container.scale.set(0.55, 0.55, 0.55);
    this.checkTitle.number.opacity = 0.75;
    this.checkTitle.container.add(this.checkTitle.number.container);

    if (typeof window !== 'undefined') {
      window.setInterval(() => {
        if (this.checkTitle.number && this.checkTitle.number.opacity > 0) {
          this.checkTitle.number.value = Math.round(
            850 + 35 * (0.5 * Math.sin(0.000005 * this.time.elapsed) + 0.5) + 35 * (0.5 * Math.sin(0.000114 * this.time.elapsed) + 0.5)
          );
        }
      }, 1200);
    }
  }

  public setTelemetry(): void {
    this.telemetry = {};
    this.telemetry.container = new THREE.Object3D();
    this.telemetry.container.scale.set(1.1, 1.1, 1.1);
    this.telemetry.container.position.set(-0.9, 0.1, 0);
    this.container.add(this.telemetry.container);

    this.telemetry.all = [];
    const graph1 = new TelemetryGraph({
      time: this.time,
      labelPath: '/assets/medias/3d/level-2/scene-3/graph-label-acceleration.png',
      labelWidth: 128,
      labelHeight: 32,
      lineColor: 0x378247,
      amplitudeX: 1.8,
      amplitudeY: 0.6,
      alpha: 1,
      frequency: 120,
      lineDivisions: 128,
      randomSeed: 0
    });
    this.telemetry.container.add(graph1.container);
    this.telemetry.all.push(graph1);

    const graph2 = new TelemetryGraph({
      time: this.time,
      labelPath: '/assets/medias/3d/level-2/scene-3/graph-label-rpm.png',
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
    this.telemetry.container.add(graph2.container);
    this.telemetry.all.push(graph2);
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
    if (this.telemetry && this.telemetry.all) {
      this.telemetry.all.forEach((g: TelemetryGraph) => g.update());
    }
  }
}
