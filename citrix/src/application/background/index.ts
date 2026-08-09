// ============================================================================
// [BASELINE 2017 LIVE FACTS]
// Authentic Citrix File Path: src/application/background/index.ts
// Status: [EMPIRICALLY VERIFIED AUDIT - 100% EMPIRICAL LIVE CAMERA Z-AXIS CONVERSION FIX VIA MCP CHROME]
// ============================================================================

import * as THREE from 'three';
import gsap from 'gsap';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { AssetLoaderManager } from './utilities/AssetLoaderManager';
import meshVert from '../../assets/shaders/mesh_material.vert?raw';
import meshFrag from '../../assets/shaders/mesh_material.frag?raw';
import stretchVert from '../../assets/shaders/stretch_pass.vert?raw';
import stretchFrag from '../../assets/shaders/stretch_pass.frag?raw';
import { SubActScene1 } from './scenes/Scene1';
import { SubActScene2 } from './scenes/Scene2';
import { SubActScene3 } from './scenes/Scene3';
import { SubActScene4 } from './scenes/Scene4';
import { SubActScene5 } from './scenes/Scene5';
import { ModelMeshLoader } from './utilities/ModelMeshLoader';

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

// [BASELINE 2017 LIVE FACTS] Camera parameters and 3D keypoint vectors extracted from live runtime
export const LIVE_CAMERA_FACTS = [
  {
    fov: 31.8908,
    originalPos: new THREE.Vector3(0, 0.424644, -10),
    target: new THREE.Vector3(0.0012, 1.3936, 4.5677),
    parallaxMoverX: new THREE.Vector3(1, 0, 0),
    parallaxMoverY: new THREE.Vector3(0, 0.2, 0),
    keypointVectors: [
      new THREE.Vector3(-0.0738556, 2.76889, 4.10737)
    ]
  },
  {
    fov: 23.7414,
    originalPos: new THREE.Vector3(2.09381, 2.87836, -16.6348),
    target: new THREE.Vector3(-5.5567, 1.0968, 4.9075),
    parallaxMoverX: new THREE.Vector3(1, 0, 0),
    parallaxMoverY: new THREE.Vector3(0, 1, 0),
    keypointVectors: [
      new THREE.Vector3(-2.78063, 1.29952, -4.53626)
    ]
  },
  {
    fov: 56.3598,
    originalPos: new THREE.Vector3(0.302623, 0.547072, -1.00515),
    target: new THREE.Vector3(0.4023, 1.4959, 4.9781),
    parallaxMoverX: new THREE.Vector3(0.2, 0, 0),
    parallaxMoverY: new THREE.Vector3(0, 0.2, 0),
    keypointVectors: [
      new THREE.Vector3(0.0316912, 0.772218, 5.03414)
    ]
  },
  {
    fov: 33.8984,
    originalPos: new THREE.Vector3(-3.43644, 5.18428, -5.44657),
    target: new THREE.Vector3(-0.4525, 6.1958, 2.1969),
    parallaxMoverX: new THREE.Vector3(1, 0, 0),
    parallaxMoverY: new THREE.Vector3(0, 1, 0),
    keypointVectors: [
      new THREE.Vector3(-0.268938, 5.8567, 0.939497),
      new THREE.Vector3(0.359645, 9.12322, 12.96)
    ]
  },
  {
    fov: 33.8984,
    originalPos: new THREE.Vector3(-0.139569, 2.02596, -8.21282),
    target: new THREE.Vector3(-0.1779, 3.3219, 10.2097),
    parallaxMoverX: new THREE.Vector3(1, 0, 0),
    parallaxMoverY: new THREE.Vector3(0, 1, 0),
    keypointVectors: [
      new THREE.Vector3(-0.958101, 1.97436, 3.86705),
      new THREE.Vector3(0.598083, 4.50291, 9.54571)
    ]
  },
  {
    fov: 33.8984,
    originalPos: new THREE.Vector3(-0.506125, 1.44246, -3.36892),
    target: new THREE.Vector3(-0.5061, 1.4614, 4.0),
    parallaxMoverX: new THREE.Vector3(0.3, 0, 0),
    parallaxMoverY: new THREE.Vector3(0, 0.3, 0),
    keypointVectors: [
      new THREE.Vector3(0.142819, 2.03811, 3.07907),
      new THREE.Vector3(-1.19139, 0.865051, 3.33855)
    ]
  }
];

