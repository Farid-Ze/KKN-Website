<!--
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix File Path: src/components/app-slide-bottom/components/act-4.vue
 * Status: [EMPIRICALLY VERIFIED AUDIT]
-->
<template>
  <div class="c-slide-bottom-4 u-absolute u-pos-tl u-viewport-fit-h">
    <div
      v-for="(kp, i) in keypoints"
      :key="i"
      class="c-slide-bottom-4__keypoint u-absolute u-pos-tl"
      :style="{ transform: 'translateX(' + kp[0] + 'px) translateY(' + kp[1] + 'px) translateZ(0)' }"
      @mouseenter="onKeypointMouseenter(i)"
      @mouseleave="onKeypointMouseleave(i)"
    >
      <div class="c-slide-bottom-4__keypoint__panel o-wrapper--panel u-fit"></div>
      <span class="c-slide-bottom-4__keypoint__label t-text--xl u-absolute u-pos-y-center" :class="{ 'is-last': 2 === i }" v-html="data[i]"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app-slide-bottom-4',
  props: {
    scene: { type: Object, default: null }
  },
  data: function() {
    return {
      keypoints: [],
      data: ['Front Suspension', 'Front Wing', 'Rear Wing']
    };
  },
  methods: {
    onEnterFrame: function() {
      if (this.scene && this.scene.keypoints) {
        for (var e in this.scene.keypoints.values) {
          var idx = parseInt(e);
          var t = this.scene.keypoints.values[idx];
          if (void 0 === this.keypoints[idx]) {
            this.keypoints[idx] = [];
          }
          this.$set(this.keypoints, idx, [t[0], t[1]]);
        }
      }
    },
    onKeypointMouseenter: function(e) {
      if (this.scene && this.scene.activateElement) {
        this.scene.activateElement(e);
      }
    },
    onKeypointMouseleave: function() {
      if (this.scene && this.scene.deactivateElement) {
        this.scene.deactivateElement();
      }
    }
  }
};
</script>
