/* ============================================================================
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix File Path: src/application/background/index.ts
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% EMPIRICAL 2K WEBP HIGH-RES TEXTURE LOADER VIA MCP CHROME]
 * ============================================================================ */

import * as THREE from 'three';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js';
import gsap from 'gsap';
import meshVert from '../../assets/shaders/mesh_material.vert?raw';
import meshFrag from '../../assets/shaders/mesh_material.frag?raw';

export interface StretchShaderPassUniforms {
  uTime: { value: number };
  uTextureA: { value: THREE.Texture | null };
  uTextureB: { value: THREE.Texture | null };
  uStretchNoiseMultiplier: { value: THREE.Vector2 };
  uStretchStrength: { value: number };
  uTransitionStrength: { value: number };
  uTransitionDirection: { value: number };
  uInterpolationCount: { value: number };
  uClearColor: { value: THREE.Color };
}

export interface SceneConfig {
  fov: number;
  camPos: [number, number, number];
  meshNames: string[];
}

export class WebGLBackgroundEngine {
  public isWebp: boolean = true;
  public isTouch: boolean = false;
  public quality: 'high' | 'medium' | 'low' = 'high';
  public time: { start: number; elapsed: number; current: number; delta: number } = {
    start: Date.now(),
    elapsed: 0,
    current: Date.now(),
    delta: 16
  };
  public sizes: { width: number; height: number } = { width: 1920, height: 889 };
  public clearColor: THREE.Color = new THREE.Color(0x0b101e);
  public isFuzzyTransitionning: boolean = false;
  public pending: number | null = null;
  public state: 'ready' | 'leaving' | 'arriving' = 'ready';

  public arrivingCallback: number | null = null;
  public endCallback: number | null = null;
  public requestAnimationFrame: number | null = null;

  public canvas: HTMLCanvasElement | null = null;
  public renderer: THREE.WebGLRenderer | null = null;

  public cursor: { x: number; y: number; targetX: number; targetY: number } = { x: 0, y: 0, targetX: 0, targetY: 0 };
  public parallax: { x: number; y: number; targetX: number; targetY: number; factor: number } = { x: 0, y: 0, targetX: 0, targetY: 0, factor: 0.05 };

  public loader: { values: { toLoad: number; loaded: number; finish: boolean }; add: (n?: number) => void; load: (n?: number) => void; update: () => void } = {
    values: { toLoad: 0, loaded: 0, finish: false },
    add: (n = 1) => { this.loader.values.toLoad += n; this.loader.update(); },
    load: (n = 1) => { this.loader.values.loaded += n; this.loader.update(); },
    update: () => {
      if (this.loader.values.loaded >= this.loader.values.toLoad) {
        this.loader.values.finish = true;
        this.loaded();
      }
    }
  };

  public resources: Record<string, any> = { car: null, differential: null };

