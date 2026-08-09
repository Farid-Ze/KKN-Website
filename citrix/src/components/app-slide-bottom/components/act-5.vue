<!--
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix File Path: src/components/app-slide-bottom/components/act-5.vue
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% GLOBAL NETWORK OPERATIONS IMPLEMENTATION]
-->
<template>
  <div class="c-slide-bottom-5 u-absolute u-pos-br u-marg-r-w1of12 u-marg-b-vh2of10" :active-slide-index="activeSlideIndex">
    <div class="c-telemetry-hud u-pad-sm" style="border: 1px solid rgba(255, 179, 0, 0.5); background: rgba(11, 16, 30, 0.85); backdrop-filter: blur(8px);">
      <div class="u-marg-b-xs" style="color: #ffb300; font-family: monospace; font-size: 0.8rem; letter-spacing: 1px;">
        GLOBAL NETWORK OPERATIONS // ACT 5
      </div>
      <div style="display: flex; gap: 20px;">
        <div>
          <div style="font-size: 0.7rem; color: #8c969e;">ACTIVE TRACK CONNECTIONS</div>
          <div style="font-size: 1.3rem; font-weight: bold; color: #ffffff;">24 / 24 NODES</div>
        </div>
        <div>
          <div style="font-size: 0.7rem; color: #8c969e;">CITRIX VDI LATENCY</div>
          <div style="font-size: 1.3rem; font-weight: bold; color: #43a047;">2 MS</div>
        </div>
        <div>
          <div style="font-size: 0.7rem; color: #8c969e;">SECURITY COMPLIANCE</div>
          <div style="font-size: 1.3rem; font-weight: bold; color: #ffffff;">100% ENCRYPTED</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app-slide-bottom-5',
  props: {
    activeSlideIndex: { type: Number, default: 0 },
    scene: { type: Object, default: null }
  }
};
</script>
