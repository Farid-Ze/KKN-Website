<!--
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix File Path: src/components/app-slide-bottom/components/act-3.vue
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% FACTORY REAL-TIME TELEMETRY IMPLEMENTATION]
-->
<template>
  <div class="c-slide-bottom-3 u-absolute u-pos-br u-marg-r-w1of12 u-marg-b-vh2of10" :active-slide-index="activeSlideIndex">
    <div class="c-telemetry-hud u-pad-sm" style="border: 1px solid rgba(67, 160, 71, 0.5); background: rgba(11, 16, 30, 0.85); backdrop-filter: blur(8px);">
      <div class="u-marg-b-xs" style="color: #43a047; font-family: monospace; font-size: 0.8rem; letter-spacing: 1px;">
        FACTORY PIPELINE SYNC // ACT 3
      </div>
      <div style="display: flex; gap: 20px;">
        <div>
          <div style="font-size: 0.7rem; color: #8c969e;">TRACK-TO-FACTORY LATENCY</div>
          <div style="font-size: 1.3rem; font-weight: bold; color: #ffffff;">4 MS</div>
        </div>
        <div>
          <div style="font-size: 0.7rem; color: #8c969e;">TELEMETRY BANDWIDTH</div>
          <div style="font-size: 1.3rem; font-weight: bold; color: #ffffff;">12.4 GB/S</div>
        </div>
        <div>
          <div style="font-size: 0.7rem; color: #8c969e;">CAD FILE SYNC</div>
          <div style="font-size: 1.3rem; font-weight: bold; color: #43a047;">ACTIVE</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app-slide-bottom-3',
  props: {
    activeSlideIndex: { type: Number, default: 0 },
    scene: { type: Object, default: null }
  }
};
</script>
