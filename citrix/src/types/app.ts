/* ============================================================================
 * [BASELINE 2017 LIVE FACTS]
 * Extracted via Chrome DevTools MCP on https://thenewmobileworkforce.imm-g-prod.com/
 * ============================================================================ */

export interface Live2017ChildComponentPropsDataMap {
  appSoundManager: ['isMuted', 'isModalActive', 'isNavActive'];
  appModalVideo: ['slideIndex', 'isActive', 'isAutoplay', 'isBottomSlideActive'];
  appHeader: ['slideIndex'];
  appScenes: ['background', 'slideIndex', 'slideDragging', 'isNavActive', 'isLoaderActive', 'isBottomSlideActive', 'isModalActive', 'isTouch'];
  appSlideshow: ['background', 'slideIndex', 'isBottomSlideActive'];
  appNav: ['slideIndex', 'isActive'];
}

export interface Live2017WebGLBackgroundEngineInstance {
  isWebp: boolean;
  isTouch: boolean;
  canvas: HTMLCanvasElement;
  quality: 'high' | 'medium' | 'low';
  time: { elapsed: number; delta: number };
  sizes: { width: number; height: number };
  clearColor: { r: number; g: number; b: number };
  renderer: unknown;
  isFuzzyTransitionning: boolean;
  pending: boolean;
}

export interface Live2017RootVueVMData {
  /** Live Background Engine Instance */
  scenes: Live2017WebGLBackgroundEngineInstance | null;
  /** Viewport width in pixels (Default: 1920) */
  winWidth: number;
  /** Viewport height in pixels (Default: 889) */
  winHeight: number;
  /** Active chapter index (Default: 0) */
  slideIndex: number;
  /** Dragging status flag (Default: 0 / false) */
  slideDragging: number | boolean;
  /** Application ready flag (Default: true) */
  isReady: boolean;
  /** Touch device flag (Default: false) */
  isTouch: boolean;
  /** Navigation bar active flag (Default: false) */
  isNavActive: boolean;
  /** Preloader active flag (Default: false) */
  isLoaderActive: boolean;
  /** First loading flag (Default: false) */
  isFirstLoading: boolean;
  /** Global audio mute state (Default: false) */
  isMuted: boolean;
  /** Video modal active flag (Default: false) */
  isModalActive: boolean;
  /** Bottom slide drawer active flag (Default: false) */
  isBottomSlideActive: boolean;
  /** Scene scale status (Default: false) */
  isSceneScaled: boolean;
  /** 404 page active status (Default: false) */
  is404Active: boolean;
  /** Mouse pointer position and target lerp state */
  mouse: { x: number; y: number; targetX: number; targetY: number };
  /** Vue 2 EventHub Event Bus Instance */
  eventHub: { _events: Record<string, Function[]> };
}

/** Empirical constant default values snapshot extracted live from vm.$data */
export const LIVE_2017_ROOT_VUE_VM_DEFAULTS = {
  winWidth: 1920,
  winHeight: 889,
  slideIndex: 0,
  slideDragging: 0,
  isReady: true,
  isTouch: false,
  isNavActive: false,
  isLoaderActive: false,
  isFirstLoading: false,
  isMuted: false,
  isModalActive: false,
  isBottomSlideActive: false,
  isSceneScaled: false,
  is404Active: false,
  totalDataKeys: 17,
  totalRootMethods: 15,
  totalChildComponents: 8
} as const;

export interface Live2017RootVMMethods {
  onReady(): void;
  onSlideDragging(dragging: number | boolean): void;
  onKeyDown(e: KeyboardEvent): void;
  onToggleSceneScale(scaled?: boolean): void;
  onRouteChange(): void;
  onResize(): void;
  onEnterFrame(deltaSeconds: number, elapsedMs: number): void;
  onMouseMove(e: MouseEvent): void;
  onToggleNav(active?: boolean): void;
  onToggleSound(muted?: boolean): void;
  onToggleModal(active: boolean, videoId?: string): void;
  onToggleBottomSlide(active: boolean, actIndex?: number): void;
  onToggleCursorPointer(active: boolean): void;
  onHideLoader(): void;
  setMetas(): void;
}

export type Live2017RegisteredChildComponentTags =
  | 'AppLoader'
  | 'AppHeader'
  | 'AppScenes'
  | 'AppNav'
  | 'AppSlideshow'
  | 'AppSoundManager'
  | 'AppModalVideo'
  | 'AppPage404';
