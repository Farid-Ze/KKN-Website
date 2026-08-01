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
    onEnterFrame: function() {
      if (this.$root && !this.$root.isTouch && this.isActive && this.$root.background && this.$root.background.scenes && 0 === this.$root.background.scenes.currentLevel) {
        if ('ready' === this.$root.background.state && this.$root.background.scenes.active && this.$root.background.scenes.active.keypoints && this.$root.background.scenes.active.keypoints.positions[this.index]) {
          var pos = this.$root.background.scenes.active.keypoints.positions[this.index];
          this.$el.style.transform = 'translateX(' + Math.round(100 * pos.x * 100) / 100 + 'vw) translateY(' + Math.round(100 * pos.y * 100) / 100 + 'vh) translateZ(0)';
        }

        if (!this._smoothMouse) this._smoothMouse = { x: 0, y: 0 };
        if (!this._lineScale) this._lineScale = { x: 0, y: 0, smoothX: 0, smoothY: 0 };
        if (!this._circle) this._circle = { x: 0, y: 0 };
        if (!this._label) this._label = { x: 0, y: 0 };

        this._smoothMouse.x += 0.14 * (this.$root.mouse.x - this._smoothMouse.x);
        this._smoothMouse.y += 0.14 * (this.$root.mouse.y - this._smoothMouse.y);
        this._angle = Math.atan2(this._smoothMouse.x - this._circle.x, -(this._smoothMouse.y - this._circle.y)) * (180 / Math.PI);

        if (this.$btn) this.$btn.style.transform = 'translateX(' + (10 * this._lineScale.smoothX).toFixed(2) + 'px) translateY(' + (10 * this._lineScale.smoothY).toFixed(2) + 'px) translateZ(0)';
        if (this.$line) this.$line.style.transform = 'rotate(' + this._angle.toFixed(2) + 'deg) scaleY(' + (1 * Math.max(Math.abs(this._lineScale.smoothX), Math.abs(this._lineScale.smoothY))).toFixed(2) + ') translateZ(0)';
        if (this.$circle) this.$circle.style.transform = 'scale(' + Math.round(100 * (1 - 0.2 * Math.max(Math.abs(this._lineScale.smoothX), Math.abs(this._lineScale.smoothY)))) / 100 + ') translateZ(0)';

        if (this.$root.mouse.x > this._circle.x - this._boxSize && this.$root.mouse.x < this._circle.x + this._boxSize && this.$root.mouse.y > this._circle.y - this._boxSize && this.$root.mouse.y < this._circle.y + this._boxSize) {
          this._lineScale.x = (this.$root.mouse.x - this._circle.x) / (this._boxSize || 1);
          this._lineScale.y = (this.$root.mouse.y - this._circle.y) / (this._boxSize || 1);
          if (this.$content) this.$content.style.transform = 'translateX(' + Math.round(100 * (this._smoothMouse.x - this._label.x)) / 100 + 'px) translateY(' + Math.round(100 * (this._smoothMouse.y - this._label.y)) / 100 + 'px) translateZ(0)';
          if (!this.isKeyPointActive) {
            this.isKeyPointActive = true;
            if (!this.$root.isSceneScaled) {
              this.$el.classList.add('is-active');
            }
          }
        } else if (this.isKeyPointActive && !this.$root.isSceneScaled) {
          this._lineScale.x = 0;
          this._lineScale.y = 0;
          this.isKeyPointActive = false;
          this.$el.classList.remove('is-active');
        }
        this._lineScale.smoothX += 0.1 * (this._lineScale.x - this._lineScale.smoothX);
        this._lineScale.smoothY += 0.1 * (this._lineScale.y - this._lineScale.smoothY);
      }
    }
  }
};
</script>
