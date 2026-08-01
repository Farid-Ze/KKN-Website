<!--
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix File Path: src/components/app-slide-btn-more/index.vue
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% EMPIRICAL LIVE DOM OUTERHTML & METHOD BODIES VIA MCP CHROME]
-->
<template>
  <button class="c-slide__icon-more t-btn u-inline-block u-absolute u-pos-t u-marg-l-xxs u-valign-top u-shape-circle u-marg-t-xs u-marg-t-0@sm">
    <div class="c-slide__icon-more__container u-absolute u-pos-center">
      <div class="c-slide__icon-more__bar u-absolute u-bg--white"></div>
      <div class="c-slide__icon-more__bar u-absolute u-bg--white"></div>
    </div>
    <img src="/assets/medias/images/gradient-circle.svg" class="c-slide__icon-more__gradient o-wrapper--panel u-fit">
  </button>
</template>

<script>
import { getAbsoluteBoundingRect } from '../../utilities/getAbsoluteBoundingRect';

export default {
  name: 'app-slide-btn-more',
  props: {
    isActive: { type: Boolean, default: false }
  },
  data: function() {
    return {
      eventHub: null
    };
  },
  methods: {
    onActiveChange: function() {
      var e = this;
      if (this.isActive) {
        setTimeout(function() {
          e.onResize();
        }, 1000);
      }
    },
    onResize: function() {
      if (this.$el) {
        if (!this._position) this._position = { x: 0, y: 0 };
        this._position.x = getAbsoluteBoundingRect(this.$el).left + 0.5 * this.$el.offsetWidth;
        this._position.y = getAbsoluteBoundingRect(this.$el).top + 0.5 * this.$el.offsetHeight;
      }
    },
    onEnterFrame: function() {
      if (this.$root && !this.$root.isTouch && this.$root.mouse && this.$el) {
        if (!this._position) this._position = { x: 0, y: 0 };
        if (!this._ratio) this._ratio = { x: 0, y: 0, smoothX: 0, smoothY: 0 };

        this._ratio.smoothX += 0.12 * (this._ratio.x - this._ratio.smoothX);
        this._ratio.smoothY += 0.12 * (this._ratio.y - this._ratio.smoothY);
        this.$el.style.transform = 'translateX(' + (50 * this._ratio.smoothX).toFixed(2) + 'px) translateY(' + (50 * this._ratio.smoothY).toFixed(2) + 'px) scale(' + (1 + 0.5 * Math.max(Math.abs(this._ratio.smoothX), Math.abs(this._ratio.smoothY))).toFixed(2) + ') translateZ(0)';

        if (this.$root.mouse.x > this._position.x - 50 && this.$root.mouse.x < this._position.x + 50 && this.$root.mouse.y > this._position.y - 50 && this.$root.mouse.y < this._position.y + 50) {
          this._ratio.x = (this.$root.mouse.x - this._position.x) / 50;
          this._ratio.y = (this.$root.mouse.y - this._position.y) / 50;
          if (!this._isHover) {
            this._isHover = true;
            this.$el.classList.add('is-hover');
          }
        } else {
          this._ratio.x = 0;
          this._ratio.y = 0;
          if (this._isHover) {
            this._isHover = false;
            this.$el.classList.remove('is-hover');
          }
        }
      }
    }
  }
};
</script>
