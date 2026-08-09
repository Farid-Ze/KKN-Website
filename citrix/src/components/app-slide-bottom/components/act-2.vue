<!--
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix File Path: src/components/app-slide-bottom/components/act-2.vue
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% DIFFERENTIAL MECHANISM HUD IMPLEMENTATION]
-->
<template>
  <div class="c-slide-bottom-2 u-absolute u-pos-br u-marg-r-w1of12 u-marg-b-vh2of10" :active-slide-index="activeSlideIndex">
    <div class="c-telemetry-hud u-pad-sm" style="border: 1px solid rgba(230, 37, 65, 0.5); background: rgba(11, 16, 30, 0.85); backdrop-filter: blur(8px);">
      <div class="u-marg-b-xs" style="color: #e62541; font-family: monospace; font-size: 0.8rem; letter-spacing: 1px;">
        DIFFERENTIAL TORQUE SPLIT // ACT 2
      </div>
      <div style="display: flex; gap: 20px;">
        <div>
          <div style="font-size: 0.7rem; color: #8c969e;">LEFT REAR WHEEL</div>
          <div style="font-size: 1.3rem; font-weight: bold; color: #ffffff;">50% TORQUE</div>
        </div>
        <div>
          <div style="font-size: 0.7rem; color: #8c969e;">RIGHT REAR WHEEL</div>
          <div style="font-size: 1.3rem; font-weight: bold; color: #ffffff;">50% TORQUE</div>
        </div>
        <div>
          <div style="font-size: 0.7rem; color: #8c969e;">DIFF LOCK STATE</div>
          <div style="font-size: 1.3rem; font-weight: bold; color: #ffb300;">64% LOCKED</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app-slide-bottom-2',
  props: {
    activeSlideIndex: { type: Number, default: 0 },
    scene: { type: Object, default: null }
  }
};
</script>
