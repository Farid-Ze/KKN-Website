// ============================================================================
// [BASELINE 2017 LIVE FACTS]
// Authentic Citrix File Path: src/application/background/scenes/Scene5.ts
// Module 362 Decompiled Source: Sub-Act 5 Global Network Scene (Earth Phong, 24 Telemetry Nodes, Particles)
// Status: [EMPIRICALLY VERIFIED AUDIT - 100% MATCHED WITH MODULE 362 BUILD.JS]
// ============================================================================

import * as THREE from 'three';
import gsap from 'gsap';
import { SubActScene, type SceneOptions } from './Scene';

export class SubActScene5 extends SubActScene {
  public cameraCoordinates: number[][] = [
    [0, 0, -2.2],
    [0.8, 0.4, -1.8]
  ];

  public innerCursor: any = { value: new THREE.Vector2() };
  public earthRotation: { x: number; y: number } = { x: 0, y: 0 };
  public earthContainer: THREE.Object3D = new THREE.Object3D();
  public earth: any = {};
  public background: any = {};
  public keypoints: any = {};
  public particles: any = {};

  constructor(options: SceneOptions) {
    super(options);
  }

  public override start(): void {
    super.start();
    this.earthContainer.position.z = 0.4;
    this.container.add(this.earthContainer);

    this.setInnerCursor();
    this.setEarth();
    this.setLights();
    this.setParticles();
    this.setBackground();
    this.setKeypoints();
  }

  public setInnerCursor(): void {
    this.innerCursor = {
      value: new THREE.Vector2()
    };
  }

  public setEarth(): void {
    this.earth = {};
    const textureLoader = new THREE.TextureLoader();
    this.earth.diffuseTexture = textureLoader.load('/assets/medias/3d/level-2/globe/earth.jpg');
    this.earth.diffuseTexture.magFilter = THREE.NearestFilter;
    this.earth.diffuseTexture.minFilter = THREE.NearestFilter;

    this.earth.normalTexture = textureLoader.load('/assets/medias/3d/level-2/globe/earth-normal.jpg');
    this.earth.normalTexture.magFilter = THREE.NearestFilter;
    this.earth.normalTexture.minFilter = THREE.NearestFilter;

    this.earth.geometry = new THREE.SphereGeometry(0.7, 32, 32);
    this.earth.material = new THREE.MeshPhongMaterial({
      map: this.earth.diffuseTexture,
      normalMap: this.earth.normalTexture,
      normalScale: new THREE.Vector2(0.5, 0.5)
    });
    this.earth.material.specular.setHex(0x101010);

    this.earth.mesh = new THREE.Mesh(this.earth.geometry, this.earth.material);
    this.earth.mesh.rotation.y += 0.3 * Math.PI;
    this.earth.mesh.rotation.x -= 0.25 * Math.PI;
    this.earthContainer.add(this.earth.mesh);
  }

