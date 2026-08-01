<!--
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix File Path: src/components/app-scenes/index.vue
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% EMPIRICAL LIVE DOM OUTERHTML & METHOD BODIES VIA MCP CHROME]
-->
<template>
  <div class="c-scenes u-absolute u-pos-tl u-fit u-overflow-h">
    <div class="c-scenes__level-2-background u-absolute u-pos-tl u-fit u-bg-black"></div>
    <canvas width="1920" height="889" class="c-scenes__canvas u-absolute u-fit u-pos-tl" style="width: 1920px; height: 889px;"></canvas>
  </div>
</template>

<script>
export default {
  name: 'app-scenes',
  props: {
    background: { type: Object, default: null },
    slideIndex: { type: Number, default: 0 },
    slideDragging: { type: Number, default: 0 },
    isNavActive: { type: Boolean, default: false },
    isLoaderActive: { type: Boolean, default: false },
    isBottomSlideActive: { type: Boolean, default: false },
    isModalActive: { type: Boolean, default: false },
    isTouch: { type: Boolean, default: false }
  },
  data: function() {
    return {
      dragStretch: { value: 0, target: 0 },
      slideJustChange: false,
      eventHub: null
    };
  },
  methods: {
    onSlideIndexChange: function() {
      var e = this;
      this.slideJustChange = true;
      window.requestAnimationFrame(function() {
        e.slideJustChange = false;
      });
      if (this.background && this.background.goTo) {
        this.background.goTo(this.slideIndex);
      }
    },
    onSlideDraggingChange: function(e) {
      var t = Math.abs(e);
      if (0 !== t) {
        t = 0.5 * t + 0.5;
      }
      this.dragStretch.target = t;
    },
    onNavActiveChange: function() {
      if (this.background) {
        if (this.isNavActive && this.background.goFuzzy) {
          this.background.goFuzzy();
        } else if (!this.slideJustChange && this.background.leaveFuzzy) {
          this.background.leaveFuzzy();
        }
      }
    },
    onLoaderActiveChange: function() {
      if (!this.isLoaderActive && this.background && this.background.scenes && this.background.scenes.active) {
        this.background.scenes.active.enter('down', 2, 0.4);
      }
    },
    onModalActiveChange: function() {
      if (this.background && this.background.scenes && this.background.scenes.active) {
        if (this.isModalActive) {
          this.background.scenes.active.leave('down', 1, 0);
        } else {
          this.background.scenes.active.enter('down', 1, 0.15);
        }
      }
    },
    onBottomSlideActiveChange: function() {
      var e = this;
      if (this.background && this.background.scenes && this.background.scenes.active) {
        if (this.isBottomSlideActive) {
          this.background.scenes.active.leave('down', 1.5, 0);
          window.setTimeout(function() {
            if (e.isBottomSlideActive && e.background && e.background.scenes && e.background.scenes.active) {
              e.background.goTo(e.background.scenes.active.index, 1, 0);
              e.background.scenes.active.enter('up', 1, 0.5);
            }
          }, 600);
        } else {
          this.background.scenes.active.leave('up', 1.5, 0);
          window.setTimeout(function() {
            if (e.background && e.background.scenes && e.background.scenes.active) {
              e.background.goTo(e.background.scenes.active.index, 0, 0);
              e.background.scenes.active.enter('down', 1, 0.15);
            }
          }, 800);
        }
      }
    },
    onEnterframe: function(e) {
      var delta = e && e.delta ? e.delta : 1;
      this.dragStretch.value += 0.003 * (this.dragStretch.target - this.dragStretch.value) * delta;
      if (this.background && !this.isNavActive && !this.background.isFuzzyTransitionning && 'leaving' !== this.background.state && 'arriving' !== this.background.state) {
        if (this.background.stretchShaderPass && this.background.stretchShaderPass.uniforms && this.background.stretchShaderPass.uniforms.uStretchStrength) {
          this.background.stretchShaderPass.uniforms.uStretchStrength.value = this.dragStretch.value;
        }
      }
    }
  }
};
</script>
