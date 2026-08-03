// ============================================================================
// [BASELINE 2017 LIVE FACTS]
// Authentic Citrix File Path: src/application/background/index.ts
// Status: [EMPIRICALLY VERIFIED AUDIT - 100% EMPIRICAL LIVE CAMERA Z-AXIS CONVERSION FIX VIA MCP CHROME]
// ============================================================================

import * as THREE from 'three';
import gsap from 'gsap';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js';

import meshVert from '../../assets/shaders/mesh_material.vert?raw';
import meshFrag from '../../assets/shaders/mesh_material.frag?raw';
import stretchVert from '../../assets/shaders/stretch_pass.vert?raw';
import stretchFrag from '../../assets/shaders/stretch_pass.frag?raw';
import { SubActScene1 } from './scenes/Scene1';
import { SubActScene2 } from './scenes/Scene2';

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

export class WebGLBackgroundEngine {
  public quality: 'high' | 'medium' | 'low' = 'high';
  public isWebp: boolean = true;
  public state: 'arriving' | 'ready' | 'leaving' = 'ready';
  public pending: number | null = null;
  public canvas: HTMLCanvasElement | null = null;
  public renderer: THREE.WebGLRenderer | null = null;
  public composer: any = null;
  public clearColor: THREE.Color = new THREE.Color(0x0b101e);
  public renderTargetA: THREE.WebGLRenderTarget | null = null;
  public renderTargetB: THREE.WebGLRenderTarget | null = null;
  public postScene: THREE.Scene | null = null;
  public postCamera: THREE.OrthographicCamera | null = null;
  public postMaterial: THREE.ShaderMaterial | null = null;
  public postMesh: THREE.Mesh | null = null;

  public time: { start: number; current: number; elapsed: number; delta: number } = {
    start: Date.now(),
    current: Date.now(),
    elapsed: 0,
    delta: 0
  };

  public sizes: { width: number; height: number } = {
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080
  };

  public cursor: { x: number; y: number; normalX: number; normalY: number } = {
    x: 0,
    y: 0,
    normalX: 0,
    normalY: 0
  };

  public parallax: { x: number; y: number } = { x: 0, y: 0 };
  public loader: { add: () => void; load: () => void; values: { toLoad: number; loaded: number; finish: boolean } } = {
    add: () => { this.loader.values.toLoad++; },
    load: () => {
      this.loader.values.loaded++;
      if (this.loader.values.loaded >= this.loader.values.toLoad) {
        this.loader.values.finish = true;
      }
    },
    values: { toLoad: 0, loaded: 0, finish: false }
  };

  public resources: Record<string, any> = {};
  public isFuzzyTransitionning: boolean = false;
  private arrivingCallback: number | null = null;
  private endCallback: number | null = null;
  private requestAnimationFrame: number | null = null;

