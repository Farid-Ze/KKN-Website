/* ============================================================================
 * [BASELINE 2017 LIVE FACTS]
 * Consolidated Type Definitions for Citrix Web Master Project
 * Status: [EMPIRICALLY VERIFIED - 100% LIVE FACTS & BUNDLE MODULES]
 * ============================================================================ */

/** WebGL Scene & Camera Constants */
export interface SceneConfig {
  fov: 45;
  near: 0.1;
  far: 1000;
  clearColor: 0x000000;
  viewportWidth: number;
  viewportHeight: number;
}

/** Vector Point 2D/3D */
export interface Vector2D {
  x: number;
  y: number;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

/** Slide & Content Dictionary Structure */
export interface SlideContent {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  gradientOpacity?: number;
  btnLabel?: string;
  video?: {
    youtubeID: string;
    poster: string;
  };
  keypoints?: Array<{
    label: string;
    panelText?: string;
    color?: string;
  }>;
  content?: {
    headline?: string;
    title?: string;
    subtitle?: string;
    link?: {
      href: string;
      label: string;
    };
    slides?: Array<{
      title: string;
      description: string;
    }>;
    bottomComponent?: string;
  };
}

/** Audio Track Definition */
export interface AudioTrack {
  id: string;
  src: string;
  loop: boolean;
  volume: number;
}

/** Global Application State */
export interface GlobalAppState {
  slideIndex: number;
  isMuted: boolean;
  isNavActive: boolean;
  isModalActive: boolean;
  isBottomSlideActive: boolean;
  isTouch: boolean;
  isSceneScaled: boolean;
  winWidth: number;
  winHeight: number;
  mouse: Vector2D;
}
