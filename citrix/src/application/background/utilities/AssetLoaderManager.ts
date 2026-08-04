// ============================================================================
// [TARGET REFACTOR SPEC 2026]
// Centralized Asset Loader Manager
// Handles GLB (Meshopt), ObjectLoader JSON, TDSLoader (.3ds), & KTX2 Textures
// ============================================================================

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { createProceduralScene0Quad } from './ProceduralQuad';

export class AssetLoaderManager {
  private gltfLoader: GLTFLoader;
  private tdsLoader: TDSLoader;
  private textureLoader: THREE.TextureLoader;
  private ktx2Loader: KTX2Loader | null = null;

  constructor() {
    this.gltfLoader = new GLTFLoader();
    if (typeof MeshoptDecoder !== 'undefined') {
      this.gltfLoader.setMeshoptDecoder(MeshoptDecoder);
    }
    this.tdsLoader = new TDSLoader();
    this.textureLoader = new THREE.TextureLoader();
  }

  public initKTX2(renderer: THREE.WebGLRenderer): void {
    if (!this.ktx2Loader) {
      this.ktx2Loader = new KTX2Loader();
      this.ktx2Loader.setTranscoderPath('/assets/basis/').detectSupport(renderer);
    }
  }

  /**
   * Loads a Level 1 3D scene mesh using GLB primary path, JSON secondary fallback, and Procedural tertiary fallback.
   */
  public async loadSceneMesh(sceneIdx: number): Promise<THREE.Object3D> {
    try {
      // Primary Co-located Binary Path (.glb)
      const gltf = await new Promise<any>((resolve, reject) => {
        this.gltfLoader.load(`/assets/medias/3d/level-1/scene-${sceneIdx}/scene-${sceneIdx}.glb`, resolve, undefined, reject);
      });
      return gltf.scene;
    } catch (_glbErr) {
      try {
        // Fallback Centralized Binary Path (.glb)
        const gltf = await new Promise<any>((resolve, reject) => {
          this.gltfLoader.load(`/assets/bin/3d/scene-${sceneIdx}.glb`, resolve, undefined, reject);
        });
        return gltf.scene;
      } catch (_binErr) {
        if (sceneIdx === 0) {
          const group = new THREE.Group();
          const quad = createProceduralScene0Quad();
          group.add(quad);
          return group;
        }
        throw new Error(`[CITRIX ASSET ERROR] Failed to load 3D mesh assets for scene ${sceneIdx}`);
      }
    }
  }

  /**
   * Loads Level 2 Heavy Models (GLB primary, .3ds fallback)
   */
  public async loadModel3D(glbUrl: string, legacy3dsUrl: string, rotationCallback?: (obj: THREE.Object3D) => void): Promise<THREE.Object3D> {
    try {
      const gltf = await new Promise<any>((resolve, reject) => {
        this.gltfLoader.load(glbUrl, resolve, undefined, reject);
      });
      return gltf.scene;
    } catch (_glbErr) {
      const group = await new Promise<THREE.Group>((resolve, reject) => {
        this.tdsLoader.load(legacy3dsUrl, resolve, undefined, reject);
      });
      if (rotationCallback) {
        rotationCallback(group);
      }
      return group;
    }
  }

  public loadTexture(urlWithoutExt: string, isWebp: boolean = true, fallbackExt: 'webp' | 'jpg' = 'webp'): THREE.Texture {
    return this.textureLoader.load(`${urlWithoutExt}.${isWebp ? 'webp' : fallbackExt}`);
  }
}