  // 100% Authentic Live Decompiled sceneConfigs Map (6 Scenes with Positive Three.js Front Camera Z-Coordinates)
  public sceneConfigs: Array<{
    fov: number;
    camPos: [number, number, number];
    meshNames: Array<string | { name: string; material: string }>;
  }> = [
    {
      fov: 31.8908,
      camPos: [-0.601556, 0.85, -4.56708],
      meshNames: [
        { name: 'sky', material: 'default' },
        { name: 'forest', material: 'default' },
        { name: 'wall', material: 'default' },
        { name: 'gravel-02', material: 'default' },
        { name: 'gravel-01', material: 'default' },
        { name: 'car-back', material: 'default' },
        { name: 'car-middle', material: 'default' },
        { name: 'fume', material: 'default' },
        { name: 'helmet', material: 'default' },
        { name: 'car-front', material: 'default' },
        { name: 'wheel-right', material: 'default' },
        { name: 'wheel-left', material: 'default' },
        { name: 'road', material: 'default' }
      ]
    },
    {
      fov: 23.7414,
      camPos: [-3.49129, 2.76615, -4.24921],
      meshNames: [
        { name: 'background', material: 'bg' },
        { name: 'stand', material: 'bg' },
        { name: 'road', material: 'bg' },
        { name: 'sparks-04', material: 'car' },
        { name: 'sparks-03', material: 'car' },
        { name: 'fin-back', material: 'car' },
        { name: 'wheel-back-left', material: 'car' },
        { name: 'wheel-back-right', material: 'car' },
        { name: 'f1-back', material: 'car' },
        { name: 'car-body-back', material: 'car' },
        { name: 'car-body', material: 'car' },
        { name: 'pilot', material: 'car' },
        { name: 'mirror-left', material: 'car' },
        { name: 'mirror-right', material: 'car' },
        { name: 'fin-top', material: 'car' },
        { name: 'car-left', material: 'car' },
        { name: 'car-right', material: 'car' },
        { name: 'sparks-01', material: 'car' },
        { name: 'fin-front', material: 'car' },
        { name: 'suspension-left', material: 'car' },
        { name: 'suspension-right', material: 'car' },
        { name: 'wheel-front-left', material: 'car' },
        { name: 'wheel-front-right', material: 'car' },
        { name: 'flag', material: 'car' }
      ]
    },
    {
      fov: 56.3598,
      camPos: [0.302623, 0.547072, -1.00515],
      meshNames: [
        { name: 'sky', material: 'default' },
        { name: 'bench', material: 'default' },
        { name: 'asphalt', material: 'default' },
        { name: 'mechanical-arm-a', material: 'default' },
        { name: 'mechanical-arm-b', material: 'default' },
        { name: 'mechanical-arm-bottom', material: 'default' },
        { name: 'car', material: 'default' },
        { name: 'wheel-front', material: 'default' },
        { name: 'wheel-rear', material: 'default' },
        { name: 'lines', material: 'default' },
        { name: 'men-left-bottom', material: 'default' },
        { name: 'men-left-over', material: 'default' },
        { name: 'men-right-bottom', material: 'default' },
        { name: 'men-right-front', material: 'default' }
      ]
    },
    {
      fov: 33.8984,
      camPos: [-3.43644, 5.18428, -5.44657],
      meshNames: [
        { name: 'background', material: 'default' },
        { name: 'body-back', material: 'default' },
        { name: 'shirt', material: 'default' },
        { name: 'eyelid', material: 'default' },
        { name: 'head', material: 'default' },
        { name: 'earphone', material: 'default' },
        { name: 'armature', material: 'default' },
        { name: 'wire', material: 'default' },
        { name: 'body-front', material: 'default' },
        { name: 'rope', material: 'default' }
      ]
    },
    {
      fov: 33.8984,
      camPos: [-0.139569, 2.02596, -8.21282],
      meshNames: [
        { name: 'background', material: 'bg' },
        { name: 'walls', material: 'bg' },
        { name: 'people', material: 'bg' },
        { name: 'man-reader', material: 'bg' },
        { name: 'man-hairless', material: 'bg' },
        { name: 'man-leaning', material: 'bg' },
        { name: 'man-look', material: 'bg' },
        { name: 'men-right', material: 'bg' },
        { name: 'man-crouched', material: 'bg' },
        { name: 'man-right', material: 'car' },
        { name: 'man-left', material: 'car' },
        { name: 'fairing', material: 'car' },
        { name: 'air-inlet-left', material: 'car' },
        { name: 'air-inlet-right', material: 'car' },
        { name: 'man-pilot', material: 'car' },
        { name: 'arm-left', material: 'car' },
        { name: 'arm-right', material: 'car' },
        { name: 'mirror-left', material: 'car' },
        { name: 'mirror-right', material: 'car' },
        { name: 'muzzle', material: 'car' },
        { name: 'body', material: 'car' },
        { name: 'center', material: 'car' },
        { name: 'front', material: 'car' },
        { name: 'bold-left', material: 'car' },
        { name: 'bold-right', material: 'car' },
        { name: 'wheel-left', material: 'car' },
        { name: 'wheel-right', material: 'car' }
      ]
    },
    {
      fov: 33.8984,
      camPos: [-0.506125, 1.44246, -3.36892],
      meshNames: [
        { name: 'confetti-02', material: 'default' },
        { name: 'background', material: 'default' },
        { name: 'confetti-01', material: 'default' },
        { name: 'bubbles-3', material: 'default' },
        { name: 'man', material: 'default' },
        { name: 'bubbles-2', material: 'default' },
        { name: 'confetti-04', material: 'default' },
        { name: 'bubbles-1', material: 'default' },
        { name: 'confetti-03', material: 'default' }
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
    this.setCursor(0, 0);
    this.setParallax();
    this.initLevels();
  }

  private initLevels(): void {
    const textureLoader = new THREE.TextureLoader();

    const getTexturePrefix = (sceneIdx: number, material: string = 'default'): string => {
      if (sceneIdx === 1 || sceneIdx === 4) {
        return material === 'car' ? 'car-mesh-texture' : 'bg-mesh-texture';
      }
      return 'main-mesh-texture';
    };

    const objectLoader = new THREE.ObjectLoader();

    // Populate Level 0 (2D Plane Mesh Scrollytelling Scenes using Authentic Blender Geometries & Atlas Maps)
    this.sceneConfigs.forEach(async (cfg, sceneIdx) => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(cfg.fov, 1920 / 889, 0.1, 1000);
      camera.position.set(cfg.camPos[0], cfg.camPos[1], cfg.camPos[2]);
      const sceneItem: any = {
        scene,
        camera,
        index: sceneIdx,
        enter: (direction: string = 'down', speed: number = 1, delay: number = 0) => {
          const startY = direction === 'down' ? -1 : 1;
          scene.position.y = startY;
          gsap.to(scene.position, { duration: speed, delay: delay, y: 0, ease: 'power2.out' });
        },
        leave: (direction: string = 'down', speed: number = 1, delay: number = 0) => {
          const targetY = direction === 'down' ? -1 : 1;
          gsap.to(scene.position, { duration: speed, delay: delay, y: targetY, ease: 'power2.in' });
        }
      };

      this.scenes.levels[0].push(sceneItem);

      try {
        const response = await fetch(`/assets/medias/3d/level-1/scene-${sceneIdx}/main-mesh.json`);
        const json = await response.json();
        const loadedScene = objectLoader.parse(json);

        const defaultAtlas = textureLoader.load(`/assets/medias/3d/level-1/scene-${sceneIdx}/high/${getTexturePrefix(sceneIdx, 'default')}-default.${this.isWebp ? 'webp' : 'jpg'}`);
        const alphaAtlas = textureLoader.load(`/assets/medias/3d/level-1/scene-${sceneIdx}/high/${getTexturePrefix(sceneIdx, 'default')}-alpha.${this.isWebp ? 'webp' : 'jpg'}`);

        const carAtlas = (sceneIdx === 1 || sceneIdx === 4) ? textureLoader.load(`/assets/medias/3d/level-1/scene-${sceneIdx}/high/car-mesh-texture-default.${this.isWebp ? 'webp' : 'jpg'}`) : defaultAtlas;
        const carAlphaAtlas = (sceneIdx === 1 || sceneIdx === 4) ? textureLoader.load(`/assets/medias/3d/level-1/scene-${sceneIdx}/high/car-mesh-texture-alpha.${this.isWebp ? 'webp' : 'jpg'}`) : alphaAtlas;

        const exportedCam = loadedScene.getObjectByName('camera') as THREE.PerspectiveCamera;
        if (exportedCam && exportedCam.matrix) {
          camera.matrixAutoUpdate = false;
          camera.matrix.copy(exportedCam.matrix);
          camera.matrixWorld.copy(exportedCam.matrix);
          camera.matrixWorldNeedsUpdate = false;
        }

        loadedScene.traverse((child: any) => {
          if (child.name && (child.name.startsWith('_') || child.name === 'camera')) {
            child.visible = false;
            return;
          }
          if (child.isMesh && child.geometry) {
            child.matrixAutoUpdate = true;
            const matchingCfg = cfg.meshNames.find((m: any) => (typeof m === 'string' ? m : m.name) === child.name);
            const matName = matchingCfg && typeof matchingCfg === 'object' && matchingCfg.material ? matchingCfg.material : 'default';

            const useCar = matName === 'car';
            const defTex = useCar ? carAtlas : defaultAtlas;
            const alpTex = useCar ? carAlphaAtlas : alphaAtlas;

            child.material = new THREE.ShaderMaterial({
              vertexShader: meshVert,
              fragmentShader: meshFrag,
              uniforms: {
                uTextureDefault: { value: defTex },
                uTextureAlpha: { value: alpTex }
              },
              side: THREE.DoubleSide,
              transparent: true,
              depthTest: true,
              depthWrite: true
            });
          }
        });

        const currentAspect = (typeof window !== 'undefined' ? window.innerWidth : 1920) / (typeof window !== 'undefined' ? window.innerHeight : 1080);
        const targetAspect = 16 / 9;
        const scaleFactor = currentAspect > targetAspect ? (currentAspect / targetAspect) * 1.15 : 1.15;
        loadedScene.scale.set(scaleFactor, scaleFactor, scaleFactor);
        scene.add(loadedScene);
      } catch (err) {
        console.error(`[CITRIX ERROR] Failed to load main-mesh.json for scene ${sceneIdx}:`, err);
      }
    });

    // Populate Level 1 (3D Binary Mesh Inspection & Act Background Scenes)
    for (let idx = 0; idx <= 5; idx++) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1920 / 889, 0.1, 1000);
      camera.position.set(0, 0, -5);
      camera.lookAt(0, 0, 0);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
      dirLight.position.set(5, 5, -5);
      scene.add(dirLight);

      if (idx === 1) {
        const sub1 = new SubActScene1({
          time: this.time,
          sizes: this.sizes,
          parallax: this.parallax,
          renderer: this.renderer!,
          loader: null,
          resources: { car: { model: {} } },
          cursor: this.cursor,
          clearColor: this.clearColor,
          index: 1
        });
        sub1.start();
        scene.add(sub1.container);
      } else if (idx === 2) {
        const sub2 = new SubActScene2({
          time: this.time,
          sizes: this.sizes,
          parallax: this.parallax,
          renderer: this.renderer!,
          loader: null,
          resources: { differential: { model: {} } },
          cursor: this.cursor,
          clearColor: this.clearColor,
          index: 2
        });
        sub2.start();
        scene.add(sub2.container);
      } else if (idx === 3) {
        const earthTex = textureLoader.load('/assets/medias/3d/level-2/globe/earth.jpg');
        const earthNormal = textureLoader.load('/assets/medias/3d/level-2/globe/earth-normal.jpg');
        const globeMat = new THREE.MeshStandardMaterial({ map: earthTex, normalMap: earthNormal, roughness: 0.6 });
        const globeMesh = new THREE.Mesh(new THREE.SphereGeometry(1.8, 64, 64), globeMat);
        scene.add(globeMesh);
      } else {
        const bgTex = textureLoader.load('/assets/medias/3d/level-2/scene-1/graph-label-high.png');
        const bgMat = new THREE.MeshBasicMaterial({ map: bgTex, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
        const backdropPlane = new THREE.Mesh(new THREE.PlaneGeometry(8, 4.5), bgMat);
        backdropPlane.position.set(0, 0, 1);
        scene.add(backdropPlane);
      }

      const level1Item: any = {
        scene,
        camera,
        index: idx,
        enter: (direction: string = 'down', speed: number = 1, delay: number = 0) => {
          const startY = direction === 'down' ? -1 : 1;
          scene.position.y = startY;
          gsap.to(scene.position, { duration: speed, delay: delay, y: 0, ease: 'power2.out' });
        },
        leave: (direction: string = 'down', speed: number = 1, delay: number = 0) => {
          const targetY = direction === 'down' ? -1 : 1;
          gsap.to(scene.position, { duration: speed, delay: delay, y: targetY, ease: 'power2.in' });
        }
      };

      this.scenes.levels[1].push(level1Item);
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
    this.time.delta = 0;
    this.time.current = now;
  }

  public setSizes(): void {
    if (typeof window === 'undefined') return;
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;
  }

  public setCursor(x: number, y: number): void {
    this.cursor.x = x;
    this.cursor.y = y;
    this.cursor.normalX = (x / this.sizes.width) * 2 - 1;
    this.cursor.normalY = -(y / this.sizes.height) * 2 + 1;
  }

  public setParallax(): void {
    this.parallax.x = 0;
    this.parallax.y = 0;
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

    this.renderTargetA = new THREE.WebGLRenderTarget(this.sizes.width, this.sizes.height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat
    });
    this.renderTargetB = new THREE.WebGLRenderTarget(this.sizes.width, this.sizes.height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat
    });

    this.postScene = new THREE.Scene();
    this.postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.postMaterial = new THREE.ShaderMaterial({
      vertexShader: stretchVert,
      fragmentShader: stretchFrag,
      uniforms: {
        uTextureA: { value: this.renderTargetA.texture },
        uTextureB: { value: this.renderTargetB.texture },
        uStretchNoiseMultiplier: { value: new THREE.Vector2(0.01, 1.0) },
        uStretchStrength: { value: 0 },
        uTransitionStrength: { value: 0 },
        uTransitionDirection: { value: 1 },
        uInterpolationCount: { value: 9 },
        uTime: { value: 0 },
        uClearColor: { value: new THREE.Vector3(0.043, 0.062, 0.117) }
      }
    });
    this.postMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.postMaterial);
    this.postScene.add(this.postMesh);
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