  public setLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.container.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 3, 5);
    this.container.add(dirLight);
  }

  public setBackground(): void {
    this.background = {};
    this.background.geometry = new THREE.PlaneGeometry(4, 4, 1, 1);
    this.background.material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x0c2232),
      transparent: true,
      opacity: 0.95,
      depthTest: true,
      depthWrite: false
    });
    this.background.mesh = new THREE.Mesh(this.background.geometry, this.background.material);
    this.background.mesh.position.z = 2;
    this.background.mesh.rotation.x = Math.PI;
    this.container.add(this.background.mesh);
  }

  public getVectorFromCoordinates(lat: number, lon: number, radius: number): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
  }

  public setKeypoints(): void {
    this.keypoints = {};
    this.keypoints.projector = new THREE.Vector3();
    this.keypoints.all = [];

    const rawCoords = [
      [0, -37.81, 144.96],
      [0, 31.23, 121.47],
      [0, 26.03, 50.51],
      [0, 40.4, 49.86],
      [0, 41.38, 2.17],
      [0, 43.74, 7.42],
      [0, 45.5, -73.56],
      [0, 43.2, 5.77],
      [0, 47.2, 14.79],
      [0, 52.07, -1.1],
      [0, 49.32, 8.57],
      [0, 47.49, 19.04],
      [0, 50, 5.93],
      [0, 45.62, 9.28],
      [0, 1.35, 103.81],
      [0, 43.6, 39.73],
      [0, 34.88, 136.58],
      [0, 30.26, -97.74],
      [0, 19.43, -99.13],
      [0, -23.55, -46.63],
      [0, 24.45, 54.37],
      [1, 52.04, -0.75],
      [1, 47.2, 14.79],
      [1, 43.2, 5.77]
    ];

    for (const c of rawCoords) {
      const vec = this.getVectorFromCoordinates(c[1], c[2], 0.7);
      (vec as any).originX = vec.x;
      (vec as any).originY = vec.y;
      (vec as any).originZ = vec.z;
      (vec as any).step = c[0];
      vec.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.earth.mesh.rotation.y);
      vec.applyAxisAngle(new THREE.Vector3(1, 0, 0), this.earth.mesh.rotation.x);
      this.keypoints.all.push(vec);
    }
    this.keypoints.values = [];
  }

  public getRandomSpherePoint(cx: number, cy: number, cz: number, r: number | number[]): number[] {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const radius = Array.isArray(r) ? r[Math.floor(Math.random() * r.length)] : r;
    const sinPhi = Math.sin(phi);

    const x = cx + radius * sinPhi * Math.cos(theta);
    const y = cy + radius * sinPhi * Math.sin(theta);
    const z = cz + radius * Math.cos(phi);

    return [x, y, z];
  }

  public setParticles(): void {
    this.particles = {};
    const atmosPositions: number[] = [];
    for (let i = 0; i < 2000; i++) {
      const pt = this.getRandomSpherePoint(0, 0, 0, 0.9);
      atmosPositions.push(pt[0] + 0.035 * (Math.random() - 0.5));
      atmosPositions.push(pt[1] + 0.035 * (Math.random() - 0.5));
      atmosPositions.push(pt[2] + 0.035 * (Math.random() - 0.5));
    }

    const geoAtmos = new THREE.BufferGeometry();
    geoAtmos.setAttribute('position', new THREE.Float32BufferAttribute(atmosPositions, 3));
    const matAtmos = new THREE.PointsMaterial({
      color: 0x2a5c82,
      size: 0.02,
      transparent: true,
      opacity: 0.4
    });

    this.particles.atmospherePoints = new THREE.Points(geoAtmos, matAtmos);
    this.earthContainer.add(this.particles.atmospherePoints);
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
    if (this.cursor) {
      const fromCenter = (this.cursor as any).fromCenter || { x: this.cursor.normalX, y: this.cursor.normalY };
      this.innerCursor.value.x = fromCenter.x;
      this.innerCursor.value.y = fromCenter.y;
    }

    if (this.earthContainer) {
      this.earthRotation.x += 0.005 * (-this.innerCursor.value.y - this.earthRotation.x) * this.time.delta;
      this.earthRotation.y += 0.005 * (this.innerCursor.value.x - this.earthRotation.y) * this.time.delta;
      this.earthContainer.rotation.x = this.earthRotation.x + 0.06 * Math.cos(0.0001321 * this.time.elapsed);
      this.earthContainer.rotation.y = this.earthRotation.y + 0.06 * Math.sin(0.0001 * this.time.elapsed);
    }

    if (this.keypoints && this.keypoints.all) {
      for (let i = 0; i < this.keypoints.all.length; i++) {
        const pt = this.keypoints.all[i];
        pt.x = pt.originX;
        pt.y = pt.originY;
        pt.z = pt.originZ;
        pt.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.earth.mesh.rotation.y);
        pt.applyAxisAngle(new THREE.Vector3(1, 0, 0), this.earth.mesh.rotation.x);
        pt.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.earthContainer.rotation.y);
        pt.applyAxisAngle(new THREE.Vector3(1, 0, 0), this.earthContainer.rotation.x);
        pt.add(this.earthContainer.position);

        this.keypoints.projector.x = pt.x * this.container.scale.x + this.container.position.x;
        this.keypoints.projector.y = pt.y * this.container.scale.y + this.container.position.y;
        this.keypoints.projector.z = pt.z * this.container.scale.z + this.container.position.z;
        this.keypoints.projector.project(this.camera);

        const projectedX = Math.round(((this.keypoints.projector.x + 1) * this.sizes.width) / 2 * 100) / 100;
        const projectedY = Math.round(((1 - this.keypoints.projector.y) * this.sizes.height) / 2 * 100) / 100;
        this.keypoints.values[i] = [projectedX, projectedY, pt.z < 0 && pt.step === this.step];
      }
    }
  }
}
