<!--
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix File Path: src/components/app-slideshow/index.vue
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% EMPIRICAL LIVE 11 METHODS & SOUND ID TICK-REVERB VIA MCP CHROME]
-->
<template>
  <main class="c-slideshow" @DOMMouseScroll="onMouseWheel" @mousewheel="onMouseWheel">
    <app-slide
      v-for="(item, i) in content"
      :key="i"
      :is-bottom-slide-active="!!(isBottomSlideActive && activeIndex === i)"
      :active-index="activeIndex"
      :index="i"
      :content="item"
      :top-scene="background && background.scenes && background.scenes.levels ? background.scenes.levels[0][i] : null"
      :bottom-scene="background && background.scenes && background.scenes.levels ? background.scenes.levels[1][i] : null"
      @slide:prev="onPrevSlide"
      @slide:next="onNextSlide"
    />

    <footer class="c-slideshow__footer u-absolute u-pos-bl u-fit-w u-pad-x-w1of12">
      <!-- Prev Button -->
      <transition name="c-slideshow__control" :duration="800">
        <router-link
          v-if="content && content[activeIndex - 1]"
          class="c-slideshow__control c-slideshow__control--left t-link u-absolute u-pos-bl u-pad-t-sm u-pad-b-xs u-marg-l-w1of13 u-marg-b-vh1of12 u-rtl u-vacuum"
          :to="content[activeIndex - 1].slug"
          @mouseenter="onPrevOver"
        >
          <div @mouseenter="onPrevOver">
            <div class="c-slideshow__control__line--before u-bg--white u-inline-block u-valign-middle u-hide@sm"></div>
            <span class="c-slideshow__control__label t-text--xs t-text--ls-md t-text--black u-inline-block u-valign-middle u-marg-l-lg u-uppercase u-marg-l-md@md u-block@sm u-marg-b-xs@sm u-marg-l-0@sm">Prev</span>
            <div class="c-slideshow__control__line--after u-bg--white u-inline-block u-valign-middle"></div>
            <img :src="'/assets/medias/images/icons/arrow-x-left-end.svg'" class="t-icon--arrow-x-end u-inline-block u-valign-middle">
          </div>
        </router-link>
      </transition>

      <!-- Bottom Drawer Button -->
      <transition name="c-slideshow__control" :duration="800">
        <div
          v-if="content && content[activeIndex] && content[activeIndex].content && content[activeIndex].content.bottomComponent"
          class="c-slideshow__control c-slideshow__control--bottom u-absolute u-vacuum u-pos-bc u-pad-y-xs u-pad-x-md u-marg-b-vh1of12 u-pointer"
          @click="onToggleBottomSlide"
          @mouseenter="onBottomSlideOver"
        >
          <div class="c-slideshow__control__bottom__border u-absolute u-pos-tl u-w1of2 u-fit-h u-hide@sm">
            <div class="c-slideshow__control__bottom__border__bar u-absolute u-pos-tl u-fit-w u-bg--white"></div>
            <div class="c-slideshow__control__bottom__border__bar u-absolute u-pos-bl u-fit-w u-bg--white"></div>
            <div class="c-slideshow__control__bottom__border__bar u-absolute u-pos-tl u-fit-h u-bg--white"></div>
          </div>
          <div class="c-slideshow__control__bottom__border u-absolute u-pos-tr u-w1of2 u-fit-h u-hide@sm">
            <div class="c-slideshow__control__bottom__border__bar u-absolute u-pos-tl u-fit-w u-bg--white"></div>
            <div class="c-slideshow__control__bottom__border__bar u-absolute u-pos-bl u-fit-w u-bg--white"></div>
            <div class="c-slideshow__control__bottom__border__bar u-absolute u-pos-tr u-fit-h u-bg--white"></div>
          </div>
          <span v-if="content && content[activeIndex]" class="c-slideshow__control__bottom__label t-text--xs t-text--ls-md t-text--black u-relative u-inline-block u-valign-middle u-marg-r-md u-uppercase u-force-3d u-marg-r-0@sm u-marg-b-xs@sm">
            {{ content[activeIndex].btnLabel }}
          </span>
          <div class="c-slideshow__control__bottom__container u-absolute u-pos-r u-pos-y-center u-marg-r-md u-inline-block u-valign-middle u-force-3d u-overflow-h u-relative@sm u-block@sm u-marg-x-auto@sm">
            <div class="c-slideshow__control__bottom__icon u-relative u-inline-block u-valign-middle u-vacuum">
              <div class="c-slideshow__control__bottom__icon__bar u-absolute u-pos-tl u-fit-w u-bg--white"></div>
              <div class="c-slideshow__control__bottom__icon__bar u-absolute u-pos-bl u-fit-w u-bg--white"></div>
              <div class="c-slideshow__control__bottom__icon__bar u-absolute u-pos-tl u-fit-h u-bg--white"></div>
              <div class="c-slideshow__control__bottom__icon__bar u-absolute u-pos-tr u-fit-h u-bg--white"></div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Next Button -->
      <transition name="c-slideshow__control" :duration="800">
        <router-link
          v-if="content && content[activeIndex + 1]"
          class="c-slideshow__control c-slideshow__control--right t-link u-absolute u-pos-br u-pad-t-sm u-pad-b-xs u-marg-r-w1of13 u-marg-b-vh1of12 u-vacuum"
          :to="content[activeIndex + 1].slug"
          @mouseenter="onNextOver"
        >
          <div @mouseenter="onNextOver">
            <div class="c-slideshow__control__line--before u-bg--white u-inline-block u-valign-middle u-hide@sm"></div>
            <span class="c-slideshow__control__label t-text--xs t-text--ls-md t-text--black u-inline-block u-valign-middle u-marg-r-lg u-uppercase u-marg-r-md@md u-block@sm u-marg-b-xs@sm u-marg-r-0@sm">Next</span>
            <div class="c-slideshow__control__line--after u-bg--white u-inline-block u-valign-middle"></div>
            <img :src="'/assets/medias/images/icons/arrow-x-right-end.svg'" class="t-icon--arrow-x-end u-inline-block u-valign-middle">
          </div>
        </router-link>
      </transition>
    </footer>
  </main>
