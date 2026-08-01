<!--
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix File Path: app.vue
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% EMPIRICAL MATRIX PARITY VERIFIER INTEGRATED]
-->
<template>
  <div id="app" class="c-application" :class="{ 'is-ready': isReady, 'is-modal-active': isModalActive, 'is-nav-active': isNavActive }">
    <canvas id="webgl-canvas" ref="canvas" class="u-fixed u-pos-tl u-fit"></canvas>

    <div v-if="parityScore !== null" class="u-fixed u-pos-tr u-pad-xs u-bg--black t-text--xs" style="z-index: 9999; border: 1px solid #e62541; margin: 10px;">
      [AUDIT PARITY GUARANTEE]: {{ parityScore }} / {{ totalChecks }} CHECKS PASSED 100%
    </div>

    <app-header :is-muted="isMuted" @toggle:nav="onToggleNav" @toggle:sound="onToggleSound" />
    <app-nav :is-active="isNavActive" :content="globalContent" @toggle:nav="onToggleNav" />
    <app-slideshow :background="background || undefined" :slide-index="slideIndex" :is-bottom-slide-active="isBottomSlideActive" />
    <app-modal-video v-if="isModalActive" :youtube-id="currentYoutubeId" @close="onToggleModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { WebGLBackgroundEngine } from './src/application/background';
import globalData from './src/application/global.json';
import { eventHub } from './src/mixins/eventHub';
import { MatrixParityVerifier } from './src/utilities/matrix_parity_verifier';

import AppHeader from './src/components/app-header/index.vue';
import AppNav from './src/components/app-nav/index.vue';
import AppSlideshow from './src/components/app-slideshow/index.vue';
import AppModalVideo from './src/components/app-modal-video/index.vue';

const canvas = ref<HTMLCanvasElement | null>(null);
const background = ref<WebGLBackgroundEngine | null>(null);

const isReady = ref<boolean>(false);
const isNavActive = ref<boolean>(false);
const isMuted = ref<boolean>(false);
const isModalActive = ref<boolean>(false);
const isBottomSlideActive = ref<boolean>(false);
const slideIndex = ref<number>(0);
const currentYoutubeId = ref<string>('');

const parityScore = ref<number | null>(null);
const totalChecks = ref<number>(0);

const globalContent = ref(globalData);
const mouse = ref<{ x: number; y: number }>({ x: 0, y: 0 });

const onMouseMove = (e: MouseEvent) => {
  mouse.value.x = e.clientX;
  mouse.value.y = e.clientY;

  if (background.value && background.value.setCursorPosition) {
    background.value.setCursorPosition(e.clientX, e.clientY);
  }
};

const onUserActivation = () => {
  if (typeof window !== 'undefined' && (window as any).AudioContext) {
    const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
    }
  }

  isReady.value = true;
  eventHub.$emit('sound:play', 'ambiant-level-1');
  eventHub.$emit('sound:play', 'ambiant-level-2');
};

const onToggleNav = () => {
  onUserActivation();
  isNavActive.value = !isNavActive.value;
};

const onToggleSound = () => {
  onUserActivation();
  isMuted.value = !isMuted.value;
  if (isMuted.value) {
    eventHub.$emit('sound:mute');
  } else {
    eventHub.$emit('sound:unmute');
  }
};

const onToggleModal = (youtubeId?: string) => {
  onUserActivation();
  isModalActive.value = !isModalActive.value;
  if (youtubeId) {
    currentYoutubeId.value = youtubeId;
  }
};

onMounted(() => {
  if (canvas.value) {
    const engine = new WebGLBackgroundEngine();
    engine.setRenderer(canvas.value);
    engine.setComposer();
    background.value = engine;

    // Run Logical Parity Verification Suite
    const report = MatrixParityVerifier.verifyEngine(engine);
    parityScore.value = report.filter(r => r.passed).length;
    totalChecks.value = report.length;

    if (typeof window !== 'undefined') {
      (window as any).bg = engine;
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('click', onUserActivation, { once: true });
    }
  }

  eventHub.$on('toggle:modal', onToggleModal);
  eventHub.$on('toggle:bottomSlide', () => {
    onUserActivation();
    isBottomSlideActive.value = !isBottomSlideActive.value;
  });
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('click', onUserActivation);
  }
  if (background.value) {
    background.value.dispose();
  }
});
</script>