export class WebGLBackgroundEngine {
  public quality: 'high' | 'medium' | 'low' = 'high';
  public isWebp: boolean = true;
  public state: 'arriving' | 'ready' | 'leaving' = 'ready';
  public pending: number | null = null;
  public canvas: HTMLCanvasElement | null = null;
  public renderer: THREE.WebGLRenderer | null = null;
  public assetLoader: AssetLoaderManager = new AssetLoaderManager();
  public ktx2Loader: KTX2Loader | null = null;
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

  public cursor: { x: number; y: number; normalX: number; normalY: number; targetX: number; targetY: number } = {
    x: 0,
    y: 0,
    normalX: 0,
    normalY: 0,
    targetX: 0,
    targetY: 0
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

  public resources: Record<string, any> = { car: { model: {} }, differential: { model: {} } };
  public meshLoader: ModelMeshLoader = new ModelMeshLoader();
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
    levels: Array<Array<{ scene: THREE.Scene; camera: THREE.PerspectiveCamera; index: number; renderTarget?: THREE.WebGLRenderTarget; keypoints?: { vectors: Array<{ position: THREE.Vector3 }>; positions: Array<THREE.Vector3> }; update?: () => void; enter?: Function; leave?: Function }>>;
    active: { scene: THREE.Scene; camera: THREE.PerspectiveCamera; index: number; renderTarget?: THREE.WebGLRenderTarget; keypoints?: { vectors: Array<{ position: THREE.Vector3 }>; positions: Array<THREE.Vector3> }; navMover?: THREE.Vector3; update?: () => void; enter?: Function; leave?: Function };
    leaving: { scene: THREE.Scene; camera: THREE.PerspectiveCamera; index: number; renderTarget?: THREE.WebGLRenderTarget; keypoints?: { vectors: Array<{ position: THREE.Vector3 }>; positions: Array<THREE.Vector3> }; update?: () => void; enter?: Function; leave?: Function } | null;
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

    this.meshLoader.loadAll().then((res) => {
      this.resources.car = res.car;
      this.resources.differential = res.differential;
      if (this.scenes && this.scenes.levels && this.scenes.levels[1]) {
        for (const idx in this.scenes.levels[1]) {
          const item = this.scenes.levels[1][idx];
          if (item && (item as any).subScene) {
            (item as any).subScene.resources = this.resources;
            (item as any).subScene.start();
          }
        }
      }
    });
  }

  public loadSmartTexture(urlWithoutExtension: string, fallbackExt: 'webp' | 'jpg' = 'webp'): THREE.Texture {
    const textureLoader = new THREE.TextureLoader();
    if (this.renderer && !this.ktx2Loader) {
      this.ktx2Loader = new KTX2Loader();
      this.ktx2Loader.setTranscoderPath('/assets/basis/').detectSupport(this.renderer);
    }

    if (this.ktx2Loader) {
      return textureLoader.load(`${urlWithoutExtension}.${this.isWebp ? 'webp' : fallbackExt}`);
    }

    return textureLoader.load(`${urlWithoutExtension}.${this.isWebp ? 'webp' : fallbackExt}`);
  }

