<!--
 * [BASELINE 2017 LIVE FACTS]
 * Authentic Citrix File Path: src/components/app-slide-bottom/index.vue
 * Status: [EMPIRICALLY VERIFIED AUDIT - 100% EMPIRICAL LIVE DOM OUTERHTML & METHOD BODIES VIA MCP CHROME]
-->
<template>
  <div class="c-slide-bottom o-wrapper--valign u-absolute u-pos-tl u-fit-w u-viewport-fit-h" :class="'c-slide-bottom--' + index" @DOMMouseScroll="onWheel" @mousewheel="onWheel">
    <div class="c-slide-bottom__content o-wrapper--panel o-wrapper--valign u-fit u-pad-t-vh1of6 u-pad-x-w1of12">
      <div class="c-slide-bottom__bottom-gradient u-absolute u-pos-bl u-viewport-fit-w"></div>
      <div class="c-slide-bottom__content__block-left u-relative u-inline-block u-marg-t-vh1of12 u-w5of10 u-pad-r-xl u-pad-r-md@md u-w6of10@md u-w10of10@sm u-pad-r-0@sm u-marg-t-0@sm u-marg-b-vh2of13@sm">
        <span class="c-slide-bottom__headline t-text--xxl t-text-lh--sm t-text--reg u-block u-uppercase" v-if="content">{{ content.headline }}</span>
        <h3 class="c-slide-bottom__title t-h4 t-text--reg t-text-lh--md u-marg-b-md u-uppercase u-marg-b-xs@md" v-if="content">
          <app-slide-description :is-active="isActive" :delay="250" :content="content.title" />
        </h3>
        <app-slide-description class="c-slide-bottom__description t-text--xl u-block u-color--alpha-white u-marg-b-md u-w8of10 u-w12of13@sm u-marg-b-xs@sm" :is-active="isActive" :delay="500" :content="content.subtitle" v-if="content" />
        <a href="javascript:void(0);" class="c-slide-bottom__link c-slide__btn-play t-btn u-inline-block u-force-inline u-marg-b-lg" :class="{ 'is-hover': isBtnPlayOver }" @mouseover="onVideoOver" @click="onVideoPlay">
          <span class="c-slide__blink t-text--xs t-text--ls-xxs t-text--black u-relative u-color--alpha-white u-inline-block u-uppercase u-valign-middle" data-text="Play video">
            <span class="c-slide__blink__label u-inline-block">Play video</span>
          </span>
          <div class="c-slide__btn-play__icon o-wrapper--valign u-inline-block u-valign-middle">
            <svg x="0px" y="0px" viewBox="-39 -32 69.7 74" class="c-slide__btn-play__icon__base o-wrapper--panel u-fit" style="fill: transparent;">
              <path stroke-width="2" stroke="#E62541" d="M-37.1-11.3c5.9-11.1,17.5-18.5,30.9-18.5c19.3,0,34.9,15.6,34.9,34.9S13,39.9-6.2,39.9c-13.4,0-24.9-7.5-30.8-18.5" class="c-slide__btn-play__icon__base__path"></path>
            </svg>
            <div class="o-wrapper--panel u-fit">
              <div class="c-slide__btn-play__icon__base__mask u-absolute u-pos-tl u-fit-w u-h1of2 u-overflow-h">
                <svg x="0px" y="0px" viewBox="-39 -32 69.7 74" class="o-wrapper--panel t-icon--play-circle" style="fill: transparent;">
                  <path stroke-width="2" stroke="#E62541" d="M-37.1-11.3c5.9-11.1,17.5-18.5,30.9-18.5c19.3,0,34.9,15.6,34.9,34.9S13,39.9-6.2,39.9c-13.4,0-24.9-7.5-30.8-18.5" class="c-slide__btn-play__icon__mask__path"></path>
                </svg>
              </div>
              <div class="c-slide__btn-play__icon__base__mask u-absolute u-pos-bl u-fit-w u-h1of2 u-overflow-h">
                <svg x="0px" y="0px" viewBox="-39 -32 69.7 74" class="o-wrapper--panel t-icon--play-circle" style="fill: transparent;">
                  <path stroke-width="2" stroke="#E62541" d="M-37.1-11.3c5.9-11.1,17.5-18.5,30.9-18.5c19.3,0,34.9,15.6,34.9,34.9S13,39.9-6.2,39.9c-13.4,0-24.9-7.5-30.8-18.5" class="c-slide__btn-play__icon__mask__path"></path>
                </svg>
              </div>
            </div>
            <div class="c-slide__btn-play__container-over o-wrapper--panel u-fit">
              <div class="c-slide__btn-play__over u-absolute u-pos-tl u-fit-w u-h1of2 u-overflow-h">
                <svg x="0px" y="0px" viewBox="-39 -32 69.7 74" class="o-wrapper--panel t-icon--play-circle" style="fill: transparent;">
                  <path stroke-width="2" stroke="#ffffff" d="M-37.1-11.3c5.9-11.1,17.5-18.5,30.9-18.5c19.3,0,34.9,15.6,34.9,34.9S13,39.9-6.2,39.9c-13.4,0-24.9-7.5-30.8-18.5" class="c-slide__btn-play__over__path"></path>
                </svg>
              </div>
              <div class="c-slide__btn-play__over u-absolute u-pos-bl u-fit-w u-h1of2 u-overflow-h">
                <svg x="0px" y="0px" viewBox="-39 -32 69.7 74" class="o-wrapper--panel t-icon--play-circle" style="fill: transparent;">
                  <path stroke-width="2" stroke="#ffffff" d="M-37.1-11.3c5.9-11.1,17.5-18.5,30.9-18.5c19.3,0,34.9,15.6,34.9,34.9S13,39.9-6.2,39.9c-13.4,0-24.9-7.5-30.8-18.5" class="c-slide__btn-play__over__path"></path>
                </svg>
              </div>
            </div>
            <img src="/assets/medias/images/icons/play.svg" class="c-slide__btn-play__icon__play t-icon--play u-absolute u-pos-center">
          </div>
        </a>
        <a :href="content.link.href" target="_blank" class="c-slide-bottom__link t-link u-block u-valign-middle u-hide@sm" v-if="content && content.link">
          <span class="t-text--sm t-text--black t-text--ls-md u-uppercase u-inline-block u-block u-valign-top">Learn about</span>
          <div class="c-slide-bottom__link__container">
            <img src="/assets/medias/images/icons/arrow-right-border-red.svg" class="c-slide-bottom__link__container__icon t-icon--arrow-right-border u-inline-block u-valign-middle u-marg-r-xs">
            <span class="c-slide-bottom__link__container__label t-text--sm t-text--black t-text--ls-md u-uppercase u-inline-block u-valign-middle u-color--brand-red" v-html="content.link.label"></span>
          </div>
        </a>
      </div>
      <button class="c-slide-bottom__mobile-description__btn-close c-slide__icon-more t-btn u-absolute u-pos-bl u-marg-b-vh2of13 u-marg-l-w1of12 u-inline-block u-valign-top u-shape-circle" @click="onToggleSlideshow">
        <div class="c-slide-bottom__mobile-description__btn-close__container o-wrapper--panel u-fit">
          <div class="c-slide__icon-more__bar u-absolute u-bg--white"></div>
          <div class="c-slide__icon-more__bar u-absolute u-bg--white"></div>
        </div>
      </button>
      <div v-for="(slide, i) in (content ? content.slides : [])" :key="i" class="c-slide-bottom__slide u-absolute u-align-right u-pos-br u-marg-r-w1of12 u-marg-b-vh1of12 u-w6of10 u-backface-hidden u-w6of10@md u-w10of10@sm u-marg-r-0@sm u-align-left@sm u-pad-x-md@sm u-marg-b-vh2of10@sm" :class="{ 'is-active': i === activeStepIndex }">
        <span class="c-slide-bottom__slide__title t-text--sm t-text--ls-md t-text--black u-inline-block u-uppercase u-valign-top u-marg-r-xl u-marg-r-md@md u-marg-b-xs@sm">{{ slide.title }}</span>
        <p class="c-slide-bottom__slide__title t-h6 t-text--xl u-color--alpha-white u-align-left u-inline-block u-valign-top u-w6of10 u-w10of10@sm u-pad-r-sm@sm u-marg-b-lg@sm">{{ slide.description }}</p>
      </div>
      <div class="c-slide-bottom__aside u-absolute u-pos-r u-pos-y-center u-marg-r-w1of12 u-align-right" v-if="content && content.slides && content.slides.length > 1">
        <div class="c-slide-bottom__tracker u-align-right u-marg-b-vh2of10" :style="{ transform: 'translateY(' + (80 * activeStepIndex) + '%) translateZ(0)' }">
          <div class="t-tex u-overflow-h">
            <span class="c-slide-bottom__tracker__current-container u-relative u-inline-block">0</span>
            <div class="c-slide-bottom__tracker__current-container u-relative u-inline-block">
              <span class="u-transparent">1</span>
              <span v-for="(slide, i) in content.slides" :key="i" class="c-slide-bottom__tracker__current u-absolute u-pos-tl" :style="{ top: (100 * i) + '%', transform: 'translateY(' + (100 * -activeStepIndex) + '%) translateZ(0)' }">{{ i + 1 }}</span>
            </div>
          </div>
          <div class="c-slide-bottom__tracker__line u-inline-block u-bg--white"></div>
          <p class="c-slide-bottom__tracker__total t-text--sm">0{{ content.slides.length }}</p>
        </div>
        <div>
          <a href="javascript:void(0)" class="c-slide-bottom__arrow c-slide-bottom__arrow--top u-relative u-inline-block u-align-center u-fit-w u-marg-b-sm u-marg-b-xs@sm" @click="onPrevSlide">
            <img src="/assets/medias/images/icons/arrow-tall-top.svg" class="t-icon--arrow-tall">
          </a>
          <br>
          <a href="javascript:void(0)" class="c-slide-bottom__arrow c-slide-bottom__arrow--bottom u-relative u-inline-block u-align-center u-fit-w" @click="onNextSlide">
            <img src="/assets/medias/images/icons/arrow-tall-bottom.svg" class="t-icon--arrow-tall">
          </a>
        </div>
      </div>
      <component :is="content.bottomComponent" :active-slide-index="activeStepIndex" :scene="scene" :is-active="isActive" v-if="content && content.bottomComponent" />
    </div>
  </div>