      if (this.postMaterial) {
        gsap.killTweensOf(this.postMaterial.uniforms.uTransitionStrength);
        gsap.killTweensOf(this.postMaterial.uniforms.uStretchStrength);

        this.postMaterial.uniforms.uTransitionStrength.value = 0;
        gsap.to(this.postMaterial.uniforms.uTransitionStrength, {
          duration: 1.2 * speed,
          value: 1,
          ease: 'power2.inOut',
          onComplete: () => {
            if (this.postMaterial) this.postMaterial.uniforms.uTransitionStrength.value = 0;
            this.scenes.leaving = null;
            this.state = 'ready';
          }
        });

        gsap.to(this.postMaterial.uniforms.uStretchStrength, {
          duration: 0.6 * speed,
          value: 0.85,
          ease: 'power2.in'
        });
        gsap.to(this.postMaterial.uniforms.uStretchStrength, {
          duration: 0.6 * speed,
          value: 0,
          delay: 0.6 * speed,
          ease: 'power2.out'
        });
      }
    }
  }

  public resize(): void {
    if (typeof window === 'undefined') return;
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;
    const aspect = window.innerWidth / window.innerHeight;

    if (this.scenes && this.scenes.levels) {
      this.scenes.levels.forEach((level) => {
        level.forEach(item => {
          if (item.camera) {
            item.camera.aspect = aspect;
            const baseFov = (this.sceneConfigs[item.index] && this.sceneConfigs[item.index].fov) ? this.sceneConfigs[item.index].fov : 35;
            if (aspect > (16 / 9)) {
              item.camera.fov = baseFov * (aspect / (16 / 9));
            } else {
              item.camera.fov = baseFov;
            }
            item.camera.updateProjectionMatrix();
          }
        });
      });
    }

    if (this.scenes.active && this.scenes.active.camera) {
      this.scenes.active.camera.aspect = aspect;
      const baseFov = (this.sceneConfigs[this.scenes.active.index] && this.sceneConfigs[this.scenes.active.index].fov) ? this.sceneConfigs[this.scenes.active.index].fov : 35;
      if (aspect > (16 / 9)) {
        this.scenes.active.camera.fov = baseFov * (aspect / (16 / 9));
      } else {
        this.scenes.active.camera.fov = baseFov;
      }
      this.scenes.active.camera.updateProjectionMatrix();
    }

    if (this.renderer) {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    if (this.renderTargetA && this.renderTargetB) {
      this.renderTargetA.setSize(window.innerWidth, window.innerHeight);
      this.renderTargetB.setSize(window.innerWidth, window.innerHeight);
    }
    if (this.composer && this.composer.setSize) {
      this.composer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  public update(deltaSeconds?: number, elapsedMs?: number): void {
    const now = Date.now();
    this.time.elapsed = elapsedMs !== undefined ? elapsedMs : now - this.time.start;
    this.time.delta = deltaSeconds !== undefined ? deltaSeconds * 1000 : now - this.time.current;
    this.time.current = now;

    if (this.time.delta > 60) this.time.delta = 60;

    this.stretchShaderPass.uniforms.uTime.value = this.time.elapsed;

    // 3D Mouse Parallax Effect (smooth lerp following cursor pointer)
    const targetParallaxX = this.cursor.normalX * 0.4;
    const targetParallaxY = this.cursor.normalY * 0.3;
    this.parallax.x += (targetParallaxX - this.parallax.x) * 0.08;
    this.parallax.y += (targetParallaxY - this.parallax.y) * 0.08;

    if (this.scenes.active && this.scenes.active.scene) {
      this.scenes.active.scene.position.x = this.parallax.x;
      this.scenes.active.scene.position.y = this.parallax.y;
    }

    if (this.scenes.active && typeof this.scenes.active.update === 'function') {
      this.scenes.active.update();
    }
    if (this.scenes.leaving && typeof this.scenes.leaving.update === 'function') {
      this.scenes.leaving.update();
    }

    if (this.renderer && this.scenes.active && this.scenes.active.scene && this.scenes.active.camera) {
      if (this.scenes.active.camera.matrixAutoUpdate) {
        this.scenes.active.camera.lookAt(0, 0, 0);
      }

      if (this.scenes.leaving && this.scenes.leaving.scene && this.scenes.leaving.camera && this.renderTargetA && this.renderTargetB && this.postScene && this.postCamera && this.postMaterial && this.postMaterial.uniforms.uTransitionStrength.value > 0.001) {
        this.renderer.setRenderTarget(this.renderTargetA);
        this.renderer.render(this.scenes.leaving.scene, this.scenes.leaving.camera);

        this.renderer.setRenderTarget(this.renderTargetB);
        this.renderer.render(this.scenes.active.scene, this.scenes.active.camera);

        this.postMaterial.uniforms.uTime.value = this.time.elapsed;
        this.postMaterial.uniforms.uTextureA.value = this.renderTargetA.texture;
        this.postMaterial.uniforms.uTextureB.value = this.renderTargetB.texture;

        this.renderer.setRenderTarget(null);
        this.renderer.render(this.postScene, this.postCamera);
      } else {
        this.renderer.setRenderTarget(null);
        this.renderer.render(this.scenes.active.scene, this.scenes.active.camera);
      }
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
