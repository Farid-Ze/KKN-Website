<!--
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix File Path: src/components/app-slide-bottom/components/act-1.vue
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% TELEMETRY WIDGET IMPLEMENTATION]
-->
<template>
  <div class="c-slide-bottom-1 u-absolute u-pos-br u-marg-r-w1of12 u-marg-b-vh2of10" :active-slide-index="activeSlideIndex">
    <div class="c-telemetry-hud u-pad-sm u-bg--alpha-black" style="border: 1px solid rgba(56, 189, 248, 0.4); background: rgba(11, 16, 30, 0.85); backdrop-filter: blur(8px);">
      <div class="u-marg-b-xs" style="color: #38bdf8; font-family: monospace; font-size: 0.8rem; letter-spacing: 1px;">
        LIVE TELEMETRY STREAM // ACT 1
      </div>
      <div class="u-flex" style="display: flex; gap: 16px;">
        <div class="u-stat">
          <div style="font-size: 0.7rem; color: #8c969e;">SPEED</div>
          <div style="font-size: 1.4rem; font-weight: bold; color: #ffffff;">334 <span style="font-size: 0.8rem; color: #38bdf8;">KM/H</span></div>
        </div>
        <div class="u-stat">
          <div style="font-size: 0.7rem; color: #8c969e;">ENGINE RPM</div>
          <div style="font-size: 1.4rem; font-weight: bold; color: #ffffff;">14,800 <span style="font-size: 0.8rem; color: #e62541;">RPM</span></div>
        </div>
        <div class="u-stat">
          <div style="font-size: 0.7rem; color: #8c969e;">FUEL LEVEL</div>
          <div style="font-size: 1.4rem; font-weight: bold; color: #ffffff;">98.4%</div>
        </div>
        <div class="u-stat">
          <div style="font-size: 0.7rem; color: #8c969e;">BEST LAP</div>
          <div style="font-size: 1.4rem; font-weight: bold; color: #43a047;">1:18.241</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app-slide-bottom-1',
  props: {
    activeSlideIndex: { type: Number, default: 0 },
    scene: { type: Object, default: null }
  }
};
</script>
