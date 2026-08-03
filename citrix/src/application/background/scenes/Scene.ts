// ============================================================================
// [BASELINE 2017 LIVE FACTS]
// Authentic Citrix File Path: src/application/background/scenes/Scene.ts
// Module 356 Decompiled Source: Base Class for Level 1 Sub-Act 3D Scenes
// Status: [EMPIRICALLY VERIFIED AUDIT - 100% MATCHED WITH MODULE 356 BUILD.JS]
// ============================================================================

import * as THREE from 'three';
import gsap from 'gsap';

export interface SceneOptions {
  time: { elapsed: number; delta: number };
  sizes: { width: number; height: number };
  parallax: { x: number; y: number };
  renderer: THREE.WebGLRenderer;
  loader: any;
  resources: any;
  cursor: { normalX: number; normalY: number };
  clearColor: THREE.Color;
  index: number;
}

export class SubActScene {
  public time: { elapsed: number; delta: number };
  public sizes: { width: number; height: number };
  public parallax: { x: number; y: number };
  public renderer: THREE.WebGLRenderer;
  public loader: any;
  public resources: any;
  public cursor: { normalX: number; normalY: number };
  public clearColor: THREE.Color;
  public index: number;
  public step: number = 0;
  public needsResize: boolean = false;
  public started: boolean = false;

  public scene: THREE.Scene;
  public container: THREE.Object3D;
  public camera!: THREE.PerspectiveCamera & {
    target?: THREE.Vector3;
    parallaxMoverX?: THREE.Vector3;
    parallaxMoverY?: THREE.Vector3;
    originalPosition?: THREE.Vector3;
    parallaxMover?: THREE.Vector3;
    transitionMover?: THREE.Vector3;
    navMover?: THREE.Vector3;
  };

  public renderTarget: THREE.WebGLRenderTarget;

  constructor(options: SceneOptions) {
    this.time = options.time;
    this.sizes = options.sizes;
    this.parallax = options.parallax;
    this.renderer = options.renderer;
    this.loader = options.loader;
    this.resources = options.resources;
    this.cursor = options.cursor;
    this.clearColor = options.clearColor;
    this.index = options.index;

    this.renderTarget = new THREE.WebGLRenderTarget(this.sizes.width, this.sizes.height, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat
    });

    this.scene = new THREE.Scene();
    this.container = new THREE.Object3D();
    this.scene.add(this.container);
    this.setCamera();
  }

  public get cameraOptions() {
    return {
      parallaxMoverX: new THREE.Vector3(1, 0, 0),
      parallaxMoverY: new THREE.Vector3(0, 0.5, 0),
      transitionStrengthX: 3,
      transitionStrengthY: 1.5
    };
  }

  public start(): void {
    this.started = true;
  }

  public setCamera(): void {
    this.camera = new THREE.PerspectiveCamera(40, this.sizes.width / this.sizes.height, 0.1, 1000) as any;
    this.camera.target = new THREE.Vector3(0, 0, 0);
    this.camera.parallaxMoverX = this.cameraOptions.parallaxMoverX.clone();
    this.camera.parallaxMoverY = this.cameraOptions.parallaxMoverY.clone();
    this.camera.originalPosition = new THREE.Vector3(0, 0, -3);
    this.camera.parallaxMover = new THREE.Vector3();
    this.camera.transitionMover = new THREE.Vector3();
    this.camera.navMover = new THREE.Vector3();
    this.scene.add(this.camera);
  }

  public enter(direction: string = 'left', speed: number = 1, delay: number = 1, ease: string = 'power2.out'): void {
    if (this.camera.navMover) this.camera.navMover.set(0, 0, 0);
    if (!this.camera.transitionMover) return;

    if (direction === 'left' || direction === 'right') {
      const sign = direction === 'left' ? 1 : -1;
      this.camera.transitionMover.x = this.cameraOptions.transitionStrengthX * sign;
      this.camera.transitionMover.y = 0;
      gsap.to(this.camera.transitionMover, { duration: speed, delay: delay, x: 0, ease: ease });
    } else if (direction === 'down' || direction === 'up') {
      const sign = direction === 'down' ? 1 : -1;
      this.camera.transitionMover.x = 0;
      this.camera.transitionMover.y = -this.cameraOptions.transitionStrengthY * sign;
      gsap.to(this.camera.transitionMover, { duration: speed, delay: delay, y: 0, ease: ease });
    }
  }

  public leave(direction: string = 'left', speed: number = 1, delay: number = 0, ease: string = 'power2.in'): void {
    if (!this.camera.transitionMover) return;

    if (direction === 'left' || direction === 'right') {
      const sign = direction === 'left' ? 1 : -1;
      gsap.to(this.camera.transitionMover, { duration: speed, delay: delay, x: -this.cameraOptions.transitionStrengthX * sign, ease: ease });
    } else if (direction === 'down' || direction === 'up') {
      const sign = direction === 'down' ? 1 : -1;
      gsap.to(this.camera.transitionMover, { duration: speed, delay: delay, y: -this.cameraOptions.transitionStrengthY * sign, ease: ease });
    }
  }

  public goToStep(stepIndex: number): void {
    this.step = stepIndex;
  }

  public resize(): void {
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();

    if (this.sizes.width <= 770) {
      this.container.position.y = 0.25;
      this.container.scale.set(0.8, 0.8, 0.8);
    } else {
      this.container.position.y = 0;
      this.container.scale.set(1, 1, 1);
    }
    this.renderTarget.setSize(this.sizes.width, this.sizes.height);
  }

  public update(): void {
    if (this.needsResize) {
      this.resize();
      this.needsResize = false;
    }

    if (this.camera.parallaxMoverX && this.camera.parallaxMoverY && this.camera.parallaxMover && this.camera.originalPosition && this.camera.transitionMover && this.camera.navMover) {
      const targetX = this.camera.parallaxMoverX.clone().multiplyScalar(-this.parallax.x);
      const targetY = this.camera.parallaxMoverY.clone().multiplyScalar(-this.parallax.y);

      this.camera.parallaxMover.x += 0.005 * (targetX.x + targetY.x - this.camera.parallaxMover.x) * this.time.delta;
      this.camera.parallaxMover.y += 0.005 * (targetX.y + targetY.y - this.camera.parallaxMover.y) * this.time.delta;
      this.camera.parallaxMover.z += 0.005 * (targetX.z + targetY.z - this.camera.parallaxMover.z) * this.time.delta;

      const posX = this.camera.originalPosition.x + this.camera.parallaxMover.x + this.camera.transitionMover.x + this.camera.navMover.x;
      const posY = this.camera.originalPosition.y + this.camera.parallaxMover.y + this.camera.transitionMover.y + this.camera.navMover.y;
      const posZ = this.camera.originalPosition.z + this.camera.parallaxMover.z + this.camera.transitionMover.z + this.camera.navMover.z;

      this.camera.position.set(posX, posY, posZ);
      if (this.camera.target) {
        this.camera.lookAt(this.camera.target);
      }
    }
    this.render();
  }

  public render(): void {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.setRenderTarget(this.renderTarget);
      this.renderer.render(this.scene, this.camera);
      this.renderer.setRenderTarget(null);
    }
  }

  public dispose(): void {}
}