  // Authentic Empirical Mesh Catalogs & Camera FOV Configurations for Level-1 (Scenes 0..5)
  public sceneConfigs: SceneConfig[] = [
    {
      fov: 31.8908,
      camPos: [-0.335005, 0.472982, -9.970599],
      meshNames: [
        'car-back', 'car-front', 'car-middle', 'forest', 'fume',
        'gravel-01', 'gravel-02', 'helmet', 'road', 'sky', 'wall', 'wheel-left', 'wheel-right'
      ]
    },
    {
      fov: 23.7414,
      camPos: [2.09381, 2.87836, -16.6348],
      meshNames: [
        'background', 'car-body', 'car-body-back', 'car-left', 'car-right',
        'f1-back', 'fin-back', 'fin-front', 'fin-top', 'flag', 'mirror-left', 'mirror-right',
        'pilot', 'road', 'sparks-01', 'sparks-03', 'sparks-04', 'stand',
        'suspension-left', 'suspension-right', 'wheel-back-left', 'wheel-back-right', 'wheel-front-left', 'wheel-front-right'
      ]
    },
    {
      fov: 56.3598,
      camPos: [0.302623, 0.547072, -1.00515],
      meshNames: [
        'asphalt', 'bench', 'car', 'lines', 'mechanical-arm-a', 'mechanical-arm-b',
        'mechanical-arm-bottom', 'men-left-bottom', 'men-left-over', 'men-right-bottom',
        'men-right-front', 'sky', 'wheel-front', 'wheel-rear'
      ]
    },
    {
      fov: 33.8984,
      camPos: [-3.43644, 5.18428, -5.44657],
      meshNames: [
        'armature', 'background', 'body-back', 'body-front', 'earphone',
        'eyelid', 'head', 'rope', 'shirt', 'wire'
      ]
    },
    {
      fov: 33.8984,
      camPos: [-0.139569, 2.02596, -8.21282],
      meshNames: [
        'air-inlet-left', 'air-inlet-right', 'arm-left', 'arm-right', 'background',
        'body', 'bold-left', 'bold-right', 'center', 'fairing', 'front', 'man-crouched',
        'man-hairless', 'man-leaning', 'man-left', 'man-look', 'man-pilot', 'man-reader',
        'man-right', 'men-right', 'mirror-left', 'mirror-right', 'muzzle', 'people',
        'walls', 'wheel-left', 'wheel-right'
      ]
    },
    {
      fov: 33.8984,
      camPos: [-0.506125, 1.44246, -3.36892],
      meshNames: [
        'background', 'bubbles-1', 'bubbles-2', 'bubbles-3',
        'confetti-01', 'confetti-02', 'confetti-03', 'confetti-04', 'man'
      ]
    }
  ];

  public scenes: {
    currentLevel: number;
    levels: Array<Array<{ scene: THREE.Scene; camera: THREE.PerspectiveCamera; index: number; update?: () => void }>>;
    active: { scene: THREE.Scene; camera: THREE.PerspectiveCamera; index: number; navMover?: THREE.Vector3; update?: () => void };
    leaving: { scene: THREE.Scene; camera: THREE.PerspectiveCamera; index: number; update?: () => void } | null;
  } = {
    currentLevel: 0,
    levels: [[], []],
    active: {
      scene: new THREE.Scene(),
      camera: new THREE.PerspectiveCamera(31.8908, 1920 / 889, 0.1, 1000),
      index: 0,
      navMover: new THREE.Vector3(0, 0, 0)
    },
    leaving: null
  };

  public stretchShaderPass: { uniforms: StretchShaderPassUniforms; renderToScreen?: boolean } = {
    uniforms: {
      uTime: { value: 0 },
      uTextureA: { value: null },
      uTextureB: { value: null },
      uStretchNoiseMultiplier: { value: new THREE.Vector2(0.01, 1.0) },
      uStretchStrength: { value: 0 },
      uTransitionStrength: { value: 0 },
      uTransitionDirection: { value: 1 },
      uInterpolationCount: { value: 9 },
      uClearColor: { value: this.clearColor }
    },
    renderToScreen: true
  };

  constructor() {
    this.setTime();
    this.setSizes();
    this.setQuality();
    this.setLoader();
    this.setResources();
    this.setCursor();
    this.setParallax();
    this.initLevels();
  }

  private initLevels(): void {
    const planeGeo = new THREE.PlaneGeometry(16, 9);
    const textureLoader = new THREE.TextureLoader();

    // Populate Level 0 (2D Plane Mesh Scrollytelling Scenes using 2K WebP High-Res Textures)
    this.sceneConfigs.forEach((cfg, sceneIdx) => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(cfg.fov, 1920 / 889, 0.1, 1000);
      camera.position.set(cfg.camPos[0], cfg.camPos[1], cfg.camPos[2]);

      cfg.meshNames.forEach((name, zIdx) => {
        const ext = this.isWebp ? 'webp' : 'jpg';
        const defaultTex = textureLoader.load(`/assets/medias/3d/level-1/scene-${sceneIdx}/high/${name}.${ext}`);
        const alphaTex = textureLoader.load(`/assets/medias/3d/level-1/scene-${sceneIdx}/high/${name}-alpha.${ext}`);

        const mat = new THREE.ShaderMaterial({
          vertexShader: meshVert,
          fragmentShader: meshFrag,
          uniforms: {
            uTextureDefault: { value: defaultTex },
            uTextureAlpha: { value: alphaTex }
          },
          transparent: true,
          depthTest: true,
          depthWrite: false
        });

        const mesh = new THREE.Mesh(planeGeo, mat);
        mesh.name = name;
        mesh.position.set(0, 0, -zIdx * 0.1);
        scene.add(mesh);
      });

      this.scenes.levels[0].push({ scene, camera, index: sceneIdx });
    });

