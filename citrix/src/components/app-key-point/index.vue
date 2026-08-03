<!--
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix File Path: src/components/app-key-point/index.vue
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% EMPIRICAL LIVE DOM OUTERHTML & METHOD BODIES VIA MCP CHROME]
-->
<template>
  <div class="c-keypoint u-absolute u-pos-tl u-shape-circle u-hide@sm" :class="{ 'is-active': isKeyPointActive }">
    <button class="c-keypoint__btn t-btn o-wrapper--panel u-fit js-btn" @click="onClick">
      <div class="c-keypoint__circle o-wrapper--panel u-fit js-circle"></div>
      <div class="c-keypoint__line u-absolute js-line">
        <div class="c-keypoint__line__panel o-wrapper--panel u-fit js-line-panel"></div>
      </div>
      <div class="u-align-left u-pointer-none js-content">
        <span class="c-keypoint__label t-text t-text--medium u-force-inline u-inline-block u-marg-b-xs js-label" v-if="content">{{ content.label }}</span>
        <span class="c-keypoint__content t-text u-block u-color--gray-light" v-if="content">{{ content.content || content.panelText }}</span>
      </div>
    </button>
  </div>
</template>

<script>
import { getAbsoluteBoundingRect } from '../../utilities/getAbsoluteBoundingRect';

export default {
  name: 'app-key-point',
  props: {
    content: { type: Object, default: null },
    position: { type: Array, default: null },
    isActive: { type: Boolean, default: false },
    index: { type: Number, default: 0 }
  },
  data: function() {
    return {
      isKeyPointActive: false,
      eventHub: null
    };
  },
  methods: {
    onResize: function() {
      if (this.$root) {
        this._boxSize = 0.07 * this.$root.winWidth;
      }
      if (this.$el) {
        this._width = this.$el.offsetWidth;
        if (!this._circle) this._circle = { x: 0, y: 0 };
        if (!this._label) this._label = { x: 0, y: 0 };
        this._circle.x = getAbsoluteBoundingRect(this.$el).left + 0.5 * this.$el.offsetWidth;
        this._circle.y = getAbsoluteBoundingRect(this.$el).top + 0.5 * this.$el.offsetHeight;
        this._label.x = getAbsoluteBoundingRect(this.$el).left;
        this._label.y = getAbsoluteBoundingRect(this.$el).top;
      }
    },
    onActiveChange: function() {
      var e = this;
      if (this.isActive) {
        setTimeout(function() {
          e.onResize();
        }, 1400);
      }
    },
    onClick: function() {},
    tick: function() {
      this.onEnterFrame();
      this._rafId = requestAnimationFrame(this.tick);
    },
    onEnterFrame: function() {
      var bg = (typeof window !== 'undefined' && window.bg) || (this.$root && this.$root.background);
      var mouse = (typeof window !== 'undefined' && window.mouse) || (this.$root && this.$root.mouse) || { x: 0, y: 0 };
      var isTouch = (this.$root && this.$root.isTouch) || false;

      if (!isTouch && this.isActive) {
        var pos = null;
        if (bg && bg.scenes && bg.scenes.active && bg.scenes.active.keypoints && bg.scenes.active.keypoints.positions && bg.scenes.active.keypoints.positions[this.index]) {
          pos = bg.scenes.active.keypoints.positions[this.index];
        } else if (this.content && this.content.position && Array.isArray(this.content.position)) {
          pos = { x: this.content.position[0] / 100, y: this.content.position[1] / 100 };
        } else if (this.position && Array.isArray(this.position)) {
          pos = { x: this.position[0] / 100, y: this.position[1] / 100 };
        }

        if (pos && this.$el) {
          this.$el.style.transform = 'translateX(' + Math.round(100 * pos.x * 100) / 100 + 'vw) translateY(' + Math.round(100 * pos.y * 100) / 100 + 'vh) translateZ(0)';
        }

        if (!this._smoothMouse) this._smoothMouse = { x: 0, y: 0 };
        if (!this._lineScale) this._lineScale = { x: 0, y: 0, smoothX: 0, smoothY: 0 };
        if (!this._circle) this._circle = { x: 0, y: 0 };
        if (!this._label) this._label = { x: 0, y: 0 };

        this._smoothMouse.x += 0.14 * (mouse.x - this._smoothMouse.x);
        this._smoothMouse.y += 0.14 * (mouse.y - this._smoothMouse.y);
        this._angle = Math.atan2(this._smoothMouse.x - this._circle.x, -(this._smoothMouse.y - this._circle.y)) * (180 / Math.PI);

        if (this.$btn) this.$btn.style.transform = 'translateX(' + (10 * this._lineScale.smoothX).toFixed(2) + 'px) translateY(' + (10 * this._lineScale.smoothY).toFixed(2) + 'px) translateZ(0)';
        if (this.$line) this.$line.style.transform = 'rotate(' + this._angle.toFixed(2) + 'deg) scaleY(' + (1 * Math.max(Math.abs(this._lineScale.smoothX), Math.abs(this._lineScale.smoothY))).toFixed(2) + ') translateZ(0)';
        if (this.$circle) this.$circle.style.transform = 'scale(' + Math.round(100 * (1 - 0.2 * Math.max(Math.abs(this._lineScale.smoothX), Math.abs(this._lineScale.smoothY)))) / 100 + ') translateZ(0)';

        if (mouse.x > this._circle.x - this._boxSize && mouse.x < this._circle.x + this._boxSize && mouse.y > this._circle.y - this._boxSize && mouse.y < this._circle.y + this._boxSize) {
          this._lineScale.x = (mouse.x - this._circle.x) / (this._boxSize || 1);
          this._lineScale.y = (mouse.y - this._circle.y) / (this._boxSize || 1);
          if (this.$content) this.$content.style.transform = 'translateX(' + Math.round(100 * (this._smoothMouse.x - this._label.x)) / 100 + 'px) translateY(' + Math.round(100 * (this._smoothMouse.y - this._label.y)) / 100 + 'px) translateZ(0)';
          if (!this.isKeyPointActive) {
            this.isKeyPointActive = true;
            if (this.$el && (!this.$root || !this.$root.isSceneScaled)) {
              this.$el.classList.add('is-active');
            }
          }
        } else if (this.isKeyPointActive && (!this.$root || !this.$root.isSceneScaled)) {
          this._lineScale.x = 0;
          this._lineScale.y = 0;
          this.isKeyPointActive = false;
          if (this.$el) {
            this.$el.classList.remove('is-active');
          }
        }
        this._lineScale.smoothX += 0.1 * (this._lineScale.x - this._lineScale.smoothX);
        this._lineScale.smoothY += 0.1 * (this._lineScale.y - this._lineScale.smoothY);
      }
    }
  },
  mounted: function() {
    if (this.$el) {
      this.$btn = this.$el.querySelector('.js-btn');
      this.$circle = this.$el.querySelector('.js-circle');
      this.$line = this.$el.querySelector('.js-line');
      this.$content = this.$el.querySelector('.js-content');
    }
    this._rafId = requestAnimationFrame(this.tick);
  },
  beforeUnmount: function() {
    if (this._rafId) cancelAnimationFrame(this._rafId);
  }
};
</script>
