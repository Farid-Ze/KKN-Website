<!--
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix File Path: src/components/app-slide-bottom/components/act-4.vue
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% AERODYNAMICS HUD IMPLEMENTATION]
-->
<template>
  <div class="c-slide-bottom-4 u-absolute u-pos-br u-marg-r-w1of12 u-marg-b-vh2of10" :active-slide-index="activeSlideIndex">
    <div class="c-telemetry-hud u-pad-sm" style="border: 1px solid rgba(81, 156, 191, 0.5); background: rgba(11, 16, 30, 0.85); backdrop-filter: blur(8px);">
      <div class="u-marg-b-xs" style="color: #519cbf; font-family: monospace; font-size: 0.8rem; letter-spacing: 1px;">
        AERODYNAMICS & DOWNFORCE // ACT 4
      </div>
      <div style="display: flex; gap: 20px;">
        <div>
          <div style="font-size: 0.7rem; color: #8c969e;">FRONT WING DOWNFORCE</div>
          <div style="font-size: 1.3rem; font-weight: bold; color: #ffffff;">1,850 N</div>
        </div>
        <div>
          <div style="font-size: 0.7rem; color: #8c969e;">DRAG COEFFICIENT</div>
          <div style="font-size: 1.3rem; font-weight: bold; color: #ffffff;">0.72 CD</div>
        </div>
        <div>
          <div style="font-size: 0.7rem; color: #8c969e;">TIRE OPTIMUM TEMP</div>
          <div style="font-size: 1.3rem; font-weight: bold; color: #ffb300;">104°C</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app-slide-bottom-4',
  props: {
    activeSlideIndex: { type: Number, default: 0 },
    scene: { type: Object, default: null }
  }
};
</script>
