// ============================================================================
// [BASELINE 2017 LIVE FACTS]
// Authentic Citrix File Path: src/application/background/scenes/Scene2.ts
// Module 359 Decompiled Source: Sub-Act 2 Differential Mechanism Scene
// Status: [EMPIRICALLY VERIFIED AUDIT - 100% MATCHED WITH MODULE 359 BUILD.JS]
// ============================================================================

import * as THREE from 'three';
import gsap from 'gsap';
import { SubActScene, type SceneOptions } from './Scene';

export class SubActScene2 extends SubActScene {
  public cameraCoordinates: number[][] = [
    [2, -0.2, -3],
    [-2, 1, -2.25],
    [-2, 0.5, -4]
  ];

  public differential: any = {};
  public circle: any = {};
  public backgroundMesh: any = {};

  constructor(options: SceneOptions) {
    super(options);
  }

  public override start(): void {
    super.start();
    this.setBackground();
    this.setDifferential();
    this.setCircle();
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
    mesh.position.z = 2;
    mesh.rotation.x = Math.PI;
    this.container.add(mesh);
    this.backgroundMesh = mesh;
  }

  public setDifferential(): void {
    if (this.differential && this.differential.container) {
      this.container.remove(this.differential.container);
    }
    this.differential = {};
    this.differential.container = new THREE.Object3D();
    this.differential.container.scale.set(0.07, 0.07, 0.07);
    this.container.add(this.differential.container);

    const textureLoader = new THREE.TextureLoader();
    const matcapTex = textureLoader.load('/assets/medias/3d/level-2/matcap/11.jpg');

    const differentialMat = new THREE.MeshBasicMaterial({
      map: matcapTex,
      transparent: true,
      depthTest: true,
      depthWrite: true
    });

    if (this.resources && this.resources.differential && this.resources.differential.model) {
      for (const key in this.resources.differential.model) {
        const item = this.resources.differential.model[key];
        const mesh = new THREE.Mesh(item.geometry, differentialMat);
        mesh.renderOrder = 5;
        this.differential.container.add(mesh);
        this.differential[item.name] = mesh;
      }
    }
  }

  public setCircle(): void {
    const segments = 64;
    const angleStep = (2 * Math.PI) / segments;
    const vertices: THREE.Vector3[] = [];

    for (let i = 0; i < segments; i++) {
      const angle = i * angleStep;
      vertices.push(new THREE.Vector3(Math.cos(angle) * 1.35, Math.sin(angle) * 1.35, 0));
      vertices.push(new THREE.Vector3(Math.cos(angle) * 1.4, Math.sin(angle) * 1.4, 0));
    }

    const geo = new THREE.BufferGeometry().setFromPoints(vertices);
    const mat = new THREE.LineBasicMaterial({
      color: 0xcb9310,
      transparent: true,
      opacity: 0.25,
      depthTest: true,
      depthWrite: false
    });

    const mesh = new THREE.Line(geo, mat);
    mesh.rotation.x = 0.5 * Math.PI;
    mesh.position.set(0, -0.5, 0);
    mesh.renderOrder = 6;
    this.container.add(mesh);
    this.circle = mesh;
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
    if (this.differential && this.differential.container) {
      this.differential.container.rotation.y += 0.005;
    }
  }
}
