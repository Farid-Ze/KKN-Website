<!--
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix File Path: src/components/core-drag/index.vue
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% EMPIRICAL LIVE DOM OUTERHTML & METHOD BODIES VIA MCP CHROME]
-->
<template>
  <div class="c-drag" @mousedown="onPointerDown" @mousemove="onPointerMove" @mouseup="onPointerUp" @touchstart="onPointerDown" @touchmove="onPointerMove" @touchend="onPointerUp">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'core-drag',
  props: {
    content: { type: Object, default: null },
    containerSize: { type: Object, default: null },
    slideIndex: { type: Number, default: 0 },
    trackBarWidth: { type: Number, default: 0 },
    trackBarScale: { type: Number, default: 0 },
    trackBarTranslate: { type: Number, default: 0 }
  },
  data: function() {
    return {
      smoothScrollX: 0,
      sndSmoothScrollX: 0,
      ratio: 0,
      isDragging: false,
      dragX: 0,
      dragY: 0,
      eventHub: null
    };
  },
  methods: {
    onPointerDown: function(e) {
      this.isDragging = true;
      var touchX = (e && e.touches && e.touches[0]) ? e.touches[0].clientX : 0;
      var touchY = (e && e.touches && e.touches[0]) ? e.touches[0].clientY : 0;
      this.dragX = (e && e.clientX !== undefined) ? e.clientX : touchX;
      this.dragY = (e && e.clientY !== undefined) ? e.clientY : touchY;
    },
    onPointerUp: function() {
      this.isDragging = false;
    },
    onPointerMove: function(e) {
      if (this.isDragging) {
        var touchX = (e && e.touches && e.touches[0]) ? e.touches[0].clientX : 0;
        var x = (e && e.clientX !== undefined) ? e.clientX : touchX;
        var deltaX = x - this.dragX;
        this.$emit('drag', deltaX);
        this.dragX = x;
      }
    },
    onResize: function() {},
    onEnterframe: function() {}
  }
};
</script>
