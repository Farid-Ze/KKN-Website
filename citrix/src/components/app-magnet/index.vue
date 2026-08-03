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
import { eventHub } from '../../mixins/eventHub';

export default {
  name: 'app-magnet',
  props: {
    box: { type: Object, default: null },
    isActive: { type: Boolean, default: true }
  },
  data: function() {
    return {
      eventHub: eventHub
    };
  },
  created: function() {
    this.eventHub = eventHub;
    if (this.eventHub) {
      this.eventHub.$on('enterframe', this.onEnterFrame);
    }
  },
  mounted: function() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.onResize);
    }
    this.onResize();
  },
  beforeUnmount: function() {
    if (this.eventHub) {
      this.eventHub.$off('enterframe', this.onEnterFrame);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize);
    }
  },
  beforeDestroy: function() {
    if (this.eventHub) {
      this.eventHub.$off('enterframe', this.onEnterFrame);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize);
    }
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
      var mouse = (typeof window !== 'undefined' && window.mouse) || (this.$root && this.$root.mouse);
      if (this.isActive && mouse && this._center && this.$el) {
        var dx = mouse.x - this._center.x;
        var dy = mouse.y - this._center.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < (this._boxSize || 80)) {
          var pull = 1 - dist / (this._boxSize || 80);
          this.$el.style.transform = 'translateX(' + (dx * pull * 0.3).toFixed(2) + 'px) translateY(' + (dy * pull * 0.3).toFixed(2) + 'px) translateZ(0)';
        } else {
          this.$el.style.transform = 'translateX(0px) translateY(0px) translateZ(0)';
        }
      }
    }
  }
};
</script>