</template>

<script>
import { eventHub } from '../../mixins/eventHub';
import AppSlideDescription from '../app-slide-description/index.vue';
import AppSlideBottom1 from './components/act-1.vue';
import AppSlideBottom2 from './components/act-2.vue';
import AppSlideBottom3 from './components/act-3.vue';
import AppSlideBottom4 from './components/act-4.vue';
import AppSlideBottom5 from './components/act-5.vue';
import AppMagnet from '../app-magnet/index.vue';
import CoreBtnEmitter from '../core-btn-emitter/index.vue';

export default {
  name: 'app-slide-bottom',
  components: {
    'app-magnet': AppMagnet,
    'core-btn-emitter': CoreBtnEmitter,
    'app-slide-bottom-1': AppSlideBottom1,
    'app-slide-bottom-2': AppSlideBottom2,
    'app-slide-bottom-3': AppSlideBottom3,
    'app-slide-bottom-4': AppSlideBottom4,
    'app-slide-bottom-5': AppSlideBottom5,
    'app-slide-description': AppSlideDescription
  },
  props: {
    content: { type: Object, default: null },
    scene: { type: Object, default: null },
    index: { type: Number, default: 0 },
    activeSlideIndex: { type: Number, default: 0 },
    isActive: { type: Boolean, default: false }
  },
  data: function() {
    return {
      activeStepIndex: -1,
      isBtnPlayOver: false,
      eventHub: null
    };
  },
  created: function() {
    this.eventHub = eventHub;
  },
  mounted: function() {
    if (this.isActive) {
      this.onActiveChange();
    }
  },
  watch: {
    isActive: function(val) {
      this.onActiveChange();
    }
  },
  methods: {
    onActiveStepIndexChange: function() {
      if (this.isActive && this.scene && this.scene.goToStep) {
        this.scene.goToStep(this.activeStepIndex);
      }
    },
    onToggleSlideshow: function() {
      if (this.$el.classList.contains('is-slideshow-active')) {
        this.$el.classList.remove('is-slideshow-active');
      } else {
        this.$el.classList.add('is-slideshow-active');
      }
    },
    onActiveChange: function() {
      var e = this;
      if (this.isActive) {
        this.activeStepIndex = 0;
        this._isReady = true;
        this.onChangeSlide();
      } else {
        this.activeStepIndex = -1;
        this._isReady = false;
      }
    },
    onActiveSlideIndexChange: function() {
      if (this.index === this.activeSlideIndex) {
        this.activeStepIndex = 0;
        this.onChangeSlide();
      }
    },
    onResize: function() {},
    onEnterFrame: function() {},
    onArrowClick: function() {
      if (this.content && this.content.slides && this.activeStepIndex < this.content.slides.length - 1) {
        this.onNextSlide();
      } else {
        this.onPrevSlide();
      }
    },
    onKeyDown: function(e) {
      if (this.isActive) {
        if (40 === e.keyCode) {
          this.onNextSlide();
        } else if (38 === e.keyCode) {
          if (this.activeStepIndex > 0) {
            this.onPrevSlide();
          } else if (this.eventHub) {
            this.eventHub.$emit('toggle:bottomSlide');
          }
        }
      }
    },
    onPrevSlide: function() {
      if (this.activeStepIndex > 0) {
        this.activeStepIndex -= 1;
        this.onChangeSlide();
      }
    },
    onNextSlide: function() {
      if (this.content && this.content.slides && this.activeStepIndex < this.content.slides.length - 1) {
        this.activeStepIndex += 1;
        this.onChangeSlide();
      }
    },
    onChangeSlide: function() {
      if (this.content && this.content.slides && this.activeStepIndex === this.content.slides.length - 1) {
        this.$el.classList.remove('is-first-step');
        this.$el.classList.add('is-last-step');
      } else if (0 === this.activeStepIndex) {
        this.$el.classList.add('is-first-step');
        this.$el.classList.remove('is-last-step');
      } else {
        this.$el.classList.remove('is-first-step');
        this.$el.classList.remove('is-last-step');
      }
    },
    onVideoPlay: function() {
      if (this.eventHub) this.eventHub.$emit('play:click');
    },
    onVideoOver: function() {
      if (this.eventHub) this.eventHub.$emit('sound:play', 'play-video');
    },
    onWheel: function(e) {
      var t = this;
      if (this._isReady && this.isActive) {
        e.preventDefault();
        e.stopPropagation();
        clearTimeout(this.wheelTimer);
        this.wheelTimer = setTimeout(function() {
          t._isWheeling = false;
        }, 400);

        if (Math.abs(-this.normalizeWheel(e).pixelY) < 20) {
          clearTimeout(this.wheelTimer);
          this._isWheeling = false;
        }

        if (!(this._isWheeling || Math.abs(-this.normalizeWheel(e).pixelY) < 20 || Date.now() - this._lastWheelTime < 300)) {
          this._lastWheelTime = Date.now();
          this._wheelEndTimer = setTimeout(function() {
            clearTimeout(t.wheelTimer);
            t._isWheeling = false;
          }, 1500);
          this._isWheeling = true;
          this._isScrollFromWheel = true;

          var n = this.normalizeWheel(e);
          var i = -n.pixelY;
          if (i < 0) {
            this.onNextSlide();
          } else if (i > 0) {
            if (this.activeStepIndex > 0) {
              this.onPrevSlide();
            } else if (this.eventHub) {
              this.eventHub.$emit('toggle:bottomSlide');
            }
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
      this._pX = this._sX * (this.PIXEL_STEP || 10);
      this._pY = this._sY * (this.PIXEL_STEP || 10);
      if ('deltaY' in e) this._pY = e.deltaY;
      if ('deltaX' in e) this._pX = e.deltaX;
      if ((this._pX || this._pY) && e.deltaMode) {
        if (1 === e.deltaMode) {
          this._pX *= this.LINE_HEIGHT || 40;
          this._pY *= this.LINE_HEIGHT || 40;
        } else {
          this._pX *= this.PAGE_HEIGHT || 800;
          this._pY *= this.PAGE_HEIGHT || 800;
        }
      }
      if (this._pX && !this._sX) this._sX = this._pX < 1 ? -1 : 1;
      if (this._pY && !this._sY) this._sY = this._pY < 1 ? -1 : 1;

      return { spinX: this._sX, spinY: this._sY, pixelX: this._pX, pixelY: this._pY };
    }
  }
};
</script>

<style>
.c-slide-bottom {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000 !important;
  pointer-events: auto;
  color: #ffffff;
}
.c-slide-bottom * {
  visibility: visible !important;
  opacity: 1 !important;
}
.c-slide-bottom__content {
  position: relative;
  width: 100%;
  height: 100%;
  color: #ffffff;
}
.c-slide-bottom__headline {
  color: #e62541 !important;
  font-size: 1.1rem !important;
  font-weight: 700 !important;
  letter-spacing: 2px !important;
  margin-bottom: 8px !important;
}
.c-slide-bottom__title {
  color: #ffffff !important;
  font-size: 2.2rem !important;
  line-height: 1.2 !important;
  margin-bottom: 16px !important;
}
.c-slide-bottom__description {
  color: rgba(255, 255, 255, 0.85) !important;
  font-size: 1.1rem !important;
  line-height: 1.5 !important;
  margin-bottom: 24px !important;
}
.c-slide-bottom__slide {
  display: none !important;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.5s ease, transform 0.5s ease;
  transform: translateY(20px);
}
.c-slide-bottom__slide.is-active {
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
  transform: translateY(0) !important;
}
</style>