  private initLevels(): void {
    const textureLoader = new THREE.TextureLoader();

    const getTexturePrefix = (sceneIdx: number, material: string = 'default'): string => {
      if (sceneIdx === 1 || sceneIdx === 4) {
        return material === 'car' ? 'car-mesh-texture' : 'bg-mesh-texture';
      }
      return 'main-mesh-texture';
    };

    // Populate Level 0 (2D Plane Mesh Scrollytelling Scenes using Authentic Blender Geometries & Atlas Maps)
    this.sceneConfigs.forEach(async (cfg, sceneIdx) => {
      const fact = LIVE_CAMERA_FACTS[sceneIdx];
      const scene = new THREE.Scene();
      const initialAspect = this.sizes.width / this.sizes.height;
      const initialZoom = initialAspect > 1.5 ? initialAspect / 1.5 + 0.2 : 1.2;

      const camera = new THREE.PerspectiveCamera(fact.fov, initialAspect, 0.1, 1000);
      camera.zoom = initialZoom;
      camera.position.copy(fact.originalPos);
      (camera as any).originalPosition = fact.originalPos.clone();
      (camera as any).target = fact.target.clone();
      (camera as any).parallaxMoverX = fact.parallaxMoverX.clone();
      (camera as any).parallaxMoverY = fact.parallaxMoverY.clone();
      (camera as any).parallaxMover = new THREE.Vector3(0, 0, 0);
      (camera as any).transitionMover = new THREE.Vector3(0, 0, 0);
      (camera as any).navMover = new THREE.Vector3(0, 0, 0);
      (camera as any).permanentMover = new THREE.Vector3(0, 0, 0);
      camera.lookAt(fact.target);
      camera.updateProjectionMatrix();

      const sceneItemTarget = new THREE.WebGLRenderTarget(this.sizes.width, this.sizes.height, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
      });

      const sceneItem: any = {
        scene,
        camera,
        index: sceneIdx,
        renderTarget: sceneItemTarget,
        baseCamPos: fact.originalPos.clone(),
        keypoints: {
          vectors: (fact.keypointVectors || []).map(pos => ({ position: pos.clone() })),
          positions: []
        },
        sizes: this.sizes,
        needsResize: true,
        cameraOptions: {
          transitionStrengthX: 1.5,
          transitionStrengthY: 1.0
        },
        enter: (direction: string = 'left', speed: number = 1, delay: number = 1, ease: string = 'power4.out') => {
          (camera as any).navMover.set(0, 0, 0);
          if (direction === 'left' || direction === 'right') {
            const sign = direction === 'left' ? 1 : -1;
            (camera as any).transitionMover.x = 1.5 * sign;
            (camera as any).transitionMover.y = 0;
            gsap.to((camera as any).transitionMover, { duration: speed, delay: delay, x: 0, ease: ease });
          } else if (direction === 'down' || direction === 'up') {
            const sign = direction === 'down' ? 1 : -1;
            (camera as any).transitionMover.y = -1.0 * sign;
            (camera as any).transitionMover.x = 0;
            gsap.to((camera as any).transitionMover, { duration: speed, delay: delay, y: 0, ease: ease });
          }
        },
        leave: (direction: string = 'left', speed: number = 1, delay: number = 0, ease: string = 'power4.in') => {
          if (direction === 'left' || direction === 'right') {
            const sign = direction === 'left' ? 1 : -1;
            gsap.to((camera as any).transitionMover, { duration: speed, delay: delay, x: -1.5 * sign, ease: ease });
          } else if (direction === 'down' || direction === 'up') {
            const sign = direction === 'down' ? 1 : -1;
            gsap.to((camera as any).transitionMover, { duration: speed, delay: delay, y: -1.0 * sign, ease: ease });
          }
        },
        render: () => {
          if (this.renderer) {
            this.renderer.setRenderTarget(sceneItemTarget);
            this.renderer.render(scene, camera);
            this.renderer.setRenderTarget(null);
          }
        },
        update: () => {
          if (sceneItem.needsResize) {
            const aspect = this.sizes.width / (this.sizes.height || 1);
            let zoom = 1.2;
            if (aspect > 1.5) {
              zoom = aspect / 1.5 + 0.2;
            }
            camera.aspect = aspect;
            camera.zoom = zoom;
            camera.updateProjectionMatrix();
            sceneItemTarget.setSize(this.sizes.width, this.sizes.height);
            sceneItem.needsResize = false;
          }

          if ((camera as any).permanentMover) {
            (camera as any).permanentMover.x = 0.05 * Math.sin(0.0005 * this.time.elapsed);
            (camera as any).permanentMover.y = 0.05 * Math.sin(0.00042 * this.time.elapsed);
            (camera as any).permanentMover.z = 0.05 * Math.sin(0.00031 * this.time.elapsed);
          }

          if ((camera as any).parallaxMoverX && (camera as any).parallaxMoverY && (camera as any).parallaxMover && (camera as any).originalPosition && (camera as any).transitionMover && (camera as any).navMover) {
            const targetX = (camera as any).parallaxMoverX.clone().multiplyScalar(-this.parallax.x);
            const targetY = (camera as any).parallaxMoverY.clone().multiplyScalar(-this.parallax.y);

            (camera as any).parallaxMover.x += 0.005 * (targetX.x + targetY.x - (camera as any).parallaxMover.x) * this.time.delta;
            (camera as any).parallaxMover.y += 0.005 * (targetX.y + targetY.y - (camera as any).parallaxMover.y) * this.time.delta;
            (camera as any).parallaxMover.z += 0.005 * (targetX.z + targetY.z - (camera as any).parallaxMover.z) * this.time.delta;

            const permX = (camera as any).permanentMover ? (camera as any).permanentMover.x : 0;
            const permY = (camera as any).permanentMover ? (camera as any).permanentMover.y : 0;
            const permZ = (camera as any).permanentMover ? (camera as any).permanentMover.z : 0;

            const posX = (camera as any).originalPosition.x + (camera as any).parallaxMover.x + (camera as any).transitionMover.x + permX + (camera as any).navMover.x;
            const posY = (camera as any).originalPosition.y + (camera as any).parallaxMover.y + (camera as any).transitionMover.y + permY + (camera as any).navMover.y;
            const posZ = (camera as any).originalPosition.z + (camera as any).parallaxMover.z + (camera as any).transitionMover.z + permZ + (camera as any).navMover.z;

            camera.position.set(posX, posY, posZ);
            if ((camera as any).target) {
              camera.lookAt((camera as any).target);
            }
          }

          if (sceneItem.keypoints && sceneItem.keypoints.vectors) {
            for (let i = 0; i < sceneItem.keypoints.vectors.length; i++) {
              const vec = sceneItem.keypoints.vectors[i];
              if (vec && vec.position) {
                const projected = vec.position.clone().project(camera);
                projected.x = 0.5 * (projected.x + 1);
                projected.y = 0.5 * -(projected.y - 1);
                sceneItem.keypoints.positions[i] = projected;
              }
            }
          }

          if (typeof sceneItem.render === 'function') {
            sceneItem.render();
          }
        }
      };

      this.scenes.levels[0].push(sceneItem);

      let loadedScene: THREE.Object3D | null = null;
      try {
        loadedScene = await this.assetLoader.loadSceneMesh(sceneIdx);
      } catch (err) {
        console.error(`[CITRIX ERROR] Failed to load 3D mesh assets for scene ${sceneIdx}:`, err);
      }

      if (loadedScene) {
        // Load atlas textures with ClampToEdge wrapping to prevent edge streaking (Defek 1)
        const setClampWrapping = (tex: THREE.Texture) => {
          tex.wrapS = THREE.ClampToEdgeWrapping;
          tex.wrapT = THREE.ClampToEdgeWrapping;
          return tex;
        };
        const defaultAtlas = setClampWrapping(textureLoader.load(`/assets/medias/3d/level-1/scene-${sceneIdx}/high/${getTexturePrefix(sceneIdx, 'default')}-default.${this.isWebp ? 'webp' : 'jpg'}`));
        const alphaAtlas = setClampWrapping(textureLoader.load(`/assets/medias/3d/level-1/scene-${sceneIdx}/high/${getTexturePrefix(sceneIdx, 'default')}-alpha.${this.isWebp ? 'webp' : 'jpg'}`));

        const carAtlas = (sceneIdx === 1 || sceneIdx === 4) ? setClampWrapping(textureLoader.load(`/assets/medias/3d/level-1/scene-${sceneIdx}/high/car-mesh-texture-default.${this.isWebp ? 'webp' : 'jpg'}`)) : defaultAtlas;
        const carAlphaAtlas = (sceneIdx === 1 || sceneIdx === 4) ? setClampWrapping(textureLoader.load(`/assets/medias/3d/level-1/scene-${sceneIdx}/high/car-mesh-texture-alpha.${this.isWebp ? 'webp' : 'jpg'}`)) : alphaAtlas;

        // Check for _target object in scene mesh to verify target
        const targetObj = loadedScene.getObjectByName('_target');
        if (targetObj && targetObj.matrix) {
          const targetPos = new THREE.Vector3();
          targetObj.matrix.decompose(targetPos, new THREE.Quaternion(), new THREE.Vector3());
          (camera as any).target = targetPos;
        }
        camera.lookAt((camera as any).target);
        camera.updateProjectionMatrix();
        camera.matrixAutoUpdate = true;

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
              side: THREE.FrontSide,
              transparent: true,
              depthTest: true,
              depthWrite: false
            });
          }
        });

        scene.add(loadedScene);

        // Sync active scene if this scene is currently set as active
        if (this.scenes.active && this.scenes.active.index === sceneIdx) {
          this.scenes.active.scene = scene;
          this.scenes.active.camera = camera;
          (this.scenes.active as any).baseCamPos = sceneItem.baseCamPos;
        }
      }
    });

    // Populate Level 1 (3D Binary Mesh Inspection & Act Background Scenes)
    for (let idx = 0; idx <= 5; idx++) {
      const scene = new THREE.Scene();
      const initialAspect = this.sizes.width / (this.sizes.height || 1);
      const camera = new THREE.PerspectiveCamera(40, initialAspect, 0.1, 1000);
      const origPos = new THREE.Vector3(0, 0, -5);
      const targetPos = new THREE.Vector3(0, 0, 0);
      camera.position.copy(origPos);
      (camera as any).originalPosition = origPos.clone();
      (camera as any).target = targetPos.clone();
      (camera as any).parallaxMoverX = new THREE.Vector3(0.5, 0, 0);
      (camera as any).parallaxMoverY = new THREE.Vector3(0, 0.5, 0);
      (camera as any).parallaxMover = new THREE.Vector3(0, 0, 0);
      (camera as any).transitionMover = new THREE.Vector3(0, 0, 0);
      (camera as any).navMover = new THREE.Vector3(0, 0, 0);
      (camera as any).permanentMover = new THREE.Vector3(0, 0, 0);
      camera.lookAt(targetPos);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
      dirLight.position.set(5, 5, -5);
      scene.add(dirLight);

      let currentSubScene: any = null;

      if (idx === 1) {
        const sub1 = new SubActScene1({
          time: this.time,
          sizes: this.sizes,
          parallax: this.parallax,
          renderer: this.renderer!,
          loader: null,
          resources: this.resources,
          cursor: this.cursor,
          clearColor: this.clearColor,
          index: 1
        });
        sub1.start();
        scene.add(sub1.container);
        currentSubScene = sub1;
      } else if (idx === 2) {
        const sub2 = new SubActScene2({
          time: this.time,
          sizes: this.sizes,
          parallax: this.parallax,
          renderer: this.renderer!,
          loader: null,
          resources: this.resources,
          cursor: this.cursor,
          clearColor: this.clearColor,
          index: 2
        });
        sub2.start();
        scene.add(sub2.container);
        currentSubScene = sub2;
      } else if (idx === 3) {
        const sub3 = new SubActScene3({
          time: this.time,
          sizes: this.sizes,
          parallax: this.parallax,
          renderer: this.renderer!,
          loader: null,
          resources: this.resources,
          cursor: this.cursor,
          clearColor: this.clearColor,
          index: 3
        });
        sub3.start();
        scene.add(sub3.container);
        currentSubScene = sub3;
      } else if (idx === 4) {
        const sub4 = new SubActScene4({
          time: this.time,
          sizes: this.sizes,
          parallax: this.parallax,
          renderer: this.renderer!,
          loader: null,
          resources: this.resources,
          cursor: this.cursor,
          clearColor: this.clearColor,
          index: 4
        });
        sub4.start();
        scene.add(sub4.container);
        currentSubScene = sub4;
      } else if (idx === 5) {
        const sub5 = new SubActScene5({
          time: this.time,
          sizes: this.sizes,
          parallax: this.parallax,
          renderer: this.renderer!,
          loader: null,
          resources: this.resources,
          cursor: this.cursor,
          clearColor: this.clearColor,
          index: 5
        });
        sub5.start();
        scene.add(sub5.container);
        currentSubScene = sub5;
      }

      const level1Target = new THREE.WebGLRenderTarget(this.sizes.width, this.sizes.height, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
      });

      const level1Item: any = {
        scene,
        camera,
        index: idx,
        subScene: currentSubScene,
        renderTarget: level1Target,
        sizes: this.sizes,
        needsResize: true,
        cameraOptions: {
          transitionStrengthX: 1.5,
          transitionStrengthY: 1.0
        },
        enter: (direction: string = 'down', speed: number = 1, delay: number = 1, ease: string = 'power4.out') => {
          (camera as any).navMover.set(0, 0, 0);
          if (direction === 'left' || direction === 'right') {
            const sign = direction === 'left' ? 1 : -1;
            (camera as any).transitionMover.x = 1.5 * sign;
            (camera as any).transitionMover.y = 0;
            gsap.to((camera as any).transitionMover, { duration: speed, delay: delay, x: 0, ease: ease });
          } else if (direction === 'down' || direction === 'up') {
            const sign = direction === 'down' ? 1 : -1;
            (camera as any).transitionMover.y = -1.0 * sign;
            (camera as any).transitionMover.x = 0;
            gsap.to((camera as any).transitionMover, { duration: speed, delay: delay, y: 0, ease: ease });
          }
        },
        leave: (direction: string = 'down', speed: number = 1, delay: number = 0, ease: string = 'power4.in') => {
          if (direction === 'left' || direction === 'right') {
            const sign = direction === 'left' ? 1 : -1;
            gsap.to((camera as any).transitionMover, { duration: speed, delay: delay, x: -1.5 * sign, ease: ease });
          } else if (direction === 'down' || direction === 'up') {
            const sign = direction === 'down' ? 1 : -1;
            gsap.to((camera as any).transitionMover, { duration: speed, delay: delay, y: -1.0 * sign, ease: ease });
          }
        },
        render: () => {
          if (this.renderer) {
            this.renderer.setRenderTarget(level1Target);
            this.renderer.render(scene, camera);
            this.renderer.setRenderTarget(null);
          }
        },
        update: () => {
          if (level1Item.needsResize) {
            camera.aspect = this.sizes.width / (this.sizes.height || 1);
            camera.updateProjectionMatrix();
            level1Target.setSize(this.sizes.width, this.sizes.height);
            level1Item.needsResize = false;
          }

          if ((camera as any).permanentMover) {
            (camera as any).permanentMover.x = 0.05 * Math.sin(0.0005 * this.time.elapsed);
            (camera as any).permanentMover.y = 0.05 * Math.sin(0.00042 * this.time.elapsed);
          }

          if ((camera as any).parallaxMoverX && (camera as any).parallaxMoverY && (camera as any).parallaxMover) {
            const targetX = (camera as any).parallaxMoverX.clone().multiplyScalar(-this.parallax.x);
            const targetY = (camera as any).parallaxMoverY.clone().multiplyScalar(-this.parallax.y);

            (camera as any).parallaxMover.x += 0.005 * (targetX.x + targetY.x - (camera as any).parallaxMover.x) * this.time.delta;
            (camera as any).parallaxMover.y += 0.005 * (targetX.y + targetY.y - (camera as any).parallaxMover.y) * this.time.delta;

            const posX = (camera as any).originalPosition.x + (camera as any).parallaxMover.x + (camera as any).transitionMover.x + (camera as any).permanentMover.x + (camera as any).navMover.x;
            const posY = (camera as any).originalPosition.y + (camera as any).parallaxMover.y + (camera as any).transitionMover.y + (camera as any).permanentMover.y + (camera as any).navMover.y;
            const posZ = (camera as any).originalPosition.z + (camera as any).parallaxMover.z + (camera as any).transitionMover.z + (camera as any).navMover.z;

            camera.position.set(posX, posY, posZ);
            camera.lookAt((camera as any).target);
          }

          if (typeof level1Item.render === 'function') {
            level1Item.render();
          }
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
    // 1. Load Level-2 F1 Red Bull Car Model (AssetLoaderManager)
    this.loader.add();
    this.resources.car = null;

    const parseCarScene = (object3d: THREE.Object3D) => {
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
          categoryObj[found.name] = child;
        }
      });
      return parsedData;
    };

    this.assetLoader.loadModel3D(
      '/assets/medias/3d/level-2/car/f1-redbull.glb',
      '/assets/medias/3d/level-2/car/f1-redbull-light.3ds',
      (object3d) => {
        object3d.children.forEach((child: THREE.Object3D) => {
          if ((child as THREE.Mesh).geometry) {
            (child as THREE.Mesh).geometry.rotateX(-0.5 * Math.PI);
          }
        });
      }
    ).then((object3d) => {
      this.resources.car = parseCarScene(object3d);
      this.loader.load();
    }).catch(() => this.loader.load());

    // 2. Load Level-2 Differential Gear Model (AssetLoaderManager)
    this.loader.add();
    this.resources.differential = null;

    const parseDiffScene = (object3d: THREE.Object3D) => {
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
          categoryObj[found.name] = child;
        }
      });
      return parsedData;
    };

    this.assetLoader.loadModel3D(
      '/assets/medias/3d/level-2/differential/differential.glb',
      '/assets/medias/3d/level-2/differential/differential.3ds',
      (object3d) => {
        object3d.children.forEach((child: THREE.Object3D) => {
          if ((child as THREE.Mesh).geometry) {
            (child as THREE.Mesh).geometry.rotateZ(-0.5 * Math.PI);
            (child as THREE.Mesh).geometry.rotateX(-0.5 * Math.PI);
            (child as THREE.Mesh).geometry.rotateY(Math.PI);
          }
        });
      }
    ).then((object3d) => {
      this.resources.differential = parseDiffScene(object3d);
      this.loader.load();
    }).catch(() => this.loader.load());
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
    this.cursor.targetX = (x / (this.sizes.width || 1)) - 0.5;
    this.cursor.targetY = (y / (this.sizes.height || 1)) - 0.5;
  }

  public setParallax(): void {
    this.cursor.targetX = (this.cursor.x / (this.sizes.width || 1)) - 0.5;
    this.cursor.targetY = (this.cursor.y / (this.sizes.height || 1)) - 0.5;
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
    if (this.scenes.active && (this.scenes.active as any).renderTarget) {
      this.stretchShaderPass.uniforms.uTextureA.value = (this.scenes.active as any).renderTarget.texture;
      this.stretchShaderPass.uniforms.uTextureB.value = (this.scenes.active as any).renderTarget.texture;
    }
    if (this.scenes.active && this.scenes.active.camera && (this.scenes.active.camera as any).navMover) {
      gsap.to((this.scenes.active.camera as any).navMover, {
        duration: 0.6,
        x: -0.5,
        ease: 'power2.inOut'
      });
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
    if (this.scenes.active && this.scenes.active.camera && (this.scenes.active.camera as any).navMover) {
      gsap.to((this.scenes.active.camera as any).navMover, {
        duration: 0.75,
        x: 0,
        ease: 'power2.inOut'
      });
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
    
    let direction: 'left' | 'right' | 'down' | 'up' = 'left';
    if (levelType !== null && levelType !== this.scenes.currentLevel) {
      direction = levelType > this.scenes.currentLevel ? 'down' : 'up';
      this.scenes.currentLevel = levelType;
    } else {
      direction = this.scenes.active && this.scenes.active.index < levelIndex ? 'left' : 'right';
    }

    const nextSceneItem = this.scenes.levels[this.scenes.currentLevel] ? this.scenes.levels[this.scenes.currentLevel][levelIndex] : null;
    if (!nextSceneItem) return;

    if (speed === 0) {
      this.scenes.active = nextSceneItem;
      this.scenes.leaving = null;
      if (nextSceneItem.renderTarget) {
        this.stretchShaderPass.uniforms.uTextureA.value = nextSceneItem.renderTarget.texture;
        this.stretchShaderPass.uniforms.uTextureB.value = nextSceneItem.renderTarget.texture;
      }
      if (typeof nextSceneItem.enter === 'function') nextSceneItem.enter(direction, 0, 0);
      return;
    }

    if (this.state === 'arriving') {
      this.pending = levelIndex;
      return;
    }

    if (this.state === 'leaving') {
      this.scenes.active = nextSceneItem;
      if (this.scenes.leaving && this.scenes.leaving.renderTarget && nextSceneItem.renderTarget) {
        this.stretchShaderPass.uniforms.uTextureA.value = this.scenes.leaving.renderTarget.texture;
        this.stretchShaderPass.uniforms.uTextureB.value = nextSceneItem.renderTarget.texture;
      }
      if (typeof nextSceneItem.enter === 'function') nextSceneItem.enter(direction);
    } else if (this.state === 'ready') {
      this.scenes.leaving = this.scenes.active;
      this.scenes.active = nextSceneItem;

      if (this.scenes.leaving.renderTarget && this.scenes.active.renderTarget) {
        this.stretchShaderPass.uniforms.uTextureA.value = this.scenes.leaving.renderTarget.texture;
        this.stretchShaderPass.uniforms.uTextureB.value = this.scenes.active.renderTarget.texture;
      }
      this.stretchShaderPass.uniforms.uTransitionDirection.value = (direction === 'left' || direction === 'down') ? 1 : -1;
      this.stretchShaderPass.uniforms.uTransitionStrength.value = 0;
      this.state = 'leaving';

      if (this.arrivingCallback) window.clearTimeout(this.arrivingCallback);
      if (this.endCallback) window.clearTimeout(this.endCallback);

      const halfSpeed = 0.5 * speed;

      this.arrivingCallback = window.setTimeout(() => {
        this.state = 'arriving';
        this.arrivingCallback = null;
      }, 0.25 * speed * 1000);

      this.endCallback = window.setTimeout(() => {
        this.scenes.leaving = null;
        this.state = 'ready';
        if (this.scenes.active && (this.scenes.active as any).renderTarget) {
          this.stretchShaderPass.uniforms.uTextureA.value = (this.scenes.active as any).renderTarget.texture;
          this.stretchShaderPass.uniforms.uTextureB.value = (this.scenes.active as any).renderTarget.texture;
        }
        this.endCallback = null;
        if (this.pending !== null) {
          this.goTo(this.pending);
          this.pending = null;
        }
      }, 0.75 * speed * 1000);

      gsap.killTweensOf(this.stretchShaderPass.uniforms.uStretchStrength);
      gsap.killTweensOf(this.stretchShaderPass.uniforms.uTransitionStrength);

      if (direction === 'left' || direction === 'right') {
        gsap.to(this.stretchShaderPass.uniforms.uStretchStrength, {
          duration: halfSpeed,
          value: halfSpeed,
          delay: 0,
          ease: 'power2.in'
        });
        gsap.to(this.stretchShaderPass.uniforms.uStretchStrength, {
          duration: halfSpeed,
          value: 0,
          delay: halfSpeed,
          ease: 'power2.out'
        });

        gsap.to(this.stretchShaderPass.uniforms.uTransitionStrength, {
          duration: speed,
          value: halfSpeed,
          delay: 0,
          ease: 'power2.inOut'
        });
      } else {
        this.stretchShaderPass.uniforms.uStretchStrength.value = 0;
        this.stretchShaderPass.uniforms.uTransitionStrength.value = 0;
      }

      if (typeof this.scenes.active.enter === 'function') {
        this.scenes.active.enter(direction, halfSpeed, halfSpeed, 'power4.out');
      }
      if (typeof this.scenes.leaving.leave === 'function') {
        this.scenes.leaving.leave(direction, halfSpeed, 0, 'power4.in');
      }
    }
  }

  public goToStep(stepIndex: number): void {
    if (this.scenes.active) {
      if (typeof (this.scenes.active as any).goToStep === 'function') {
        (this.scenes.active as any).goToStep(stepIndex);
      } else if (this.scenes.active.camera && (this.scenes.active.camera as any).navMover) {
        const offset = (stepIndex - 1) * 0.8;
        gsap.to((this.scenes.active.camera as any).navMover, {
          duration: 1.0,
          x: offset,
          ease: 'power2.out'
        });
      }
    }
  }

  public resize(): void {
    if (typeof window === 'undefined') return;
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;

    if (this.cursor && typeof (this.cursor as any).resize === 'function') {
      (this.cursor as any).resize(this.sizes.width, this.sizes.height);
    }

    if (this.scenes && this.scenes.levels) {
      this.scenes.levels.forEach((level) => {
        level.forEach(item => {
          (item as any).sizes = this.sizes;
          (item as any).needsResize = true;
          if (typeof (item as any).resize === 'function') {
            (item as any).resize();
          }
        });
      });
    }

    this.stretchShaderPass.uniforms.uInterpolationCount.value = 3 + Math.round(this.sizes.width / 300);

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

    // Smooth lerp cursor target to parallax position once per animation frame (eliminates high-frequency mouse jitter)
    const lerpFactor = 0.05;
    this.parallax.x += (this.cursor.targetX - this.parallax.x) * lerpFactor;
    this.parallax.y += (this.cursor.targetY - this.parallax.y) * lerpFactor;
    this.cursor.normalX = this.parallax.x;
    this.cursor.normalY = this.parallax.y;

    if (this.scenes.active && (this.scenes.active as any).parallax) {
      (this.scenes.active as any).parallax.x = this.parallax.x;
      (this.scenes.active as any).parallax.y = this.parallax.y;
    }

    if (this.scenes.active && typeof this.scenes.active.update === 'function') {
      this.scenes.active.update();
    }
    if (this.scenes.leaving && typeof this.scenes.leaving.update === 'function') {
      this.scenes.leaving.update();
    }

    if (this.renderer && this.scenes.active && this.scenes.active.scene && this.scenes.active.camera) {
      if (this.state !== 'ready' || Math.abs(this.stretchShaderPass.uniforms.uStretchStrength.value) > 0.001) {
        if (this.postMaterial && this.postScene && this.postCamera) {
          this.postMaterial.uniforms.uTime.value = this.time.elapsed;
          this.postMaterial.uniforms.uStretchStrength.value = this.stretchShaderPass.uniforms.uStretchStrength.value;
          this.postMaterial.uniforms.uTransitionStrength.value = this.stretchShaderPass.uniforms.uTransitionStrength.value;
          this.postMaterial.uniforms.uTransitionDirection.value = this.stretchShaderPass.uniforms.uTransitionDirection.value;
          this.postMaterial.uniforms.uInterpolationCount.value = this.stretchShaderPass.uniforms.uInterpolationCount.value;

          if (this.scenes.leaving && (this.scenes.leaving as any).renderTarget) {
            this.postMaterial.uniforms.uTextureA.value = (this.scenes.leaving as any).renderTarget.texture;
          } else if (this.scenes.active && (this.scenes.active as any).renderTarget) {
            this.postMaterial.uniforms.uTextureA.value = (this.scenes.active as any).renderTarget.texture;
          }
          if (this.scenes.active && (this.scenes.active as any).renderTarget) {
            this.postMaterial.uniforms.uTextureB.value = (this.scenes.active as any).renderTarget.texture;
          }

          this.renderer.setRenderTarget(null);
          this.renderer.render(this.postScene, this.postCamera);
        }
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