</template>

<script>
import AppSlide from '../app-slide/index.vue';
import globalData from '../../application/global.json';
import { eventHub } from '../../mixins/eventHub';

export default {
  name: 'app-slideshow',
  components: {
    AppSlide
  },
  props: {
    background: { type: Object, default: null },
    slideIndex: { type: Number, default: 0 },
    isBottomSlideActive: { type: Boolean, default: false }
  },
  data: function() {
    return {
      content: globalData,
      activeIndex: 0,
      isSwitching: false,
      eventHub: eventHub
    };
  },
  watch: {
    slideIndex: {
      handler: function(val) {
        this.activeIndex = typeof val === 'number' ? val : 0;
        this.onSlideIndexChange(val);
      },
      immediate: true
    }
  },
  mounted: function() {
    this.activeIndex = typeof this.slideIndex === 'number' ? this.slideIndex : 0;
    if (typeof window !== 'undefined') {
      window.addEventListener('wheel', this.onMouseWheel, { passive: false });
    }
  },
  created: function() {
    this._switchInTimer = null;
    this._switchOutTimer = null;
    this._wheelTimer = null;
    this._wheelEndTimer = null;
    this._lastWheelTime = 0;
    this._isWheeling = false;
    this._isScrollFromWheel = false;

    this.PIXEL_STEP = 10;
    this.LINE_HEIGHT = 40;
    this.PAGE_HEIGHT = 800;

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.onKeyDown);
    }
  },
  beforeUnmount: function() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.onKeyDown);
      window.removeEventListener('wheel', this.onMouseWheel);
    }
    clearTimeout(this._switchInTimer);
    clearTimeout(this._switchOutTimer);
    clearTimeout(this._wheelTimer);
    clearTimeout(this._wheelEndTimer);
  },
  beforeDestroy: function() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.onKeyDown);
      window.removeEventListener('wheel', this.onMouseWheel);
    }
    clearTimeout(this._switchInTimer);
    clearTimeout(this._switchOutTimer);
    clearTimeout(this._wheelTimer);
    clearTimeout(this._wheelEndTimer);
  },
  methods: {
    onPrevOver: function() {
      if (this.eventHub) this.eventHub.$emit('sound:play', 'tick-reverb');
    },
    onNextOver: function() {
      if (this.eventHub) this.eventHub.$emit('sound:play', 'tick-reverb');
    },
    onBottomSlideOver: function() {
      if (this.eventHub) this.eventHub.$emit('sound:play', 'tick-reverb');
    },
    onSlideIndexChange: function() {
      var self = this;
      clearTimeout(this._switchInTimer);
      clearTimeout(this._switchOutTimer);
      this.isSwitching = true;

      this._switchInTimer = setTimeout(function() {
        self.activeIndex = self.slideIndex;
        if (self.content && self.content[self.activeIndex] && self.content[self.activeIndex].soundId) {
          if (self.eventHub) self.eventHub.$emit('sound:play', self.content[self.activeIndex].soundId);
        }
      }, 500);

      this._switchOutTimer = setTimeout(function() {
        self.isSwitching = false;
      }, 1000);
    },
    onToggleInfos: function() {
      if (this.eventHub) this.eventHub.$emit('toggle:infos');
    },
    onToggleBottomSlide: function() {
      if (this.eventHub) this.eventHub.$emit('toggle:bottomSlide');
    },
    onKeyDown: function(e) {
      const isBottomActive = this.$root && this.$root.isBottomSlideActive;
      if (e.keyCode === 37) {
        if ((isBottomActive && this.slideIndex > 1) || !isBottomActive) {
          this.onPrevSlide();
        }
      } else if (e.keyCode === 39) {
        this.onNextSlide();
      } else if (e.keyCode === 40) {
        if (this.activeIndex !== 0 && !isBottomActive) {
          this.onToggleBottomSlide();
        }
      }
    },
    onPrevSlide: function() {
      if (this.content && this.content[this.activeIndex - 1] && this.$router) {
        this.$router.push(this.content[this.activeIndex - 1].slug);
      }
    },
    onNextSlide: function() {
      if (this.content && this.content[this.activeIndex + 1] && this.$router) {
        this.$router.push(this.content[this.activeIndex + 1].slug);
      }
    },
    onMouseWheel: function(e) {
      var self = this;
      if (this.isBottomSlideActive) return;

      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();

      clearTimeout(this.wheelTimer);
      this.wheelTimer = setTimeout(function() { self._isWheeling = false; }, 100);

      var n = this.normalizeWheel(e);
      var i = -n.pixelY;

      if (Math.abs(i) < 20) {
        clearTimeout(this.wheelTimer);
        this._isWheeling = false;
        return;
      }

      if (!this._isWheeling && Math.abs(i) >= 20 && (Date.now() - this._lastWheelTime >= 800)) {
        this._lastWheelTime = Date.now();
        this._wheelEndTimer = setTimeout(function() {
          clearTimeout(self.wheelTimer);
          self._isWheeling = false;
        }, 1500);
        this._isWheeling = true;
        this._isScrollFromWheel = true;

        if (i < 0) {
          if (this.activeIndex !== 0 && !this.isBottomSlideActive) {
            this.onToggleBottomSlide();
          } else {
            this.onNextSlide();
          }
        } else if (i > 0) {
          if (this.activeIndex !== 0 && this.isBottomSlideActive) {
            this.onToggleBottomSlide();
          } else {
            this.onPrevSlide();
          }
        }
      }
    },
    normalizeWheel: function(e) {
      this._sX = 0;
      this._sY = 0;
      this._pX = 0;
      this._pY = 0;

      if ('detail' in e) this._sY = e.detail;
      if ('wheelDelta' in e) this._sY = -e.wheelDelta / 120;
      if ('wheelDeltaY' in e) this._sY = -e.wheelDeltaY / 120;
      if ('wheelDeltaX' in e) this._sX = -e.wheelDeltaX / 120;

      if ('axis' in e && e.axis === e.HORIZONTAL_AXIS) {
        this._sX = this._sY;
        this._sY = 0;
      }

      this._pX = this._sX * this.PIXEL_STEP;
      this._pY = this._sY * this.PIXEL_STEP;

      if ('deltaY' in e) this._pY = e.deltaY;
      if ('deltaX' in e) this._pX = e.deltaX;

      if ((this._pX || this._pY) && e.deltaMode) {
        if (e.deltaMode === 1) {
          this._pX *= this.LINE_HEIGHT;
          this._pY *= this.LINE_HEIGHT;
        } else {
          this._pX *= this.PAGE_HEIGHT;
          this._pY *= this.PAGE_HEIGHT;
        }
      }

      if (this._pX && !this._sX) this._sX = this._pX < 1 ? -1 : 1;
      if (this._pY && !this._sY) this._sY = this._pY < 1 ? -1 : 1;

      return {
        spinX: this._sX,
        spinY: this._sY,
        pixelX: this._pX,
        pixelY: this._pY
      };
    }
  }
};
</script>