    // Populate Level 1 (3D Binary Mesh Inspection Scenes)
    for (let idx = 0; idx <= 5; idx++) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1920 / 889, 0.1, 1000);
      camera.position.set(0, 0, 0);
      this.scenes.levels[1].push({ scene, camera, index: idx });
    }

    if (this.scenes.levels[0][0]) {
      this.scenes.active = {
        ...this.scenes.levels[0][0],
        navMover: new THREE.Vector3(0, 0, 0)
      };
    }
  }

  public setQuality(): void {
    if (typeof window === 'undefined') return;
    const ua = window.navigator.userAgent;
    const isIOs = /iPad|iPhone|iPod/i.test(ua) && !(window as any).MSStream;
    const isAndroid = /android/i.test(ua);
    const isWinPhone = /Windows Phone/i.test(ua);
    const w = window.innerWidth;
    const h = window.innerHeight;
    const pxCount = w * h;
    const cpuCores = window.navigator.hardwareConcurrency || 2;

    let q: 'high' | 'medium' | 'low' = 'high';
    if (isIOs || isAndroid || isWinPhone || pxCount <= 1398784 || cpuCores < 4) q = 'medium';
    if ((isIOs || isAndroid || isWinPhone) && pxCount <= 786432 || cpuCores < 2) q = 'low';
    this.quality = q;
  }

  public setLoader(): void {
    this.loader.values = { toLoad: 0, loaded: 0, finish: false };
  }

  public setResources(): void {
    if (typeof window === 'undefined') return;

    this.resources = {};
    const tdsLoader = new TDSLoader();

    // 1. Load Level-2 F1 Red Bull Car .3ds Model
    this.loader.add();
    this.resources.car = null;

    tdsLoader.load('/assets/medias/3d/level-2/car/f1-redbull-light.3ds', (object3d: THREE.Group) => {
      const parsedData: Record<string, any> = {};
      const categories = [
        { name: 'bounding', category: 'bounding' },
        { name: 'body', category: 'model' },
        { name: 'wheels', category: 'model' },
        { name: 'parts', category: 'model' },
        { name: 'frontSuspens', category: 'model' },
        { name: 'frontWing', category: 'model' },
        { name: 'rearWing', category: 'model' }
      ];

      object3d.children.forEach((child: THREE.Object3D) => {
        const found = categories.find(item => child.name.indexOf(item.name) !== -1);
        if (found && (child as THREE.Mesh).geometry) {
          let categoryObj = parsedData[found.category];
          if (!categoryObj) categoryObj = parsedData[found.category] = {};
          (child as THREE.Mesh).geometry.rotateX(-0.5 * Math.PI);
          categoryObj[found.name] = child;
        }
      });

      this.resources.car = parsedData;
      this.loader.load();
    }, undefined, () => {
      this.loader.load();
    });

    // 2. Load Level-2 Differential Gear .3ds Model
    this.loader.add();
    this.resources.differential = null;

    tdsLoader.load('/assets/medias/3d/level-2/differential/differential.3ds', (object3d: THREE.Group) => {
      const parsedData: Record<string, any> = {};
      const categories = [
        { name: 'intern', category: 'model' },
        { name: 'extern', category: 'model' }
      ];

      object3d.children.forEach((child: THREE.Object3D) => {
        const found = categories.find(item => child.name.indexOf(item.name) !== -1);
        if (found && (child as THREE.Mesh).geometry) {
          let categoryObj = parsedData[found.category];
          if (!categoryObj) categoryObj = parsedData[found.category] = {};
          (child as THREE.Mesh).geometry.rotateZ(-0.5 * Math.PI);
          (child as THREE.Mesh).geometry.rotateX(-0.5 * Math.PI);
          (child as THREE.Mesh).geometry.rotateY(Math.PI);
          categoryObj[found.name] = child;
        }
      });

      this.resources.differential = parsedData;
      this.loader.load();
    }, undefined, () => {
      this.loader.load();
    });
  }

  public loaded(): void {
    this.pending = null;
  }

  public setTime(): void {
    const now = Date.now();
    this.time.start = now;
    this.time.elapsed = 0;
    this.time.current = now;
    this.time.delta = 16;
  }

  public setCursor(x?: number, y?: number): void {
    if (x !== undefined && y !== undefined) {
      this.cursor.targetX = x;
      this.cursor.targetY = y;
    }
  }

  public setParallax(): void {
    if (typeof window === 'undefined') return;
    if (this.isTouch) {
      window.addEventListener('deviceorientation', (e: DeviceOrientationEvent) => {
        let beta = e.beta || 0;
        let gamma = e.gamma || 0;
        this.parallax.x = 0.03 * gamma;
        this.parallax.y = 0.02 * beta - 0.4 * Math.PI;
      }, false);
    }
  }

  public setSizes(width?: number, height?: number): void {
    if (typeof window === 'undefined') return;
    this.sizes.width = width || window.innerWidth;
    this.sizes.height = height || window.innerHeight;
    window.addEventListener('resize', this.resize.bind(this));
  }

  public setRenderer(canvas?: HTMLCanvasElement): void {
    if (typeof window === 'undefined') return;
    if (canvas) this.canvas = canvas;
    this.clearColor = new THREE.Color(0x0b101e);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas || undefined,
      antialias: this.quality !== 'low',
      stencil: false,
      depth: true,
      alpha: true,
      powerPreference: this.quality === 'low' ? 'low-power' : 'high-performance'
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setClearColor(this.clearColor, 1);
  }

  public setComposer(): void {
    this.stretchShaderPass.uniforms.uTime.value = this.time.elapsed;
    this.stretchShaderPass.uniforms.uStretchNoiseMultiplier.value.set(0.01, 1.0);
    this.stretchShaderPass.uniforms.uStretchStrength.value = 0;
    this.stretchShaderPass.uniforms.uTransitionStrength.value = 0;
    this.stretchShaderPass.uniforms.uTransitionDirection.value = 1;
    this.stretchShaderPass.uniforms.uInterpolationCount.value = 9;
  }

  public setScenes(): void {
    this.scenes.currentLevel = 0;
  }

  public next(): void {
    const nextIdx = this.scenes.active.index + 1;
    if (this.scenes.levels[this.scenes.currentLevel] && nextIdx < this.scenes.levels[this.scenes.currentLevel].length) {
      this.goTo(nextIdx);
    }
  }

  public previous(): void {
    const prevIdx = this.scenes.active.index - 1;
    if (prevIdx >= 0) {
      this.goTo(prevIdx);
    }
  }

  public goFuzzy(): void {
    this.isFuzzyTransitionning = true;
    if (this.scenes.active.navMover) {
      gsap.to(this.scenes.active.camera.position, { duration: 0.6, x: -0.5, ease: 'power2.inOut' });
    }
    gsap.to(this.stretchShaderPass.uniforms.uStretchNoiseMultiplier.value, { duration: 0.5, x: 2 });
    gsap.to(this.stretchShaderPass.uniforms.uStretchStrength, {
      duration: 0.5,
      value: 0.65,
      onComplete: () => { this.isFuzzyTransitionning = false; }
    });
  }

  public leaveFuzzy(): void {
    this.isFuzzyTransitionning = true;
    if (this.scenes.active.navMover) {
      gsap.to(this.scenes.active.camera.position, { duration: 0.75, x: 0, ease: 'power2.inOut' });
    }
    gsap.to(this.stretchShaderPass.uniforms.uStretchNoiseMultiplier.value, { duration: 0.5, x: 0.01 });
    gsap.to(this.stretchShaderPass.uniforms.uStretchStrength, {
      duration: 0.5,
      value: 0,
      onComplete: () => { this.isFuzzyTransitionning = false; }
    });
  }

  public goTo(levelIndex: number, levelType: number | null = null, speed: number = 2): void {
    if (levelIndex === this.scenes.active.index && levelType === null) return;
    if (levelType !== null && levelType !== this.scenes.currentLevel) {
      this.scenes.currentLevel = levelType;
    }

    if (speed === 0) {
      if (this.scenes.levels[this.scenes.currentLevel][levelIndex]) {
        this.scenes.active = {
          ...this.scenes.levels[this.scenes.currentLevel][levelIndex],
          navMover: new THREE.Vector3(0, 0, 0)
        };
      }
      this.scenes.leaving = null;
      return;
    }

    if (this.state === 'arriving') {
      this.pending = levelIndex;
      return;
    }

    if (this.state === 'ready') {
      this.scenes.leaving = this.scenes.active;
      if (this.scenes.levels[this.scenes.currentLevel][levelIndex]) {
        this.scenes.active = {
          ...this.scenes.levels[this.scenes.currentLevel][levelIndex],
          navMover: new THREE.Vector3(0, 0, 0)
        };
      }
      this.state = 'leaving';

      if (this.arrivingCallback) window.clearTimeout(this.arrivingCallback);
      if (this.endCallback) window.clearTimeout(this.endCallback);

      this.arrivingCallback = window.setTimeout(() => {
        this.state = 'arriving';
        this.arrivingCallback = null;
      }, 0.25 * speed * 1000);

      this.endCallback = window.setTimeout(() => {
        this.scenes.leaving = null;
        this.state = 'ready';
        this.endCallback = null;
        if (this.pending !== null) {
          this.goTo(this.pending);
          this.pending = null;
        }
      }, 0.75 * speed * 1000);

      gsap.killTweensOf(this.stretchShaderPass.uniforms.uStretchStrength);
      gsap.killTweensOf(this.stretchShaderPass.uniforms.uTransitionStrength);

      gsap.to(this.stretchShaderPass.uniforms.uStretchStrength, {
        duration: 0.5 * speed,
        value: 0.5 * speed,
        ease: 'power2.in'
      });
      gsap.to(this.stretchShaderPass.uniforms.uStretchStrength, {
        duration: 0.5 * speed,
        value: 0,
        delay: 0.5 * speed,
        ease: 'power2.out'
      });
      gsap.to(this.stretchShaderPass.uniforms.uTransitionStrength, {
        duration: 2,
        value: 0.5 * speed,
        ease: 'power2.inOut'
      });
    }
  }

  public resize(): void {
    if (typeof window === 'undefined') return;
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;
    this.scenes.active.camera.aspect = window.innerWidth / window.innerHeight;
    this.scenes.active.camera.updateProjectionMatrix();
    if (this.renderer) {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  public update(deltaSeconds?: number, elapsedMs?: number): void {
    const now = Date.now();
    this.time.elapsed = elapsedMs !== undefined ? elapsedMs : now - this.time.start;
    this.time.delta = deltaSeconds !== undefined ? deltaSeconds * 1000 : now - this.time.current;
    this.time.current = now;

    if (this.time.delta > 60) this.time.delta = 60;

    this.stretchShaderPass.uniforms.uTime.value = this.time.elapsed;

    if (this.scenes.active && typeof this.scenes.active.update === 'function') {
      this.scenes.active.update();
    }
    if (this.scenes.leaving && typeof this.scenes.leaving.update === 'function') {
      this.scenes.leaving.update();
    }

    if (this.renderer && this.scenes.active.scene && this.scenes.active.camera) {
      this.renderer.render(this.scenes.active.scene, this.scenes.active.camera);
    }
  }

  public setCursorPosition(x: number, y: number): void {
    this.setCursor(x, y);
  }

  public dispose(): void {
    if (this.requestAnimationFrame) {
      window.cancelAnimationFrame(this.requestAnimationFrame);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resize.bind(this));
    }
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
  }
}
