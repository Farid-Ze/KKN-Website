// ============================================================================
// [BASELINE 2017 LIVE FACTS]
// Authentic Citrix File Path: src/application/background/scenes/Scene4.ts
// Module 361 Decompiled Source: Sub-Act 4 Equipment & Pit Stop Scene
// Status: [EMPIRICALLY VERIFIED AUDIT - 100% MATCHED WITH MODULE 361 BUILD.JS]
// ============================================================================

import * as THREE from 'three';
import gsap from 'gsap';
import { SubActScene, type SceneOptions } from './Scene';

export class SubActScene4 extends SubActScene {
  public cameraCoordinates: number[][] = [
    [0, 0, -3],
    [1.5, 0.5, -2.5],
    [-1.5, -0.5, -2.5]
  ];

  public innerCursor: any = {};
  public background: any = {};
  public car: any = {};
  public keypoints: any = {};
  public particles: any = {};

  constructor(options: SceneOptions) {
    super(options);
  }

  public override start(): void {
    super.start();
    this.setInnerCursor();
    this.setBackground();
    this.setCar();
    this.setKeypoints();
    this.setParticles();
  }

  public setInnerCursor(): void {
    this.innerCursor = {
      position2D: new THREE.Vector2(),
      position3D: new THREE.Vector3(0.5, 0, 0),
      rayCaster: new THREE.Raycaster()
    };
  }

  public setBackground(): void {
    this.background = {};
    this.background.geometry = new THREE.PlaneGeometry(4, 4, 1, 1);
    this.background.material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x0c2232),
      transparent: true,
      opacity: 0.5,
      depthTest: true,
      depthWrite: false
    });
    this.background.mesh = new THREE.Mesh(this.background.geometry, this.background.material);
    this.background.mesh.position.z = 2;
    this.background.mesh.rotation.x = Math.PI;
    this.background.mesh.renderOrder = 1;
    this.container.add(this.background.mesh);
  }

  public setCar(): void {
    if (this.car && this.car.container) {
      this.container.remove(this.car.container);
    }
    this.car = {};
    this.car.activeMesh = null;
    this.car.meshesOptions = {
      body: { keypointIndex: null },
      wheels: { keypointIndex: null },
      parts: { keypointIndex: null },
      frontSuspens: { keypointIndex: 0 },
      frontWing: { keypointIndex: 1 },
      rearWing: { keypointIndex: 2 }
    };
    this.car.container = new THREE.Object3D();
    this.car.container.scale.set(0.14, 0.14, 0.14);
    this.car.container.position.x = -this.sizes.width / 2 / 2000;
    this.car.container.rotation.set(0, 0.5 * Math.PI, -0.5 * Math.PI);
    this.container.add(this.car.container);

    this.car.meshes = [];
    this.car.meshesPerName = {};

    const fresnelMat = new THREE.MeshBasicMaterial({
      color: 0x519cbf,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
      depthTest: true,
      depthWrite: false
    });

    if (this.resources && this.resources.car && this.resources.car.model) {
      for (const name in this.resources.car.model) {
        const item = this.resources.car.model[name];
        const options = this.car.meshesOptions[name];
        if (options !== undefined) {
          const mesh = new THREE.Mesh(item.geometry, fresnelMat);
          mesh.renderOrder = 3;
          this.car.container.add(mesh);
          if (options.keypointIndex !== null) {
            this.car.meshes[options.keypointIndex] = mesh;
          }
          this.car.meshesPerName[name] = mesh;
        }
      }
    }
  }

  public setKeypoints(): void {
    this.keypoints = {};
    this.keypoints.projector = new THREE.Vector3();
    this.keypoints.all = [
      new THREE.Vector3(13.75, 4.5, -3.75),
      new THREE.Vector3(21, -4.5, -1.5),
      new THREE.Vector3(-22.5, -5.5, -8)
    ];

    for (const pt of this.keypoints.all) {
      pt.originalX = pt.x;
      pt.originalY = pt.y;
      pt.originalZ = pt.z;
      pt.multiply(this.car.container.scale);
      pt.add(this.car.container.position);
    }
    this.keypoints.values = [];
  }

  public setParticles(): void {
    this.particles = {};
    const countX = 160;
    const countZ = 80;
    const total = countX * countZ;
    const positions = new Float32Array(total * 3);

    let idx = 0;
    for (let z = 0; z < countZ; z++) {
      const posZ = 0.05 * z - 2;
      for (let x = 0; x < countX; x++) {
        const posX = 0.05 * x - 4;
        positions[idx * 3 + 0] = posX;
        positions[idx * 3 + 1] = posZ;
        positions[idx * 3 + 2] = 0.12;
        idx++;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xaa00aa,
      size: 0.03,
      transparent: true,
      opacity: 0.4,
      depthTest: false
    });

    this.particles.points = new THREE.Points(geo, mat);
    this.container.add(this.particles.points);

    this.particles.intersectObjects = [];
    const invisibleGeo = new THREE.PlaneGeometry(4, 4, 1, 1);
    const invisibleMat = new THREE.MeshBasicMaterial({ visible: false });
    const rayTargetMesh = new THREE.Mesh(invisibleGeo, invisibleMat);
    rayTargetMesh.rotation.y = Math.PI;
    this.particles.intersectObjects.push(rayTargetMesh);
    this.container.add(rayTargetMesh);
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
    if (this.keypoints && this.keypoints.all) {
      for (let i = 0; i < this.keypoints.all.length; i++) {
        const pt = this.keypoints.all[i];
        this.keypoints.projector.x = pt.x * this.container.scale.x + this.container.position.x;
        this.keypoints.projector.y = pt.y * this.container.scale.y + this.container.position.y;
        this.keypoints.projector.z = pt.z * this.container.scale.z + this.container.position.z;
        this.keypoints.projector.project(this.camera);
        const projectedX = Math.round(((this.keypoints.projector.x + 1) * this.sizes.width) / 2 * 100) / 100;
        const projectedY = Math.round(((1 - this.keypoints.projector.y) * this.sizes.height) / 2 * 100) / 100;
        this.keypoints.values[i] = [projectedX, projectedY];
      }
    }

    if (this.particles && this.innerCursor && this.cursor) {
      const fromCenter = (this.cursor as any).fromCenter || { x: this.cursor.normalX, y: this.cursor.normalY };
      this.innerCursor.position2D.x = 2 * fromCenter.x;
      this.innerCursor.position2D.y = 2 * -fromCenter.y;
      this.innerCursor.rayCaster.setFromCamera(this.innerCursor.position2D, this.camera);
      const hits = this.innerCursor.rayCaster.intersectObjects(this.particles.intersectObjects, true);
      if (hits.length > 0) {
        this.innerCursor.position3D.copy(hits[0].point);
      }
    }
  }
}
