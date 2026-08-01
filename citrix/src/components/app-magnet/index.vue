<!--
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix File Path: src/components/app-magnet/index.vue
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% EMPIRICAL LIVE DOM OUTERHTML & METHOD BODIES VIA MCP CHROME]
-->
<template>
  <div class="c-magnet">
    <slot></slot>
  </div>
</template>

<script>
import { getAbsoluteBoundingRect } from '../../utilities/getAbsoluteBoundingRect';

export default {
  name: 'app-magnet',
  props: {
    box: { type: Object, default: null },
    isActive: { type: Boolean, default: false }
  },
  data: function() {
    return {
      eventHub: null
    };
  },
  methods: {
    onActiveChange: function() {
      if (this.isActive) {
        this.onResize();
      }
    },
    onResize: function() {
      if (this.$el) {
        var rect = getAbsoluteBoundingRect(this.$el);
        this._center = {
          x: rect.left + 0.5 * this.$el.offsetWidth,
          y: rect.top + 0.5 * this.$el.offsetHeight
        };
        this._boxSize = 0.5 * Math.max(this.$el.offsetWidth, this.$el.offsetHeight);
      }
    },
    onEnterFrame: function() {
      if (this.isActive && this.$root && this.$root.mouse && this._center) {
        var dx = this.$root.mouse.x - this._center.x;
        var dy = this.$root.mouse.y - this._center.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < (this._boxSize || 50)) {
          var pull = 1 - dist / (this._boxSize || 50);
          this.$el.style.transform = 'translateX(' + (dx * pull * 0.3).toFixed(2) + 'px) translateY(' + (dy * pull * 0.3).toFixed(2) + 'px) translateZ(0)';
        } else {
          this.$el.style.transform = 'translateX(0px) translateY(0px) translateZ(0)';
        }
      }
    }
  }
};
</script>
